# Aue-Bäckerei Kassel

A portfolio project for a modern craft bakery in Kassel: video-led landing page,
catalogue, preorder flow, cafe content, delivery/subscription concepts, and an
admin backliste for bakery production.

It is derived from the Kalyna infrastructure base and now owns its bakery
domain, SDD artifacts, and feature tickets.

## What is inside

- Next.js App Router, React, TypeScript, Tailwind CSS v4
- next-intl with German as canonical language
- Supabase/Postgres infrastructure for future staff/admin workflows
- German legal shell with Impressum and Datenschutz routes
- SDD docs in `docs/sdd/`
- first hero asset at `public/373419_medium.mp4`

## Setup

```bash
npm install
cp .env.example .env.local          # fill in URL, SITE_NAME, DEV_DATABASE_NAME, DATABASE_URL, Supabase
createdb app_dev
npm run db:local:migrate
npm run dev
```

`db:local:migrate` reads `DATABASE_URL` and `DEV_DATABASE_NAME` from
`.env.local`, so no inline environment variable is needed.

For the tests, create a second, disposable database:

```bash
createdb app_test
printf 'APP_ENV=test\nTEST_DATABASE_NAME=app_test\nTEST_DATABASE_URL=postgresql://<user>@/app_test?host=/var/run/postgresql\n' > .env.test.local
```

`npm run check` also runs unit and integration tests. Database-backed tests need
the local test database described in `.env.example`.

## Environment

Two values are required for the database scripts to run at all, and they exist
to stop a mistake from destroying real data:

- `DEV_DATABASE_NAME` — the local dev database. `npm run db:local:*` refuses any
  other database name and refuses non-local hosts.
- `TEST_DATABASE_NAME` — the disposable test database. The integration suite
  drops `public` between files, so it refuses any other name and any remote
  host, including Supabase.

Optional integrations are grouped. A group is off by default; enabling one
makes its keys mandatory, and `assertEnvGroup()` in `src/lib/env/groups.ts`
turns a half-configured group into an actionable error instead of a runtime
mystery:

```bash
ENABLE_EMAIL=true   # then BREVO_API_KEY is required
```

No optional group has a production call site yet. Enable integrations only when
their feature ticket needs them.

## Conventions

`AGENTS.md` and the workspace rules hold the coding contract. `docs/sdd/` holds
the product contract and ticket scope.

## Licence and provenance

Built from the author's own reusable infrastructure base. Replace placeholder
photos/assets with owned or properly licensed material before any commercial
use.
