# Deployment Guide

## Live target: Vercel Hobby (free)

`Ask-Teos-AI` runs as a **Next.js** frontend on **Vercel Hobby** (free tier).
No paid hosting is used. Legacy hosts (Railway, Hostinger) are
**lapsed and out of scope** — URLs on those services are dead and must not be
used.

### Vercel dashboard settings (copy-paste)

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** (auto-detected) |
| Root Directory | `/` (repo root; `package.json` + `next.config.mjs` at root — not a monorepo) |
| Build Command | default (`next build`) |
| Install Command | default (`npm install`; `package-lock.json` present) |
| Node.js Version | **22.x** (Next 16 requires ≥ 20.9; 22.x matches the CI matrix) |
| Output Directory | default |

Verified locally on this branch: `npm ci && npm run build` succeeds with **no
environment variables** and with the `.env.example` values — **no env var is
required at build time**; every variable below is runtime-only.

### Environment variables to add in Vercel (names only — values go in Vercel, never in git)

| Variable | Required | Notes |
|---|---|---|
| `OLLAMA_BASE_URL`, `OLLAMA_MODEL` | no | local LLM provider |
| `GROQ_API_KEY`, `GROQ_MODEL` | no | cloud LLM provider — **server-only** (used by `POST /api/teos/chat`); `GROQ_API_KEY` was set for Production/Preview/Development on 2026-10-11 |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | no | cloud LLM provider (server-only) |
| `TAVILY_API_KEY` | no | deep search |
| `GITHUB_TOKEN` | no | raises GitHub API rate limit |
| `POSTHOG_KEY`, `POSTHOG_HOST`, `NEXT_PUBLIC_POSTHOG_KEY` | no | analytics |
| `TEOS_RPC`, `NEXT_PUBLIC_TEOS_RPC` | no | Solana RPC endpoint |
| `NEXT_PUBLIC_BACKEND_URL` | no | live backend base URL — set once a backend is restored (placeholder `https://backend.invalid` otherwise) |
| `TEOS_AGENT_URL`, `TEOS_AGENT_API_KEY` | agent only | private agent-service endpoint + service key (server-side) |
| `TEOS_AGENT_TIMEOUT_MS`, `TEOS_AGENT_RATE_LIMIT_PER_MIN`, `TEOS_AGENT_AUDIT_DIR` | no | per-run deadline / per-IP limit / digest-only audit store |

### Automatic deployment via GitHub

1. Go to [vercel.com/new](https://vercel.com/new), import `github.com/Elmahrosa/Ask-Teos-AI`.
2. Apply the settings above; add the env var **names** you need (Vercel stores the values).
3. Deploy. Vercel deploys automatically on every push to `main`, plus per-PR previews.

### Manual deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## TEOS AI Agent (private service)

The TEOS AI agent capability is served by a **private** agent service that must
never be reachable from the public internet. The public app talks to it through
the protected route `POST /api/teos/agent` using a service-to-service key kept
server-side only.

Required app-side environment (see `teos-ai-agent-integration/deployment.md`):

| Variable | Required | Description |
|---|---|---|
| `TEOS_AGENT_URL` | yes | Private URL of the agent service (e.g. `http://teos-agent:8000`) |
| `TEOS_AGENT_API_KEY` | yes | Service-to-service secret (server only; never exposed to the browser) |
| `TEOS_AGENT_TIMEOUT_MS` | no | Client deadline, default `150000` |
| `TEOS_AGENT_RATE_LIMIT_PER_MIN` | no | Per-IP limit, default `12` |
| `TEOS_AGENT_AUDIT_DIR` | no | App-side audit (JSONL, digest-only), default `./data/audit` |

The route is **POST-only**, rate-limits per source IP, and writes a digest-only
audit record; audit-write failure fails closed. Caller authentication was
removed with the (deleted) third-party auth dependency.

## Public chat route (server-side LLM bridge)

`POST /api/teos/chat` is the **only** surface that executes `llmService`
server-side. The chat widget used to import `llmService` directly from the
browser, where non-`NEXT_PUBLIC_*` env vars (and therefore any LLM key) can
never be present — so the live chat always fell back to the offline knowledge
base. The widget now posts its conversation here.

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | no | Groq API key (server-only) — set 2026-10-11 for Production/Preview/Development |
| `GROQ_MODEL` | no | Groq model, default `openai/gpt-oss-120b` (succeeds `llama3-8b-8192`, no longer served by Groq) |
| `TEOS_CHAT_RATE_LIMIT_PER_MIN` | no | Per-IP chat rate limit, default `12` (in-memory fixed window) |

The route is zod-strict (no unknown fields), rate-limits per source IP, and
returns a stable `{error:{code,message}}` envelope. Provider/model internals
are never leaked to the client. The offline knowledge-base fallback still
applies server-side when no cloud provider is configured.

## Backend

The legacy frontend backend referenced by `lib/system-config.ts`
(`BACKEND_CONFIG.BASE_URL`) was hosted on a legacy App Engine host and is
**dead** (the
subscription lapsed). Restore a live backend before relying on features that use
it, and replace the URL in `lib/system-config.ts` (currently a locked /
auto-generated file) with the new backend URL. Replacing the backend host is
**out of scope** for the Vercel-live task.

## CI/CD Pipeline

GitHub Actions automatically runs on:
- Push to main/develop
- Pull requests

Pipeline includes:
- Dependency installation
- Linting
- Build verification
- Test execution (`vitest run`)

## Monitoring Setup

### UptimeRobot

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor:
   - Type: HTTP(s)
   - URL: Your production URL
   - Interval: 5 minutes

### PostHog Analytics

1. Sign up at [posthog.com](https://posthog.com)
2. Get API key from Project Settings
3. Add `POSTHOG_KEY` to environment variables

## Post-Deployment Checklist

- [ ] Verify founder dashboard access
- [ ] Check GitHub metrics API
- [ ] Test chat functionality
- [ ] Verify environment variables
- [ ] Set up monitoring alerts
- [ ] Enable analytics tracking

## Troubleshooting

### Build Fails
- Check Node.js version (22.x recommended; Next 16 requires ≥ 20.9)
- Verify all dependencies in package.json
- No environment variables are required at build time — build failures are **not**
  caused by missing Vercel env vars

### API Errors
- Backend URL in `lib/system-config.ts` is currently a **dead** backend URL —
  confirm a live backend is configured
- Verify API keys are set correctly

### GitHub Metrics Not Loading
- Add `GITHUB_TOKEN` for higher rate limits
- Check repository name and owner in API route