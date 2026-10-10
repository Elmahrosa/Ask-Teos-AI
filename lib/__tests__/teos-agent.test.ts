import { describe, expect, it, vi } from "vitest"

import { TeosAgentClient, TeosAgentClientError, newRequestId } from "@/lib/teos-agent"

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

describe("TeosAgentClient", () => {
  it("sends the service key, uses message (not query), and disables caching", async () => {
    let seenUrl = ""
    let seenInit: RequestInit | undefined
    const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      seenUrl = String(url)
      seenInit = init
      return jsonResponse({
        request_id: "req_1",
        status: "success",
        answer: "ok",
        model_used: "local",
        tool_events: [],
        duration_ms: 5,
        truncated: false,
        audit_event: "evt_1",
      })
    }) as unknown as typeof fetch

    const client = new TeosAgentClient({
      baseUrl: "http://teos-agent:8000/",
      apiKey: "secret-key",
      fetchImpl,
    })
    const res = await client.runAgent({ request_id: "req_1", message: "hello", persona: "know" })

    expect(res.status).toBe("success")
    expect(seenUrl).toBe("http://teos-agent:8000/agent/run")
    expect(seenInit?.method).toBe("POST")
    expect(seenInit?.cache).toBe("no-store")
    const headers = seenInit?.headers as Record<string, string>
    expect(headers.Authorization).toBe("Bearer secret-key")
    const body = JSON.parse(seenInit?.body as string)
    expect(body.message).toBe("hello")
    expect(body).not.toHaveProperty("query")
    expect(body).not.toHaveProperty("mode")
  })

  it("maps a 4xx error envelope to a typed error with status and code", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ error: { code: "unauthorized", message: "bad key" } }, 401)
    ) as unknown as typeof fetch

    const client = new TeosAgentClient({ baseUrl: "http://x", apiKey: "k", fetchImpl })
    await expect(client.runAgent({ request_id: "req_2", message: "hi" })).rejects.toMatchObject({
      name: "TeosAgentClientError",
      status: 401,
      code: "unauthorized",
    })
  })

  it("maps a non-JSON error body to a stable upstream error", async () => {
    const fetchImpl = vi.fn(
      async () => new Response("<html>bad gateway</html>", { status: 502 })
    ) as unknown as typeof fetch

    const client = new TeosAgentClient({ baseUrl: "http://x", apiKey: "k", fetchImpl })
    const err = await client.runAgent({ request_id: "req_3", message: "hi" }).catch((e) => e)
    expect(err).toBeInstanceOf(TeosAgentClientError)
    expect((err as TeosAgentClientError).status).toBe(502)
  })

  it("maps an aborted request to a 408 timeout", async () => {
    const fetchImpl = vi.fn(
      (_url: unknown, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const e = new Error("aborted")
            e.name = "AbortError"
            reject(e)
          })
        })
    ) as unknown as typeof fetch

    const client = new TeosAgentClient({ baseUrl: "http://x", apiKey: "k", timeoutMs: 10, fetchImpl })
    const err = await client.runAgent({ request_id: "req_4", message: "hi" }).catch((e) => e)
    expect((err as TeosAgentClientError).code).toBe("timeout")
    expect((err as TeosAgentClientError).status).toBe(408)
  })

  it("maps a transport failure to a 502 unreachable", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("fetch failed")
    }) as unknown as typeof fetch

    const client = new TeosAgentClient({ baseUrl: "http://x", apiKey: "k", fetchImpl })
    const err = await client.runAgent({ request_id: "req_5", message: "hi" }).catch((e) => e)
    expect((err as TeosAgentClientError).code).toBe("unreachable")
    expect((err as TeosAgentClientError).status).toBe(502)
  })

  it("refuses to construct in a browser context", () => {
    const g = globalThis as unknown as { window?: unknown }
    g.window = {}
    try {
      expect(() => new TeosAgentClient()).toThrow(/server-only/)
    } finally {
      delete g.window
    }
  })

  it("generates URL-safe request ids", () => {
    expect(newRequestId()).toMatch(/^req_[A-Za-z0-9]{8,64}$/)
  })
})
