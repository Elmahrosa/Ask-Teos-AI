// TEOS AI — public chat route (server-side LLM bridge).
//
// Why this route exists: the site chat widget runs in the browser, and
// browser bundles never receive variables that are not `NEXT_PUBLIC_*`, so an
// LLM API key set in Vercel could never reach the providers from the client.
// This route is the single surface that executes llmService with the key
// present only on the server. The client chat posts here instead of importing
// llmService directly (hooks/use-chatbot.ts).
//
// Security posture:
//   - Server-only bridge: the LLM key is read from server env only.
//   - Strict request schema (zod, no unknown fields).
//   - Rate limited per source IP (in-memory fixed window, same pattern as the
//     agent route). State resets per instance/deploy (accepted for milestone 1).
//   - Stable {error:{code,message}} envelope; provider and model internals are
//     never named or leaked to the client.
//
// Brand: surface is "TEOS AI" (Elmahrosa International).

import { NextResponse } from "next/server"
import { z } from "zod"

import { llmService } from "@/lib/llm/service"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_MESSAGES = 20
const MAX_CONTENT_CHARS = 8000

const SearchModeSchema = z.enum(["fast", "balanced", "deep"])

const ChatMessageSchema = z
  .object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string().min(1).max(MAX_CONTENT_CHARS),
  })
  .strict()

const BodySchema = z
  .object({
    messages: z.array(ChatMessageSchema).min(1).max(MAX_MESSAGES),
    search_mode: SearchModeSchema.optional(),
    restrict_to_official_sources: z.boolean().optional(),
  })
  .strict()

function rateLimitPerMin(): number {
  const raw = Number(process.env.TEOS_CHAT_RATE_LIMIT_PER_MIN ?? 12)
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 12
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return `ip:${forwarded || "unknown"}`
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status, headers })
}

export async function POST(request: Request): Promise<NextResponse> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return errorResponse(400, "invalid_json", "request body must be valid JSON")
  }

  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    return errorResponse(400, "invalid_request", "invalid request payload")
  }
  const body = parsed.data

  // Rate limit per source IP.
  const rl = rateLimit(clientKey(request), rateLimitPerMin())
  if (!rl.ok) {
    return errorResponse(429, "rate_limited", "too many requests", {
      "Retry-After": String(rl.retryAfterS),
    })
  }

  try {
    const answer = await llmService.generateResponse(
      body.messages,
      body.search_mode ?? "balanced",
      body.restrict_to_official_sources ?? false
    )
    return NextResponse.json({ answer })
  } catch (err) {
    console.error("chat route error:", err)
    return errorResponse(500, "internal_error", "chat service error")
  }
}