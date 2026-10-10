import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  AuditWriter,
  newCorrelationId,
  newEventId,
  sha256Digest,
  toAuditDecision,
  type AgentAuditEvent,
} from "@/lib/audit"

function sampleEvent(overrides: Partial<AgentAuditEvent> = {}): AgentAuditEvent {
  return {
    event_id: newEventId(),
    correlation_id: newCorrelationId(),
    request_id: "req_test",
    ts: new Date().toISOString(),
    service: "ask-teos-ai",
    user: { kind: "pi", user_id: "uid-1", is_founder: false },
    authz: "allowed",
    persona: "know",
    model: "local",
    tool_decisions: [],
    outcome: "success",
    duration_ms: 12,
    query_digest: sha256Digest("secret question"),
    query_len: "secret question".length,
    error: null,
    ...overrides,
  }
}

describe("audit", () => {
  it("writes one JSONL record and never stores the raw text", async () => {
    const dir = mkdtempSync(join(tmpdir(), "teos-audit-"))
    const writer = new AuditWriter({ dir })
    await writer.append(sampleEvent())

    const line = readFileSync(join(dir, "agent-audit.jsonl"), "utf8").trim()
    const parsed = JSON.parse(line) as AgentAuditEvent
    expect(parsed.query_digest).toMatch(/^sha256:[0-9a-f]{64}$/)
    expect(parsed.query_len).toBe("secret question".length)
    expect(line).not.toContain("secret question")
  })

  it("sanitizes sentinel fragments to an allow-list (drops extra keys)", () => {
    const decision = toAuditDecision({
      tool: "kb.search",
      status: "executed",
      reason: null,
      duration_ms: 3,
      sentinel: { verdict: true, rule: "r1", score: 0.9, secret_token: "leak-me" },
    })
    expect(decision.allowed).toBe(true)
    expect(decision.sentinel).toEqual({ verdict: true, rule: "r1", score: 0.9 })
    expect(JSON.stringify(decision)).not.toContain("leak-me")
  })

  it("marks denied tool events as not allowed", () => {
    const decision = toAuditDecision({ tool: "shell", status: "denied", reason: "policy" })
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toBe("policy")
  })

  it("produces prefixed identifiers and stable digests", () => {
    expect(newCorrelationId()).toMatch(/^corr_[a-f0-9]{32}$/)
    expect(newEventId()).toMatch(/^evt_[a-f0-9]{32}$/)
    expect(sha256Digest("a")).toBe(sha256Digest("a"))
    expect(sha256Digest("a")).not.toBe(sha256Digest("b"))
  })

  it("fails closed by default when the store is unwritable", async () => {
    const writer = new AuditWriter({ dir: "\u0000invalid\u0000path" })
    await expect(writer.append(sampleEvent())).rejects.toMatchObject({ name: "AuditWriteError" })
  })
})
