import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

// --- Test doubles (hoisted so vi.mock factories can use them) ---------------
const h = vi.hoisted(() => ({
  runAgent: vi.fn(),
}))

vi.mock("next/server", () => {
  class MockNextResponse {
    readonly body: unknown
    readonly status: number
    readonly headers: Headers
    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body
      this.status = init?.status ?? 200
      this.headers = new Headers({ "content-type": "application/json", ...(init?.headers ?? {}) })
    }
    static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(body, init)
    }
    async json(): Promise<unknown> {
      return this.body
    }
  }
  return { NextResponse: MockNextResponse }
})

vi.mock("@/lib/teos-agent", () => ({
  teosAgent: { runAgent: h.runAgent },
  newRequestId: () => "req_test_0001",
  TeosAgentClientError: class TeosAgentClientError extends Error {
    readonly code: string
    readonly status: number
    constructor(status: number, code: string, message: string) {
      super(message)
      this.name = "TeosAgentClientError"
      this.status = status
      this.code = code
    }
  },
}))

// --- Environment must be set before the route (and its audit writer) load --
const auditDir = mkdtempSync(join(tmpdir(), "teos-route-audit-"))
process.env.TEOS_AGENT_AUDIT_DIR = auditDir
process.env.TEOS_AGENT_RATE_LIMIT_PER_MIN = "12"

type RouteModule = typeof import("@/app/api/teos/agent/route")

let POST: RouteModule["POST"]
let TeosAgentClientError: typeof import("@/lib/teos-agent").TeosAgentClientError

const auditFile = join(auditDir, "agent-audit.jsonl")

function makeRequest(body: unknown, opts: { method?: string; headers?: Record<string, string> } = {}): Request {
  return new Request("https://app.test/api/teos/agent", {
    method: opts.method ?? "POST",
    headers: {
      "content-type": "application/json",
      ...(opts.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

function lastAudit(): Record<string, unknown> {
  const lines = readFileSync(auditFile, "utf8").trim().split("\n")
  return JSON.parse(lines[lines.length - 1]!) as Record<string, unknown>
}

const okRun = {
  request_id: "req_test_0001",
  status: "success" as const,
  answer: "hello from TEOS AI",
  model_used: "local",
  tool_events: [
    { tool: "kb.search", status: "executed" as const, reason: null, ts: "t", duration_ms: 2, sentinel: { verdict: true, rule: "r1" } },
    { tool: "shell", status: "denied" as const, reason: "policy", ts: "t", duration_ms: 0 },
  ],
  duration_ms: 30,
  truncated: false,
  audit_event: "evt_upstream",
}

beforeAll(async () => {
  const routeModule = await import("@/app/api/teos/agent/route")
  POST = routeModule.POST
  const agent = await import("@/lib/teos-agent")
  TeosAgentClientError = agent.TeosAgentClientError
  const { resetRateLimiter } = await import("@/lib/rate-limit")
  resetRateLimiter()
})

beforeEach(async () => {
  h.runAgent.mockReset()
  process.env.TEOS_AGENT_RATE_LIMIT_PER_MIN = "12"
  process.env.TEOS_AGENT_AUDIT_DIR = auditDir
  const { resetRateLimiter } = await import("@/lib/rate-limit")
  resetRateLimiter()
})

afterAll(() => {
  delete process.env.TEOS_AGENT_AUDIT_DIR
})

describe("POST /api/teos/agent", () => {
  it("rejects an unknown/extra request field (no mode override) with 400", async () => {
    const res = await POST(makeRequest({ message: "hi", mode: "quality" }))
    expect(res.status).toBe(400)
    expect(h.runAgent).not.toHaveBeenCalled()
  })

  it("rejects an empty message with 400", async () => {
    const res = await POST(makeRequest({ message: "" }))
    expect(res.status).toBe(400)
  })

  it("executes a valid request, returns a branded result, and audits digest-only", async () => {
    h.runAgent.mockResolvedValue(okRun)

    const res = await POST(makeRequest({ message: "secret question", conversation_id: "c1" }))
    expect(res.status).toBe(200)
    const payload = (await res.json()) as Record<string, unknown>
    expect(payload.status).toBe("success")
    expect(payload.correlation_id).toBeTypeOf("string")
    expect(payload.request_id).toBe("req_test_0001")
    // Brand safety: no model-engine name ever appears in a client response.
    expect(JSON.stringify(payload)).not.toMatch(/big-?pickle|\bbp\b/i)

    // The client call is forced to persona "know" and carries no caller identity.
    const args = h.runAgent.mock.calls[0]![0]
    expect(args.persona).toBe("know")
    expect(args.message).toBe("secret question")
    expect(args.context.user_id).toBeUndefined()
    expect(args.context.is_founder).toBe(false)

    const audit = lastAudit()
    expect(audit.outcome).toBe("success")
    expect(audit.query_digest).toMatch(/^sha256:/)
    expect(JSON.stringify(audit)).not.toContain("secret question")
    expect((audit.tool_decisions as unknown[]).length).toBe(2)
  })

  it("rate limits per source IP and returns 429 with Retry-After", async () => {
    process.env.TEOS_AGENT_RATE_LIMIT_PER_MIN = "2"
    h.runAgent.mockResolvedValue(okRun)

    const first = await POST(makeRequest({ message: "a" }))
    const second = await POST(makeRequest({ message: "b" }))
    const third = await POST(makeRequest({ message: "c" }))
    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect(third.status).toBe(429)
    expect(third.headers.get("Retry-After")).toBeTruthy()
    expect(h.runAgent).toHaveBeenCalledTimes(2)
  })

  it("maps an upstream timeout to 504", async () => {
    h.runAgent.mockRejectedValue(new TeosAgentClientError(408, "timeout", "slow"))
    const res = await POST(makeRequest({ message: "hi" }))
    expect(res.status).toBe(504)
    expect((await res.json()).error.code).toBe("upstream_timeout")
  })

  it("fails closed with 503 when the audit store is unwritable", async () => {
    const blocker = join(auditDir, "blocker-file")
    writeFileSync(blocker, "x")
    process.env.TEOS_AGENT_AUDIT_DIR = blocker
    h.runAgent.mockResolvedValue(okRun)

    const res = await POST(makeRequest({ message: "hi" }))
    expect(res.status).toBe(503)
    expect((await res.json()).error.code).toBe("audit_unavailable")
  })
})