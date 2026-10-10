// TEOS AI — agent API route (milestone 1).
//
// POST-only (only POST is exported; Next returns 405 for other verbs).
//
// Security posture:
//   - Server-side Pi access-token verification (RS256, fail-closed). If the
//     public key set cannot be verified, the route refuses to execute (503).
//   - Strict request schema (zod, no unknown fields). The caller cannot pass a
//     user id, a persona other than "know", tools, or policy overrides.
//   - Rate limited per authenticated user (fallback: source IP).
//   - Every execution attempt is audited server-side; audit failure fails
//     closed (503) — a run is never served unrecorded.
//   - Audit stores digest + length of the message, never the raw text, and
//     never any token/key.
//   - Errors are a stable {error:{code,message}} envelope; upstream internals
//     and the model engine are never named or leaked.
//
// Brand: surface is "TEOS AI" (Elmahrosa International).

import { NextResponse } from "next/server"
import { z } from "zod"

import { teosAgent, TeosAgentClientError, newRequestId } from "@/lib/teos-agent"
import { verifyPiToken, PiAuthError, type PiPrincipal } from "@/lib/pi-auth"
import {
  AuditWriteError,
  newCorrelationId,
  newEventId,
  sha256Digest,
  toAuditDecision,
  writeAudit,
  type AgentAuditEvent,
} from "@/lib/audit"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CORRELATION_RE = /^[A-Za-z0-9_-]{8,64}$/
const MAX_MESSAGE_CHARS = 8000

const BodySchema = z
  .object({
    message: z.string().min(1).max(MAX_MESSAGE_CHARS),
    conversation_id: z
      .string()
      .max(128)
      .regex(/^[A-Za-z0-9_-]*$/, "conversation_id must be URL-safe")
      .optional(),
    max_duration_s: z.number().int().min(5).max(300).optional(),
    context: z
      .object({ locale: z.string().max(16).optional() })
      .strict()
      .optional(),
  })
  .strict()

function authMode(): "pi" | "none" {
  return (process.env.TEOS_AGENT_AUTH_MODE ?? "pi").toLowerCase() === "none" ? "none" : "pi"
}

function rateLimitPerMin(): number {
  const raw = Number(process.env.TEOS_AGENT_RATE_LIMIT_PER_MIN ?? 12)
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 12
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? ""
  const match = /^Bearer\s+(.+)$/i.exec(header.trim())
  return match ? match[1]!.trim() : null
}

function clientKey(request: Request, principal: PiPrincipal | null): string {
  if (principal?.uid) return `u:${principal.uid}`
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return `ip:${forwarded || "unknown"}`
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  correlationId: string,
  extra?: Record<string, unknown>,
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    { error: { code, message }, correlation_id: correlationId, ...(extra ?? {}) },
    { status, headers }
  )
}

function buildAudit(
  args: {
    correlationId: string
    eventId: string
    requestId: string
    user: AgentAuditEvent["user"]
    authz: AgentAuditEvent["authz"]
    outcome: AgentAuditEvent["outcome"]
    toolDecisions?: AgentAuditEvent["tool_decisions"]
    model?: string
    durationMs: number
    message: string
    error?: AgentAuditEvent["error"]
  }
): AgentAuditEvent {
  return {
    event_id: args.eventId,
    correlation_id: args.correlationId,
    request_id: args.requestId,
    ts: new Date().toISOString(),
    service: "ask-teos-ai",
    user: args.user,
    authz: args.authz,
    persona: "know",
    model: args.model,
    tool_decisions: args.toolDecisions ?? [],
    outcome: args.outcome,
    duration_ms: args.durationMs,
    query_digest: sha256Digest(args.message),
    query_len: args.message.length,
    error: args.error ?? null,
  }
}

/** Best-effort audit for requests that never reached execution (auth/limit). */
async function auditDenied(event: AgentAuditEvent): Promise<void> {
  try {
    await writeAudit(event)
  } catch {
    // A rejected request is not a successful run; do not turn a 401/429 into a
    // 500. The execution path (below) is the one that fails closed on audit.
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const started = Date.now()
  const eventId = newEventId()
  const requestId = newRequestId()
  const correlationHeader = request.headers.get("x-correlation-id")
  const correlationId =
    correlationHeader && CORRELATION_RE.test(correlationHeader) ? correlationHeader : newCorrelationId()

  // 1) Validate the body up front.
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return errorResponse(400, "invalid_json", "request body must be valid JSON", correlationId)
  }
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    return errorResponse(400, "invalid_request", "invalid request payload", correlationId)
  }
  const body = parsed.data

  // 2) Authenticate (fail closed).
  let principal: PiPrincipal | null = null
  if (authMode() === "pi") {
    const token = bearerToken(request)
    if (!token) {
      await auditDenied(
        buildAudit({
          correlationId, eventId, requestId,
          user: { kind: "unauthenticated", user_id: null, is_founder: false },
          authz: "denied", outcome: "auth_failed",
          durationMs: Date.now() - started, message: body.message,
          error: { code: "unauthorized", message: "missing bearer token" },
        })
      )
      return errorResponse(401, "unauthorized", "missing bearer token", correlationId)
    }
    try {
      principal = await verifyPiToken(token)
    } catch (err) {
      const code = err instanceof PiAuthError ? err.code : "invalid_signature"
      const unavailable = code === "jwks_unreachable" || code === "jwks_invalid"
      await auditDenied(
        buildAudit({
          correlationId, eventId, requestId,
          user: { kind: "unauthenticated", user_id: null, is_founder: false },
          authz: "denied", outcome: "auth_failed",
          durationMs: Date.now() - started, message: body.message,
          error: { code: unavailable ? "auth_unavailable" : "unauthorized", message: "token verification failed" },
        })
      )
      if (unavailable) {
        // Cannot verify => refuse to execute (do not trust an unverifiable token).
        return errorResponse(503, "auth_unavailable", "authentication temporarily unavailable", correlationId)
      }
      return errorResponse(401, "unauthorized", "invalid access token", correlationId)
    }
  }

  const user: AgentAuditEvent["user"] = {
    kind: principal ? "pi" : "unauthenticated",
    user_id: principal?.uid ?? null,
    is_founder: false,
  }

  // 3) Rate limit per principal (fallback IP).
  const limit = rateLimitPerMin()
  const rl = rateLimit(clientKey(request, principal), limit)
  if (!rl.ok) {
    await auditDenied(
      buildAudit({
        correlationId, eventId, requestId, user,
        authz: "denied", outcome: "rate_limited",
        durationMs: Date.now() - started, message: body.message,
        error: { code: "rate_limited", message: "too many requests" },
      })
    )
    return errorResponse(429, "rate_limited", "too many requests", correlationId, undefined, {
      "Retry-After": String(rl.retryAfterS),
    })
  }

  // 4) Execute the agent run.
  try {
    const result = await teosAgent.runAgent({
      request_id: requestId,
      message: body.message,
      persona: "know",
      conversation_id: body.conversation_id,
      max_duration_s: body.max_duration_s,
      context: {
        user_id: principal?.uid,
        is_founder: user.is_founder,
        locale: body.context?.locale,
      },
    })

    const toolDecisions = (result.tool_events ?? []).map(toAuditDecision)
    const outcome = result.status === "success" ? "success" : "error"
    const audit = buildAudit({
      correlationId, eventId, requestId, user,
      authz: "allowed", outcome,
      toolDecisions, model: result.model_used,
      durationMs: result.duration_ms ?? Date.now() - started,
      message: body.message,
      error: result.error ?? null,
    })
    // Audit failure here fails closed: we will not serve an unrecorded run.
    await writeAudit(audit)

    return NextResponse.json({
      request_id: requestId,
      correlation_id: correlationId,
      status: result.status,
      answer: result.answer,
      model_used: result.model_used,
      tool_events: result.tool_events,
      duration_ms: result.duration_ms,
      truncated: result.truncated,
      audit_event: result.audit_event,
      ...(result.error ? { error: result.error } : {}),
    })
  } catch (err) {
    const isTimeout = err instanceof TeosAgentClientError && err.code === "timeout"
    const code = isTimeout ? "upstream_timeout" : "upstream_error"
    const status = isTimeout ? 504 : 502
    const message = isTimeout ? "agent service timed out" : "agent service error"
    const audit = buildAudit({
      correlationId, eventId, requestId, user,
      authz: "allowed", outcome: "error",
      durationMs: Date.now() - started, message: body.message,
      error: { code, message },
    })
    try {
      await writeAudit(audit)
    } catch (auditErr) {
      if (auditErr instanceof AuditWriteError) {
        return errorResponse(503, "audit_unavailable", "audit trail unavailable", correlationId)
      }
      throw auditErr
    }
    return errorResponse(status, code, message, correlationId, { request_id: requestId })
  }
}