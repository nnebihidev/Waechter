# Pflichtwächter

*Deine Website, abmahnfester im Blick.*

Pflichtwächter crawls a German website on a schedule, checks the pages and patterns
that actually trigger Abmahnungen (Impressum, Datenschutzerklärung, Cookie-Consent,
Preisangaben, Widerruf, BFSG smoke checks), and emails a plain-language German report —
free once, paid forever as monitoring.

> Pflichtwächter ist ein technisches Prüf- und Monitoring-Werkzeug. Es ersetzt keine
> anwaltliche Beratung. Keine Garantie für Abmahnfreiheit.

## Stack

Next.js (App Router) · TypeScript strict · Tailwind · Postgres + Prisma · separate
worker process · Stripe · transactional email (Resend or SMTP) · Docker Compose on an
EU VPS (Hetzner Nuremberg/Falkenstein class). No US-only services.

## Quickstart (development)

```bash
corepack enable                       # Node >= 22
pnpm install
cp .env.example .env                  # fill DATABASE_URL at minimum
pnpm db:generate
pnpm dev                              # web on http://localhost:3000
pnpm worker                           # separate terminal, needs Postgres
pnpm test                             # rule engine + suites
pnpm rules:eval packages/rules/fixtures/shop-site   # try the engine offline
```

Postgres for development:

```bash
docker run -d --name pw-postgres -e POSTGRES_USER=pflichtwaechter \
  -e POSTGRES_PASSWORD=pflichtwaechter -e POSTGRES_DB=pflichtwaechter \
  -p 5432:5432 postgres:16-alpine
pnpm db:deploy
```

## Production (single VPS)

```bash
cp .env.example .env   # fill everything relevant
docker compose -f infra/docker-compose.yml up --build -d
```

Services: `postgres` (volume-backed), `worker` (runs migrations, then jobs),
`web` (Next.js standalone), `caddy` (TLS via Let's Encrypt for `$DOMAIN`).

Health: `GET /healthz` (liveness), `GET /readyz` (DB reachable).

## Repo layout

```
apps/web          Next.js app (landing, legal pages, health routes)
apps/worker       worker process (heartbeat now; crawler/queue/retention next)
packages/rules    pure rule engine + fixtures + tests + CLI
packages/db       Prisma schema + client + migrations
infra             docker-compose, Caddyfile, Dockerfiles
legal             German markdown sources for the legal pages
docs/PLAN.md      build plan and phase status
LEGAL.md          every placeholder to fill before going live
mobile/           Kompass — separate offline AI companion app (Expo, iOS/Android); see mobile/README.md
```

## Launch-Checkliste (Deutschland, Solo-Gründung)

1. **Gewerbe anmelden** — SaaS ist Gewerbe, nicht freiberuflich.
2. **Fragebogen zur steuerlichen Erfassung** beim Finanzamt (ELSTER) einreichen.
3. **Geschäftskonto** eröffnen.
4. **Stripe-Konto** mit DE-Entität anlegen, Auszahlung auf DE-IBAN.
5. **Domain + EU-VPS** (z. B. Hetzner Nürnberg/Falkenstein) beschaffen.
6. **`LEGAL.md`-Platzhalter** vollständig ausfüllen (`grep -rn "{{" legal/` muss leer sein).
7. **IT-Recht-Anwalt** über AGB/Datenschutz/AVV schauen lassen (400–900 €, nicht überspringen).
8. **Kleinunternehmer-Entscheidung** dokumentieren; `VAT_MODE` entsprechend setzen.
9. **Testkauf** in Stripe-Testmodus inkl. Widerrufs-Checkbox — Consent-Zeitstempel im Log prüfen.
10. **robots-/Bot-Seite** live: `/bot` erklärt `PflichtwaechterBot/1.0`.
11. **Erste 20 Seed-Scans** auf einwilligenden Websites fahren.
12. **Stripe-Live-Keys** aktivieren.

## License / status

Private, pre-launch. Legal page contents are drafts
(„Entwurf — vor Launch von einem IT-Recht-Anwalt prüfen lassen").
