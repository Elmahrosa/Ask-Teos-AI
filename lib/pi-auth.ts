// TEOS AI — server-side Pi access-token verification (RS256, fail-closed).
//
// The Pi backend SDK style "minified" flow issues an access token that apps
// must verify server-side with Pi's public signing keys before trusting it.
// This module:
//   - fetches the JWKS (default https://api.minepi.com/v2/auth/keys),
//   - caches it briefly (TTL, in memory),
//   - accepts RS256 signatures ONLY,
//   - rejects expired tokens (with configurable skew),
//   - FAILS CLOSED: if the key set cannot be fetched or parsed, verification
//     raises PiAuthError with code `jwks_unreachable` / `jwks_invalid` so the
//     caller refuses to serve rather than trusting an unverifiable token.

import { createPublicKey, createVerify } from "node:crypto"

export interface PiPrincipal {
  /** Subject identifier (Pi `uid`). */
  uid: string
  username: string | null
  verified: boolean
  alg: string
}

export type PiAuthErrorCode =
  | "malformed_token"
  | "unsupported_alg"
  | "expired"
  | "invalid_signature"
  | "key_not_found"
  | "jwks_unreachable"
  | "jwks_invalid"

export class PiAuthError extends Error {
  readonly code: PiAuthErrorCode

  constructor(code: PiAuthErrorCode, message: string) {
    super(message)
    this.name = "PiAuthError"
    this.code = code
  }
}

const DEFAULT_JWKS_URL = "https://api.minepi.com/v2/auth/keys"

export interface PiVerifierOptions {
  jwksUrl?: string
  /** Test hook: inject a fetch implementation. */
  fetchImpl?: typeof fetch
  /** Allowed clock skew in seconds (default 30). */
  clockSkewS?: number
  /** JWKS cache TTL in ms (default 6h). */
  cacheTtlMs?: number
  /** Test hook: current time in ms since epoch. */
  nowMs?: () => number
}

interface JwkKey {
  kty: string
  use?: string
  kid?: string
  alg?: string
  n?: string
  e?: string
}

interface CacheEntry {
  keys: JwkKey[]
  at: number
}

const decoder = new TextDecoder()

function b64urlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
  return decoder.decode(Buffer.from(padded, "base64"))
}

function parseSegment<T>(raw: string, label: string): T {
  try {
    return JSON.parse(b64urlDecode(raw)) as T
  } catch {
    throw new PiAuthError("malformed_token", `token ${label} is not valid JSON`)
  }
}

export class PiTokenVerifier {
  private readonly jwksUrl: string
  private readonly fetchImpl: typeof fetch
  private readonly clockSkewMs: number
  private readonly cacheTtlMs: number
  private readonly nowMs: () => number
  private cache: CacheEntry | null = null
  private inflight: Promise<JwkKey[]> | null = null

  constructor(opts: PiVerifierOptions = {}) {
    this.jwksUrl = (opts.jwksUrl ?? process.env.TEOS_AGENT_PI_JWKS_URL ?? DEFAULT_JWKS_URL).replace(/\/+$/, "")
    this.fetchImpl = opts.fetchImpl ?? fetch.bind(globalThis)
    this.clockSkewMs = (opts.clockSkewS ?? 30) * 1000
    this.cacheTtlMs = opts.cacheTtlMs ?? 6 * 60 * 60 * 1000
    this.nowMs = opts.nowMs ?? (() => Date.now())
  }

  /** Throws PiAuthError on ANY verification failure. Never returns a partial principal. */
  async verify(token: string): Promise<PiPrincipal> {
    if (typeof token !== "string" || token.length === 0 || token.length > 8192) {
      throw new PiAuthError("malformed_token", "token is empty or oversized")
    }
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new PiAuthError("malformed_token", "token is not an unsigned JWS")
    }
    const [h, p, sig] = parts

    const header = parseSegment<{ alg?: string; kid?: string }>(h, "header")
    if (!header.alg || header.alg !== "RS256") {
      // Strict allow-list: weak/HMAC/none algorithms are never accepted.
      throw new PiAuthError("unsupported_alg", `unsupported algorithm ${header.alg ?? "none"}`)
    }

    const payload = parseSegment<{ sub?: string; uid?: string; username?: string | null; exp?: number }>(p, "payload")
    const uid = payload.uid ?? payload.sub ?? null
    if (!uid) {
      throw new PiAuthError("malformed_token", "token payload has no subject (uid)")
    }

    // Expiry with allowed skew. A missing `exp` is treated as unverifiable at
    // this stage: Pi tokens always carry one, and we fail closed instead of
    // accepting open-ended tokens.
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
      throw new PiAuthError("expired", "token has no numeric exp (fail closed)")
    }
    const nowSec = Math.floor(this.nowMs() / 1000)
    if (payload.exp <= nowSec - Math.floor(this.clockSkewMs / 1000)) {
      throw new PiAuthError("expired", "token is expired")
    }

    const keys = await this.#jwks()
    const key = keys.find((k) => k.kid === header.kid)
    if (!key || !key.n || !key.e) {
      throw new PiAuthError("key_not_found", `no signing key for kid=${header.kid ?? "unknown"}`)
    }

    const publicKey = this.#jwkToPem(key)
    const signingInput = `${h}.${p}`
    const signature = Buffer.from(sig.replace(/-/g, "+").replace(/_/g, "/"), "base64")

    const verifier = createVerify("RSA-SHA256")
    verifier.update(signingInput)
    verifier.end()
    const ok = verifier.verify(publicKey, signature)
    if (!ok) {
      throw new PiAuthError("invalid_signature", "signature verification failed")
    }

    return { uid, username: payload.username ?? null, verified: true, alg: "RS256" }
  }

  #jwkToPem(key: JwkKey): string {
    try {
      // Minimal RFC 7517 public JWK; alg/use/key_ops are omitted because some
      // Node versions reject them in `KeyObject.from`/`createPublicKey`.
      const keyObject = createPublicKey({ key: { kty: "RSA", n: key.n, e: key.e }, format: "jwk" })
      return keyObject.export({ type: "spki", format: "pem" }) as string
    } catch {
      throw new PiAuthError("jwks_invalid", "JWK could not be converted to a public key")
    }
  }

  async #jwks(): Promise<JwkKey[]> {
    const cached = this.cache
    if (cached && this.nowMs() - cached.at < this.cacheTtlMs) return cached.keys

    // Coalesce concurrent fetches into one (avoid key-stampede + thundering herd).
    if (!this.inflight) {
      this.inflight = (async () => {
        let res: Response
        try {
          res = await this.fetchImpl(this.jwksUrl, {
            headers: { Accept: "application/json" },
            cache: "no-store",
          })
        } catch (err) {
          throw new PiAuthError(
            "jwks_unreachable",
            `public keys unreachable: ${(err as Error).message}`
          )
        }
        if (!res.ok) {
          throw new PiAuthError("jwks_unreachable", `public keys endpoint returned HTTP ${res.status}`)
        }
        let body: { keys?: unknown } | null = null
        try {
          body = (await res.json()) as { keys?: unknown }
        } catch {
          throw new PiAuthError("jwks_invalid", "public keys endpoint returned non-JSON")
        }
        if (!body || !Array.isArray(body.keys) || body.keys.length === 0) {
          throw new PiAuthError("jwks_invalid", "public keys endpoint returned no usable keys")
        }
        const keys = body.keys as JwkKey[]
        this.cache = { keys, at: this.nowMs() }
        return keys
      })().finally(() => {
        this.inflight = null
      })
    }
    return this.inflight
  }
}

/** Default verifier used by the API route (reads env at construction). */
export const piTokenVerifier = new PiTokenVerifier()

/** Convenience wrapper matching the route's use. */
export async function verifyPiToken(token: string): Promise<PiPrincipal> {
  return piTokenVerifier.verify(token)
}