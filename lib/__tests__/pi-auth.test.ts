import { createSign, generateKeyPairSync } from "node:crypto"
import { describe, expect, it } from "vitest"

import { PiAuthError, PiTokenVerifier } from "@/lib/pi-auth"

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 })
const other = generateKeyPairSync("rsa", { modulusLength: 2048 })

const pub = publicKey.export({ format: "jwk" }) as { n?: string; e?: string }
const jwk = { kid: "test-key-1", n: pub.n, e: pub.e }

function b64url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url")
}

function sign(
  payload: Record<string, unknown>,
  header: Record<string, unknown> = { alg: "RS256", kid: "test-key-1" },
  key = privateKey
): string {
  const h = b64url(JSON.stringify(header))
  const p = b64url(JSON.stringify(payload))
  const signer = createSign("RSA-SHA256")
  signer.update(`${h}.${p}`)
  signer.end()
  const sig = signer.sign(key).toString("base64url")
  return `${h}.${p}.${sig}`
}

function verifier(opts: {
  nowS?: number
  fetchImpl?: typeof fetch
  keys?: unknown[]
} = {}): PiTokenVerifier {
  const fetchImpl =
    opts.fetchImpl ??
    (async () =>
      new Response(JSON.stringify({ keys: opts.keys ?? [jwk] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }))
  return new PiTokenVerifier({
    jwksUrl: "https://keys.test/keys",
    fetchImpl,
    nowMs: () => (opts.nowS ?? Math.floor(Date.now() / 1000)) * 1000,
  })
}

describe("PiTokenVerifier", () => {
  const nowS = Math.floor(Date.now() / 1000)

  it("accepts a correctly signed, unexpired token", async () => {
    const token = sign({ uid: "uid-123", username: "tester", exp: nowS + 3600 })
    const principal = await verifier().verify(token)
    expect(principal).toEqual({ uid: "uid-123", username: "tester", verified: true, alg: "RS256" })
  })

  it("accepts sub as the subject when uid is absent", async () => {
    const token = sign({ sub: "sub-9", exp: nowS + 3600 })
    const principal = await verifier().verify(token)
    expect(principal.uid).toBe("sub-9")
  })

  it("rejects a token signed by a different key (invalid_signature)", async () => {
    const token = sign({ uid: "uid-123", exp: nowS + 3600 }, { alg: "RS256", kid: "test-key-1" }, other.privateKey)
    await expect(verifier().verify(token)).rejects.toMatchObject({ code: "invalid_signature" })
  })

  it("rejects an expired token", async () => {
    const token = sign({ uid: "uid-123", exp: nowS - 3600 })
    await expect(verifier().verify(token)).rejects.toMatchObject({ code: "expired" })
  })

  it("fails closed when exp is missing", async () => {
    const token = sign({ uid: "uid-123" })
    await expect(verifier().verify(token)).rejects.toMatchObject({ code: "expired" })
  })

  it("rejects any non-RS256 algorithm", async () => {
    const token = sign({ uid: "uid-123", exp: nowS + 3600 }, { alg: "HS256", kid: "test-key-1" })
    await expect(verifier().verify(token)).rejects.toMatchObject({ code: "unsupported_alg" })
  })

  it("rejects an unknown key id (key_not_found)", async () => {
    const token = sign({ uid: "uid-123", exp: nowS + 3600 }, { alg: "RS256", kid: "nope" })
    await expect(verifier().verify(token)).rejects.toMatchObject({ code: "key_not_found" })
  })

  it("rejects a malformed token", async () => {
    await expect(verifier().verify("only.two")).rejects.toMatchObject({ code: "malformed_token" })
  })

  it("fails closed when the key set is unreachable", async () => {
    const v = verifier({
      fetchImpl: (async () => {
        throw new TypeError("network down")
      }) as unknown as typeof fetch,
    })
    const token = sign({ uid: "uid-123", exp: nowS + 3600 })
    await expect(v.verify(token)).rejects.toMatchObject({ code: "jwks_unreachable" })
  })

  it("fails closed when the key set is empty or invalid", async () => {
    const token = sign({ uid: "uid-123", exp: nowS + 3600 })
    await expect(verifier({ keys: [] }).verify(token)).rejects.toMatchObject({ code: "jwks_invalid" })
  })

  it("surfaces PiAuthError as the thrown type", async () => {
    const token = sign({ uid: "uid-123", exp: nowS + 3600 }, { alg: "none" })
    await expect(verifier().verify(token)).rejects.toBeInstanceOf(PiAuthError)
  })
})
