import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

// --- Test doubles (hoisted so vi.mock factories can use them) ---------------
const h = vi.hoisted(() => ({
  generateResponse: vi.fn(),
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

vi.mock("@/lib/llm/service", () => ({
  llmService: { generateResponse: h.generateResponse },
}))

process.env.TEOS_CHAT_RATE_LIMIT_PER_MIN = "12"

type RouteModule = typeof import("@/app/api/teos/chat/route")

let POST: RouteModule["POST"]

function makeRequest(body: unknown, opts: { headers?: Record<string, string> } = {}): Request {
  return new Request("https://app.test/api/teos/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...(opts.headers ?? {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

beforeAll(async () => {
  const routeModule = await import("@/app/api/teos/chat/route")
  POST = routeModule.POST
})

beforeEach(async () => {
  h.generateResponse.mockReset()
  process.env.TEOS_CHAT_RATE_LIMIT_PER_MIN = "12"
  const { resetRateLimiter } = await import("@/lib/rate-limit")
  resetRateLimiter()
})

afterAll(() => {
  delete process.env.TEOS_CHAT_RATE_LIMIT_PER_MIN
})

describe("POST /api/teos/chat", () => {
  it("rejects an unknown/extra request field with 400", async () => {
    const res = await POST(
      makeRequest({ messages: [{ role: "user", content: "hi" }], mode: "quality" })
    )
    expect(res.status).toBe(400)
    expect(h.generateResponse).not.toHaveBeenCalled()
  })

  it("rejects an empty messages array with 400", async () => {
    const res = await POST(makeRequest({ messages: [] }))
    expect(res.status).toBe(400)
  })

  it("rejects an empty message content with 400", async () => {
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "" }] }))
    expect(res.status).toBe(400)
  })

  it("delegates to the server LLM service and returns the answer", async () => {
    h.generateResponse.mockResolvedValue("answer from the cloud LLM")

    const res = await POST(
      makeRequest({
        messages: [{ role: "user", content: "What is TEOS?" }],
        search_mode: "deep",
        restrict_to_official_sources: true,
      })
    )
    expect(res.status).toBe(200)
    const payload = (await res.json()) as { answer: string }
    expect(payload.answer).toBe("answer from the cloud LLM")

    const [messages, mode, restrict] = h.generateResponse.mock.calls[0] as unknown as [
      Array<{ role: string; content: string }>,
      string,
      boolean,
    ]
    expect(messages).toEqual([{ role: "user", content: "What is TEOS?" }])
    expect(mode).toBe("deep")
    expect(restrict).toBe(true)
  })

  it("defaults to balanced mode and non-restricted sources", async () => {
    h.generateResponse.mockResolvedValue("ok")

    const res = await POST(makeRequest({ messages: [{ role: "user", content: "hi" }] }))
    expect(res.status).toBe(200)

    const [, mode, restrict] = h.generateResponse.mock.calls[0] as unknown as [
      Array<{ role: string; content: string }>,
      string,
      boolean,
    ]
    expect(mode).toBe("balanced")
    expect(restrict).toBe(false)
  })

  it("rate limits per source IP and returns 429 with Retry-After", async () => {
    process.env.TEOS_CHAT_RATE_LIMIT_PER_MIN = "2"
    h.generateResponse.mockResolvedValue("ok")

    const first = await POST(makeRequest({ messages: [{ role: "user", content: "a" }] }))
    const second = await POST(makeRequest({ messages: [{ role: "user", content: "b" }] }))
    const third = await POST(makeRequest({ messages: [{ role: "user", content: "c" }] }))
    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect(third.status).toBe(429)
    expect(third.headers.get("Retry-After")).toBeTruthy()
    expect(h.generateResponse).toHaveBeenCalledTimes(2)
  })

  it("maps an upstream failure to a stable 500 envelope", async () => {
    h.generateResponse.mockRejectedValue(new Error("provider exploded"))

    const res = await POST(makeRequest({ messages: [{ role: "user", content: "hi" }] }))
    expect(res.status).toBe(500)
    const payload = (await res.json()) as { error: { code: string } }
    expect(payload.error.code).toBe("internal_error")
  })
})