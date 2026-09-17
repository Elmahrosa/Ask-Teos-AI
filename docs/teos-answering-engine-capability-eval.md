# Spec: TEOS Answering Engine — Capability Evaluation for Ask-Teos-AI

**Repo:** github.com/Elmahrosa/Ask-Teos-AI
**Purpose of this doc:** Decide what to build next, honestly, based on what's
actually in the repo today — not aspirational claims.

---

## 1. Ground rules

1. Verify every "current status" claim against the actual code in the repo
   before writing it down. Don't infer from cached descriptions or org-level
   summaries — pull the real file tree and README.
2. Nothing goes into README/changelog prose as a shipped feature until it's
   actually merged and working.
3. Heavy infrastructure additions (a self-hosted search backend, an
   embeddings/vector store, a new persistence layer) are separate decisions
   from feature PRs — call them out explicitly, don't bundle them in.
4. If third-party open-source code is ever copied into this repo rather than
   reimplemented, that code's original license notice must be preserved in
   those files, and the reuse noted in this repo's NOTICE/credits. This
   applies regardless of source — treat it as a standing rule, not a
   one-time check.

## 2. Capability checklist

| Capability | Current status in Ask-Teos-AI | Worth building? | Smallest useful version | Priority |
|---|---|---|---|---|
| Multi-provider LLM routing (local + cloud) | **Shipped** - Ollama, Groq, Gemini providers with automatic fallback | Yes — core to sovereignty goals | Config-driven switch between 1–2 providers with a local fallback | High |
| Local/offline model support | **Shipped** - Ollama provider + existing offline AI as final fallback | Yes — aligns with TEOS sovereignty stance | Optional local endpoint + fallback to cloud provider | High |
| Search modes (fast / balanced / deep) | **Shipped** - Fast/Balanced/Deep modes with UI selector | Yes — useful for governance/policy queries | One parameter that changes retrieval depth + prompt | High |
| Source scoping (web / discussions / academic) | Not present | Medium | Simple toggle filtering result types | Later |
| Private/self-hosted web search | Not present (Tavily referenced instead) | Only if full search privacy becomes a hard requirement | Keep Tavily (or similar managed API) for near-term work; treat self-hosted search as a separate infra project | Deferred |
| Contextual widgets (weather, calc, metrics) | Not present | Low priority for this repo's purpose | Skip, or add only governance-relevant metrics later | Low |
| File upload + Q&A | Not present | Yes — strong fit for audit/documentation use cases | Basic upload + simple retrieval/Q&A over uploaded files | Medium |
| Domain-restricted search | Shipped (wired; internal TEOS knowledge base treated as official; external URL filtering not active without web search) | Yes — useful for scoping to TEOS docs/governance papers | Query filter, if search backend supports it | High |
| Search-query suggestions | Not present | Nice-to-have | Simple prefix or LLM-based suggestion | Later |
| Trending/"discover" content feed | Not present | Low relevance to this repo's purpose | Skip | Low |
| Local, auditable search/chat history | Not confirmed | Yes — needed for an audit trail | Store chat history under a TEOS audit index | High |
| Authentication | **Present** (Pi Network + founder auth) | Already ahead of baseline | Keep and harden; integrate with TEOS AI Guard / Auditor | Keep |

## 3. Current vs. Roadmap

**Shipped (confirm before stating publicly):**
- AI chat interface
- Pi Network authentication
- Founder dashboard
- CI/CD pipeline
- Multi-provider LLM routing (Ollama, Groq, Gemini with fallback)
- Early-stage deep search (Tavily referenced, not confirmed fully wired)

**Roadmap (label clearly as planned, not shipped):**
- Search modes (fast/balanced/deep)
- Domain-restricted search
- File upload + Q&A
- Local, audited search history
- Integration points with TEOS AI Guard and TEOS AI Auditor
- Later: source-type filters, query suggestions

## 4. Infrastructure flags

- **Self-hosted search backend**: high cost — do not fold into a feature PR;
  it's a standalone infra decision. Prefer the existing Tavily integration
  (or another managed search API) for near-term work.
- **Local model runtime**: medium cost — needs a reachable local inference
  endpoint, but no new heavy service if one is already available.
- **File storage + embeddings**: medium cost — needs a persistence layer and
  an embedding model; keep the first version minimal.

## 5. Third-party code reuse

No third-party source files have been copied into this repo as of this
evaluation. If that changes:
- Preserve the original license notice in the copied files
- Add an entry to this repo's NOTICE or README credits section
- Do not claim affiliation or endorsement from any external project

## 6. Recommended build order

1. Multi-provider LLM routing (with a local/offline fallback option) - **COMPLETED**
2. Search modes as a single retrieval-depth parameter - **COMPLETED**
3. Domain-restricted search
4. File upload + basic Q&A
5. Auditable local chat/search history

Deferred: contextual widgets, discover feed, self-hosted search backend.
