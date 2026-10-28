# Lab · Ask Jorge

Experimental AI assistant for the jorgeag.com portfolio.

## Status

**Concept / Mockup v2.** Frontend only — no backend wired. All responses are
pre-written and simulated with streaming animation. Nothing hits a real LLM API.

Purpose: to concept, iterate UX, and get external audit before building the
production version.

## What this is

A chat UI grounded on Jorge's public portfolio content (CV, case studies,
7-layer framework, 1:1 structure, ventures). It will not invent facts. For
fees, availability, or scoping conversations, it routes explicitly to
`hello@jorgeag.com` — those decisions belong in a 1:1, not a bot.

## What this is **not**

- A general-purpose chatbot
- A substitute for direct conversation with Jorge
- A system that commits to scope, timeline, or fees
- A permanent portfolio feature (yet) — this is a `/lab/` experiment

## Features in v2 (concept)

- Streaming responses (char-by-char reveal)
- Progressive thinking states ("Reading Wolt case study…")
- Multilingual EN / DE / ES (toggle top-right)
- localStorage conversation persistence + restore prompt
- Source cards with hover previews
- Copy / Regenerate response actions
- Markdown export of conversation
- Reset conversation (confirmed)
- Collapsible disclaimer (progressive disclosure)
- Mobile drawer for topics panel
- Keyboard shortcuts: `Cmd+K` focus, `Enter` send, `Shift+Enter` newline
- Error state + retry button
- Follow-up suggestions after each response
- Explicit escalation cards for fee / availability intents
- Full accessibility baseline (aria-live, aria-labels, reduced-motion)

## Design

- Dark theme (coherent with portfolio canonical)
- Palette: `#10B981` emerald primary, `#E8DFC7` cream secondary
- Typography: Inter + JetBrains Mono (same as portfolio)
- Nav canonical replica for continuity cross-page

## Production architecture (not implemented here)

```
Browser → Cloudflare Worker → Anthropic API (Haiku)
                 │
                 ├── Knowledge base (markdown files in /lab/knowledge/)
                 │   - cv.md, case-wolt.md, case-bolt.md, case-nexio.md
                 │   - framework.md, management.md, about.md, faq.md
                 │
                 └── (v2) Escalation hook → Salas AI (Tanja via WhatsApp)
                     for "contact me" intent
```

## Guardrails (production)

- RAG strict: only respond from retrieved sources
- System prompt: never commit to fees, scope, or availability
- max_tokens: ~500 per response, chunked follow-up if needed
- Rate limit via Cloudflare Turnstile
- No conversation data sent to Anthropic beyond the current turn
- Local-only conversation history

## Cost estimate

- Cloudflare Workers: $0 (free tier)
- Anthropic API (Haiku): ~$5–15/month at 50 convs/month × 5 msgs
- Turnstile: $0
- **Total: ~$5–15/month**

## Next steps

1. External audit (this document)
2. Build Worker + Anthropic integration
3. Write knowledge base markdowns from existing portfolio content
4. Prompt engineering + guardrail hardening
5. Soft launch with 5–10 active recruiters (private link)
6. Iterate on real hallucinations found
7. Promote to main nav after 3 months if < 5% serious hallucinations

## Repository layout

```
lab/
├── ask-jorge/
│   ├── index.html          ← this concept
│   ├── README.md           ← this file
│   └── knowledge/          ← (future) markdown knowledge base
│       ├── cv.md
│       ├── case-*.md
│       ├── framework.md
│       └── faq.md
```
