# Stack Decision

## Chosen Stack

- Next.js App Router with React and TypeScript.
- Tailwind CSS v4 with project tokens in `src/app/globals.css`.
- next-intl with German as canonical locale.
- Supabase/Postgres infrastructure from Kalyna Base for staff auth, RLS
  patterns, migrations, and future admin data.
- Vitest for unit and integration tests.

## Why

The copied Kalyna Base already provides the infrastructure this portfolio
project needs: German legal shell, locale routing, metadata, staff auth/RBAC,
database runner, environment validation, and tests. Starting from it is faster
and demonstrates a realistic reusable-project workflow.

## Alternatives

- Astro static site: better for a pure marketing bakery page, but too thin for
  cart, preorder, slot capacity, and admin backliste.
- Shopify/Woo/Shopware: realistic for a real bakery, but weaker as a portfolio
  showcase for custom domain logic.
- Custom Vite SPA: not appropriate for German local SEO and server-side order
  logic.

## Hosting Assumption

Local-first during development. A future deploy can use Vercel plus Supabase
once environment values, legal copy, and asset ownership are ready.
