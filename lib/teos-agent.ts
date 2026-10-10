// TEOS AI — server-side client for the private TEOS AI Agent Service.
//
// Brand: this surface is "TEOS AI" (Elmahrosa International). The model engine
// is deliberately never named, imported, or exposed anywhere in this module or
// in any response it produces.
//
// Security rules enforced here:
//   - Server-only: throws if instantiated/imported in a browser context.
//   - The service bearer key is read from the environment only; it is never
//     logged, echoed, or shipped to the client.
//   - Timeout is mandatory (AbortController); a timed-out call maps to 408.
//   - Non-JSON / non-2xx responses map to typed errors, never raw exceptions.
//
// Env (see .env.example):
//   TEOS_AGENT_URL        private network base URL of the agent service
//   TEOS_AGENT_API_KEY    service-to-service secret
//   TEOS_AGENT_TIMEOUT_MS per-run deadline (default 150000)

import { randomUUID } from "node:crypto"

export interface TeosAgentContext {
  user_id?: string
  is_founder?: boolean
  locale?: string
}

/** Request shape exactly as the service validates it (extra fields are rejected). */
export interface TeosAgentRequest {
  request_id: string // ^[A-Za-z0-9_-]{8,64}$
  message: string // 1..8000 chars
  persona?: "know" // milestone 1: only "know".
  conversation_id?: string // ^[A-Za-z0-9_-]{0,128}$
  context?: TeosAgentContext
  max_duration_s?: number // 5..300
}

export type ToolEventStatus = "executed" | "denied" | "error"

export interface ToolEvent {
  tool: string
  status: ToolEventStatus
  reason?: string | null
  args_digest?: string | null
  ts: string
  duration_ms: number
  /** Sentinel decision fragment (verdict/rule/score only — never secrets). */
  sentinel?: Record<string, unknown> | null
}

export interface TeosAgentResponse {
  request_id: string
  status: "success" | "error"
  answer: string
  model_used: string
  tool_events: ToolEvent[]
  duration_ms: number
  truncated: boolean
  audit_event: string
  error?: { code: string; message: string } | null
}

export interface TeosAgentHealth {
  status: "ok" | "degraded"
  service: string
  version: string
  brain: { connected: boolean; model?: string }
  sentinel: { enabled: boolean; mode: string }
}

export interface TeosAgentErrorBody {
  error: { code: string; message: string }
}

export class TeosAgentClientError extends Error {
  readonly code: string
  readonly status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = "TeosAgentClientError"
    this.code = code
    this.status = status
  }
}

function guardServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error("TeosAgentClient is server-only; do not import it in client code")
  }
}

export interface TeosAgentClientOptions {
  baseUrl?: string
  apiKey?: string
  timeoutMs?: number
  /** Test hook: inject a fetch implementation. */
  fetchImpl?: typeof fetch
}

const DEFAULT_BASE_URL = process.env.TEOS_AGENT_URL ?? "http://teos-agent:8000"
const DEFAULT_TIMEOUT_MS = Number(process.env.TEOS_AGENT_TIMEOUT_MS ?? 150_000)

export class TeosAgentClient {
  private readonly baseUrl: string
  private readonly apiKey: string
  private readonly timeoutMs: number
  private readonly fetchImpl: typeof fetch

  constructor(opts: TeosAgentClientOptions = {}) {
    guardServerOnly()
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "")
    this.apiKey = opts.apiKey ?? process.env.TEOS_AGENT_API_KEY ?? ""
    this.timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
    this.fetchImpl = opts.fetchImpl ?? fetch.bind(globalThis)
  }

  /** GET /health — liveness + startup configuration check (sentinel mode included). */
  async health(): Promise<TeosAgentHealth> {
    return this.#request<TeosAgentHealth>("/health", { method: "GET" })
  }

  /** POST /agent/run — one full agent execution. */
  async runAgent(req: TeosAgentRequest): Promise<TeosAgentResponse> {
    return this.#request<TeosAgentResponse>("/agent/run", {
      method: "POST",
      body: JSON.stringify(req),
    })
  }

  async #request<T>(
    path: string,
    init: { method: string; body?: string }
  ): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method: init.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: init.body,
        signal: controller.signal,
        // Never let a shared edge cache pin a stale answer for a private host.
        cache: "no-store",
      })

      let payload: unknown = null
      try {
        payload = await res.json()
      } catch {
        payload = null
      }

      if (!res.ok) {
        const { error } = (payload ?? {}) as Partial<TeosAgentErrorBody>
        const code = error?.code ?? (res.status === 401 ? "unauthorized" : "upstream_error")
        const message =
          error?.message ?? (payload ? "upstream returned an error" : "upstream returned a non-JSON error")
        throw new TeosAgentClientError(res.status, code, message)
      }

      return payload as T
    } catch (err) {
      if (err instanceof TeosAgentClientError) throw err
      if (err instanceof Error && err.name === "AbortError") {
        throw new TeosAgentClientError(408, "timeout", `agent service timed out after ${this.timeoutMs}ms`)
      }
      throw new TeosAgentClientError(502, "unreachable", `agent service unreachable: ${(err as Error).message}`)
    } finally {
      clearTimeout(timer)
    }
  }
}

/** Shared server-side singleton. Route handlers and server actions only. */
export const teosAgent = new TeosAgentClient()

/** Generate a unique, URL-safe run identifier. */
export function newRequestId(): string {
  return `req_${randomUUID().replace(/-/g, "")}`
}