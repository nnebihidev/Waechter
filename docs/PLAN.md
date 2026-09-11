# Pflichtwächter — Build Plan

Status: Phase 0 + Phase 1 implemented in this iteration. Phases 2–7 planned below.

## Product summary

Self-serve micro-SaaS: crawls a German website on a schedule, runs a deterministic
legal-hygiene rule catalog (DDG, DSGVO, TDDDG, PAngV, Widerruf, BFSG smoke checks),
and reports findings in plain German. Free scan → €9 PDF → €12/month monitoring →
€49/month agency plan. Runs unattended on a single EU VPS via Docker Compose.

Hard line (UI + PDF): technical monitoring tool, no legal advice, no guarantee of
"Abmahnfreiheit".

## Repo layout

```
apps/web          Next.js (App Router, TS strict, Tailwind) — landing, legal pages, health routes
apps/worker       Long-running process: heartbeat now; crawler/queue/email/retention in later phases
packages/rules    Pure TypeScript rule engine + HTML evidence extraction + fixtures + tests + CLI
packages/db       Prisma schema, generated client, migrations
infra             docker-compose.yml, Caddyfile, Dockerfiles
legal             German markdown sources for /impressum, /datenschutz, /agb, /widerruf, /avv, /bot
docs              PLAN.md (this file), later LAUNCH.md
```

## Phases

### Phase 0 — Repo spine (DONE)
- pnpm monorepo, TS strict everywhere, ESLint flat config
- CLAUDE.md, README (with founder launch checklist), LEGAL.md, .env.example
- Prisma schema covering users, magic-link tokens, sites, scans, pages, findings,
  purchases, subscriptions, consent log, webhook events, worker heartbeat
- Health routes `/healthz` (liveness) and `/readyz` (DB ping)
- Legal placeholder pages rendered from `legal/*.md` with `{{PLACEHOLDER}}` tokens
- German landing page with static sample-report component; scan form UI present,
  clearly labeled that the live pipeline follows (Phase 2 wires it)
- docker-compose stack: postgres, web, worker, caddy
- Minimal worker: DB heartbeat every 5 minutes (real code, used by /readyz ops checks later)

### Phase 1 — Rule engine (DONE)
- `packages/rules`: pure functions, no network, no DB
- Evidence extraction from HTML via cheerio (`extractPageEvidence`)
- Full MVP catalog implemented: A1–A3, B1–B7, C1–C6, D1–D4, E1–E3, F1–F3, plus
  drift rules G1–G3 as pure snapshot-diff functions
- German copy (title/why/fix/legal basis) for every rule in `catalog.ts`
- Scoring: 100 − 15·blocker − 6·warn − 1·info, clamped 0–100; traffic light from severities
- Fixtures: good site, shop with problems, broken site
- Unit tests for every rule id + extractor + scoring (vitest)
- CLI: `pnpm rules:eval path/to/fixture.html` (single file = homepage-only,
  directory = homepage.html + impressum.html + datenschutz.html + agb.html + widerruf.html)

### Phase 2 — Crawler
- `apps/worker`: fetch pipeline (undici), robots.txt honoring for `PflichtwaechterBot`,
  redirect + TLS capture, legal-page discovery (link classifier already in packages/rules),
  page caps (15 pages, 2 MB, 12 s), Playwright homepage pass for runtime cookie evidence
- SSRF guard: scheme allowlist, private/link-local/metadata IP blocklist, DNS re-resolution check
- Persist Scan/ScanPage/Finding via packages/db; content-hash 24 h scan cache
- Public result page `/r/[id]` in apps/web
- pg-boss queue, concurrency 2

### Phase 3 — Funnel
- Wire landing form → scan API; rate limit 5 free scans / IP / day
- Email capture on free result; magic-link auth (tokens already in schema)
- Free result shows score + top 3 findings; rest gated

### Phase 4 — Money
- Stripe Checkout (€9 report, €12 Wächter), webhooks → entitlements, customer portal
- PDF generation (packages/pdf), Widerruf checkbox + consent logging (schema ready)
- VAT_MODE handling (kleinunternehmer default)

### Phase 5 — Worker autonomy
- `scan.scheduled` hourly tick, weekly recrawls, diff emails (G rules), monthly summary
- `data.retention` daily 03:20 Europe/Berlin (raw HTML > 30 days, orphaned tokens)
- `billing.reconcile` hourly; heartbeat alerting to FOUNDER_EMAIL
- Ratgeber SEO stubs if time remains

### Phase 6 — Agency
- Team entity + seats + invite links, multi-domain dashboard, client-safe PDF, CSV export

### Phase 7 — Harden
- Abuse/rate limits, CSP, seed script with public German pages, load sanity, /bot page polish

## Key decisions & library notes

- **pnpm 10**: dependency build scripts are opt-in; `onlyBuiltDependencies` in the root
  package.json allowlists prisma engines, tailwind oxide, sharp, esbuild.
- **Tailwind v4** (CSS-first config via `@theme`) instead of v3 `tailwind.config.js` —
  current official API.
- **shadcn/ui** components come in with Phase 3 (forms/dashboard); the Phase 0 landing
  uses plain Tailwind to keep the spine light. Design tokens already match the brief
  (paper background, ink text, deep pine green accent).
- **Prisma 6**, client generated into packages/db; web/worker consume it through
  `@pflichtwaechter/db` (Next `transpilePackages`).
- **Rule engine consumes evidence, never the network.** The crawler produces
  `SiteEvidence`; the CLI builds it from fixture files. LLM (later, optional) only ever
  sees extracted evidence + the fired rule; `LLM_PROVIDER=none` is the default and the
  engine's German template copy is the summary.
- Drift rules (G1–G3) are pure functions over `DriftSnapshot`s so the worker can diff
  two scans without re-parsing HTML.
- Severity policy per brief §11.7: violations we can detect with high confidence are
  blockers (missing Impressum/Datenschutz page, tracking scripts with no consent UI,
  shop without Widerruf); heuristic content checks are warns with "anwaltlich prüfen"
  wording; never a blocker we cannot defend.

## Risks

1. **Docker builds are untested in this environment** (no daemon run here). Dockerfiles
   follow standard pnpm-monorepo + Next standalone patterns; first `docker compose up`
   on a real VPS may need small path fixes.
2. **Consent detection is best-effort.** Static markup + (Phase 2) runtime cookie pass;
   copy never claims full compliance either way.
3. **Heuristic false positives** on B2 (name), B3 (address), E (shop detection).
   Mitigated by warn-severity and evidence excerpts the user can verify.
4. **Playwright in Docker** needs the official base image or system deps; planned for
   the worker image in Phase 2, kept out of the web image.
5. **Legal texts are drafts.** Structurally complete, conservative, marked
   "Entwurf — vor Launch von einem IT-Recht-Anwalt prüfen lassen." LEGAL.md lists every
   placeholder.

## File inventory (Phase 0+1)

See repo tree; single sources of truth:
- Rule copy/catalog: `packages/rules/src/catalog.ts` (landing "Was wird geprüft" renders from it)
- Env contract: `.env.example`
- Placeholders: `LEGAL.md`
- Schema: `packages/db/prisma/schema.prisma`
