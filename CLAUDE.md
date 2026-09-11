# CLAUDE.md — Pflichtwächter

Micro-SaaS: automated legal-hygiene monitoring for German websites. German UI,
English code/comments/commits.

## Commands

- `pnpm install` — install workspace (Node ≥ 22, pnpm 10)
- `pnpm dev` — Next.js dev server (apps/web)
- `pnpm test` — all test suites (rule engine lives in packages/rules)
- `pnpm lint` — ESLint (flat config, repo-wide)
- `pnpm typecheck` — tsc across all packages (generates Prisma client first)
- `pnpm worker` — run the worker process (needs DATABASE_URL)
- `pnpm rules:eval <file.html | fixture-dir>` — run the rule engine on a fixture
- `pnpm db:generate` / `pnpm db:deploy` — Prisma client / migrations
- `docker compose -f infra/docker-compose.yml up --build` — full stack

## Architecture (10 lines)

1. `apps/web` — Next.js App Router: landing (German), legal pages from `legal/*.md`, health routes.
2. `apps/worker` — separate process: heartbeat now; crawler, queue (pg-boss), emails, retention later.
3. `packages/rules` — PURE rule engine: HTML → `PageEvidence` → `SiteEvidence` → findings + score. No network, no DB.
4. `packages/db` — Prisma schema + client; web and worker import `@pflichtwaechter/db`.
5. Crawler (Phase 2) produces `SiteEvidence`; the engine never fetches anything itself.
6. Drift rules (G1–G3) diff two `DriftSnapshot`s — the worker uses them for weekly regression emails.
7. Money: Stripe Checkout + webhooks → entitlement rows in Postgres (Phase 4).
8. Everything runs from one docker-compose stack: postgres, web, worker, caddy — one EU VPS.
9. Scoring: 100 − 15·blocker − 6·warn − 1·info, clamped; traffic light from severities.
10. LLM is optional (`LLM_PROVIDER=none` default); it may only summarize collected evidence, never assert new facts.

## Invariants — do not break

- **No legal-advice language.** Never output "abmahnfest", "100 % rechtssicher" or any
  guarantee. Uncertain checks are `warn` + "anwaltlich prüfen", never an indefensible blocker.
- **SSRF:** crawler fetches only http/https; block localhost, RFC1918, 169.254/16, ::1,
  metadata IPs, .onion; re-check resolved IPs before fetch (Phase 2 — do not ship a fetcher without this).
- **Rule engine runs with `LLM_PROVIDER=none`.** The LLM only ever sees extracted evidence + fired rule.
- **DSGVO by design:** raw HTML deleted after `RETENTION_HTML_DAYS` (30); evidence excerpts ≤ 500 chars;
  hard-delete account data via job within 72 h of request.
- **EU hosting assumption.** No AWS-only / US-only service dependencies.
- **German UI/emails (Sie-Form), English code and commits.** Formal, calm tone; no startup slang.
- **No secrets in git.** Env only; `.env.example` is the contract.
- User-Agent for all crawling: `PflichtwaechterBot/1.0 (+https://<DOMAIN>/bot)`.

## Conventions

- TS strict everywhere; `noUncheckedIndexedAccess` on.
- Rule copy lives ONLY in `packages/rules/src/catalog.ts`; UI renders from it.
- New dependency ⇒ justify in the commit body.
- Tests accompany every rule id; fixtures in `packages/rules/fixtures/`.
