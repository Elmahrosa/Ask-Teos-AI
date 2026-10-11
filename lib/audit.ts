// TEOS AI — server-side audit trail for the agent API route.
//
// Rules:
//   - The raw query/message is NEVER stored. Only `sha256:` digest + length.
//   - Tool decisions are copied from the service response, sanitized to a
//     fixed allow-list of fields (tool/status/reason + sentinel fragment).
//   - No bearer tokens, no service keys, no secrets are ever written.
//   - If the audit store cannot be written, callers must FAIL CLOSED (the
//     route returns 503 rather than serving an unrecorded execution).

import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { createHash, randomUUID } from "node:crypto"

export class AuditWriteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuditWriteError"
  }
}

export function newCorrelationId(): string {
  return `corr_${randomUUID().replace(/-/g, "")}`
}

export function newEventId(): string {
  return `evt_${randomUUID().replace(/-/g, "")}`
}

export function sha256Digest(text: string): string {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`
}

export interface AuditToolDecision {
  tool: string
  allowed: boolean
  reason?: string | null
  sentinel?: { verdict?: unknown; rule?: unknown; score?: unknown } | null
  duration_ms?: number
}

export interface AgentAuditEvent {
  event_id: string
  correlation_id: string
  request_id: string
  ts: string
  service: "ask-teos-ai"
  user: { kind: "unauthenticated"; user_id: string | null; is_founder: boolean }
  authz: "allowed" | "denied"
  persona: string
  model?: string
  tool_decisions: AuditToolDecision[]
  outcome: "success" | "error" | "policy_denied" | "auth_failed" | "rate_limited"
  duration_ms: number
  query_digest: string
  query_len: number
  error?: { code: string; message: string } | null
}

/** Keep only the harmless, useful parts of a sentinel decision fragment. */
export function sanitizeSentinel(
  sentinel: Record<string, unknown> | null | undefined
): AuditToolDecision["sentinel"] {
  if (!sentinel || typeof sentinel !== "object") return null
  const out: NonNullable<AuditToolDecision["sentinel"]> = {}
  if ("verdict" in sentinel) out.verdict = sentinel["verdict"]
  if ("rule" in sentinel) out.rule = sentinel["rule"]
  if ("rule_id" in sentinel) out.rule = sentinel["rule_id"]
  if ("score" in sentinel) out.score = sentinel["score"]
  return out
}

/** Map a service ToolEvent into an audit decision (no secrets). */
export function toAuditDecision(event: {
  tool: string
  status: "executed" | "denied" | "error"
  reason?: string | null
  duration_ms?: number
  sentinel?: Record<string, unknown> | null
}): AuditToolDecision {
  return {
    tool: event.tool,
    allowed: event.status === "executed",
    reason: event.status === "denied" ? event.reason ?? "denied" : event.reason ?? null,
    sentinel: sanitizeSentinel(event.sentinel),
    duration_ms: event.duration_ms,
  }
}

export interface AuditWriterOptions {
  dir?: string
  failClosed?: boolean
}

export class AuditWriter {
  private readonly dirOverride: string | undefined
  private readonly failClosed: boolean

  constructor(opts: AuditWriterOptions = {}) {
    this.dirOverride = opts.dir
    this.failClosed = opts.failClosed ?? true
  }

  private dir(): string {
    return this.dirOverride ?? process.env.TEOS_AGENT_AUDIT_DIR ?? "./data/audit"
  }

  async append(event: AgentAuditEvent): Promise<void> {
    try {
      const target = this.dir()
      await mkdir(target, { recursive: true })
      // JSONL: one event per line; no secrets by construction (see module doc).
      await appendFile(join(target, "agent-audit.jsonl"), `${JSON.stringify(event)}\n`, "utf8")
    } catch (err) {
      if (this.failClosed) {
        throw new AuditWriteError(`audit store unavailable: ${(err as Error).message}`)
      }
    }
  }
}

export const auditWriter = new AuditWriter()

export async function writeAudit(event: AgentAuditEvent): Promise<void> {
  await auditWriter.append(event)
}