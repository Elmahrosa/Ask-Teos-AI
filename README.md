# TEOS Answering Engine

Sovereign AI answering and research engine built for the Elmahrosa TEOS stack.

It combines live knowledge from the internet with local LLMs (Ollama) and optional cloud providers (Claude, OpenAI, Groq, Gemini), delivering accurate answers with cited sources while keeping every search and data flow under full institutional control.

## Core Capabilities
- Multi-provider support: local models + major cloud providers
- Smart search modes: Speed, Balanced, Quality
- Source selection: web, discussions, academic papers
- Domain-restricted search for technical documentation and governance papers
- File uploads (PDFs, text, images) with semantic querying for sovereign audit and internal knowledge
- Sovereign widgets: weather, calculations, stock prices, governance metrics
- Smart suggestions tuned for policy and STEM queries
- Discover mode focused on STEM + governance content
- Local search history stored under the TEOS audit index
- Designed for integration with TEOS compliance kit, AI Auditor, and AI Guard layers

## Design Principles
- Privacy and data sovereignty by default
- Full local control of search and model execution
- Auditability and human oversight as first-class requirements
- Aligned with ICBC governance expectations

## Deployment
Recommended: Docker deployment under the Elmahrosa organization, with authentication, policy enforcement, and audit logging layered on top.

## Current Status vs Roadmap

**Currently shipped (verified in code):**
- AI chat interface
- Pi Network authentication
- Founder dashboard
- CI/CD pipeline
- Multi-provider LLM routing (Ollama, Groq, Gemini with fallback)
- Search modes (fast/balanced/deep)
- Domain-restricted search (wired; internal TEOS knowledge base considered official; external filtering pending Tavily integration)
- Early-stage deep search (Tavily referenced — confirm actual wiring before claiming fully working)

**Roadmap (planned — not yet shipped):**
- File upload + basic Q&A over documents
- Local, auditable chat/search history under TEOS audit index
- Integration points with TEOS AI Guard and TEOS AI Auditor integration points
- Later: source-type filters, query suggestions
