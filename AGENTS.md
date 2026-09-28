---
project: aue-baeckerei-kassel
type: portfolio bakery ordering project based on Kalyna infrastructure
stack: Next.js 16, React 19, TypeScript, Tailwind 4, Supabase, next-intl, Vitest
domain: modern craft bakery in Kassel with preorder, catalogue, cafe, and admin backliste
---

# Base Rules

This project is derived from the reusable Kalyna infrastructure base. The base
rules still apply, but this repository now owns the Aue-Baeckerei domain,
`docs/sdd/` ceremony, and bakery-specific feature work.

## Read First

1. `README.md` — what this base contains and the fork checklist.
2. `src/features/README.md` — module boundaries and how to add one.
3. the workspace `AGENTS.md` — the coding contract, which this base inherits.

There is no `docs/sdd/` here on purpose. Create it in the derived project.

## What Belongs Here

- `src/lib` — cross-cutting infrastructure. Must never import from a feature.
- `src/features/identity` — staff auth and RBAC, the one domain-shaped module
  the base keeps because nearly every project needs it.
- `src/features/seo`, `legal`, `shell` — locale metadata, German legal page
  shell, site chrome.
- `db/migrations` — the RLS + grants + trigger patterns, not tables.
- Tests for behaviour that computes: RBAC decisions, the database fuse, env
  group validation, i18n key parity, canonical URLs.

## What Does Not Belong Here

- Any restaurant, catalogue, cart, order, booking or content domain.
- Business copy. The pages here are placeholders that exist to prove the build
  works.
- Third-party assets. `public/` is empty; add your own and record ownership
  before commercial use.
- Unused dependencies. If no module imports it, it is not in `package.json`.
- Secrets of any kind. `.env.example` documents variables; values are never
  committed.

## Standing Rules

- German is the canonical content language. Other locales fall back to German.
- Never copy credentials from another project. Use fresh per-environment secrets.
- Validate every external boundary with Zod.
- Every exposed Supabase table has explicit grants and RLS. `audit_events` is
  append-only; audit payloads go through `redact_audit_json()`.
- Prices are integer euro cents, always recalculated server-side.
- Timestamps are `timestamptz`; business time zone is `Europe/Berlin`.
- Feature groups are off by default. Enabling one makes its keys required.
- Secret and service keys are server-only. Never log PII, secrets or tokens.
- No Framer Motion. Respect `prefers-reduced-motion`.
- Design tokens are CSS variables. No hardcoded brand colours in JSX.
- Server Components by default; client components only for browser APIs.

## Required Checks

`npm run check` runs lint, typecheck, unit tests, and integration tests
sequentially. It must be green before you commit. `npm run build` must pass too.

Integration tests share one disposable database and drop `public` between
files. `--no-file-parallelism` in the `test:integration` script is what keeps
them safe — do not remove it. The fuse refuses any database whose name does not
match `TEST_DATABASE_NAME` and any host that is not local.

## Next.js Agent Rules

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
