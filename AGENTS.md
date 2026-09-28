---
project: aue-baeckerei-kassel
type: portfolio bakery ordering project based on Kalyna infrastructure
stack: Next.js 16, React 19, TypeScript, Tailwind 4, Supabase, next-intl, Vitest
domain: modern craft bakery in Kassel with preorder, catalogue, cafe, and admin backliste
tier: Standard
---

# Project Rules

A portfolio project for a modern craft bakery in Kassel. It is derived from the
reusable Kalyna infrastructure base, and it owns the bakery domain, the
`docs/sdd/` artifacts, and the feature tickets.

## Read First

1. `README.md` — setup and the branch workflow.
2. `docs/sdd/state.md` — what is done, what is next, which branch.
3. `docs/sdd/tier.md` and `docs/sdd/spec.md` — the ceremony level and the
   requirements a ticket may fulfil.
4. `src/features/README.md` — module boundaries and how to add one.
5. the workspace `AGENTS.md` — the coding contract this project inherits.

## Workflow

- One ticket is one branch and one PR. Branch names are
  `feature/abe-<n>-<slug>`, matching the ticket ID in `docs/sdd/tickets/`.
- `npm run check` green before the PR. CI runs the same command plus
  `npm run build`.
- Never commit feature work directly to `main`. Merge your own PR once CI is
  green.
- Update `docs/sdd/state.md` at the end of every session.

## What Belongs Here

- `src/lib` — cross-cutting infrastructure. Must never import from a feature.
- `src/features/identity` — staff auth and RBAC.
- `src/features/catalog`, `ordering`, `bakery-admin`, `content` — the bakery
  domain. See `src/features/README.md` for boundaries.
- `src/features/seo`, `legal`, `shell` — locale metadata, German legal pages,
  site chrome.
- `db/migrations` — the RLS + grants + trigger patterns, not tables.
- Tests for behaviour that computes: cutoff dates, slot capacity, cart totals,
  filter logic, allergen codes, RBAC, the database fuse, i18n key parity,
  canonical URLs.

## What Does Not Belong Here

- Third-party assets without recorded ownership. `docs/sdd/assets.md` tracks
  provenance; a real clip is not a licence.
- Secrets of any kind. `.env.example` documents variables; values are never
  committed.
- Unused dependencies. If no module imports it, it is not in `package.json`.
- Design tokens with no user. A colour no component references does not belong
  in the theme.
- Another project's vocabulary in names. Tokens and classes are named for the
  bakery, not for the restaurant this base came from.

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
- No Framer Motion. Respect `prefers-reduced-motion` — a CSS class that hides
  content until a script reveals it is a bug if the script is missing.
- Design tokens are CSS variables. No hardcoded brand colours in JSX, and no
  raw colour literals in `globals.css` either.
- Server Components by default; client components only for browser APIs.
- Cart state is a shared store, not per-page component state. See
  `src/features/ordering/`.

## Required Checks

`npm run check` runs lint, typecheck, unit tests, and integration tests
sequentially. It must be green before you commit. `npm run build` must pass too.

Integration tests share one disposable database and drop `public` between
files. `--no-file-parallelism` in the `test:integration` script is what keeps
them safe — do not remove it. The fuse refuses any database whose name does not
match `TEST_DATABASE_NAME` and any host that is not local.

Local databases: `aue_beckerei` for development, `aue_beckerei_test` for the
integration suite. Both names are in `.env.example`.

## Next.js Agent Rules

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
