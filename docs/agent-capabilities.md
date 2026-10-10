# TEOS AI — Agent Capabilities

TEOS AI includes an internal agent capability that answers questions about the
TEOS ecosystem with a fully audited **tool-policy trail**. This document
describes what users can expect. (Implementation details of the private service
are intentionally not published here.)

## What the agent can do (milestone 1)

- Answer knowledge questions about TEOS: governance, the civic blockchain
  constitution, tokens, programs, and published documents.
- Cite official TEOS sources when the knowledge tool is used.
- Run entirely on TEOS-controlled infrastructure (a local model by default);
  no third-party model is required.

## Safety guarantees (by design)

- **Deny by default.** No tool is enabled unless explicitly approved. Shell,
  arbitrary code, file writes, memory writes, and unrestricted web access are
  always denied in code — not merely hidden from the model.
- **Deterministic security gate.** Every tool invocation is checked by the
  Sentinel security gate *between selection and execution*. The model never
  decides its own security outcome; deny/allow decisions are recorded.
- **Fail closed.** If the security gate or the audit store is unavailable, the
  request is refused rather than served unverified.
- **Identified access.** Requests are authenticated server-side; anonymous
  access is not the default.
- **Audited, digest-only.** Every run produces an audit record containing a
  SHA-256 digest of the question (not the raw text), tool decisions, and the
  outcome. Audit records are server-side only and never sent to the browser.
- **No secrets in answers.** The service key and internal endpoints never reach
  the client.

## What it does not do (milestone 1)

- No shell/command execution, no arbitrary code, no file writes.
- No autonomous actions on external systems.
- No user data stored in the public app.

## Availability

The agent capability is reached through the app's protected route
(`POST /api/teos/agent`). It can be independently disabled without affecting the
rest of TEOS AI.
