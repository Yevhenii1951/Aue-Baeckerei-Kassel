# State

Status: ABE-001 through ABE-009 implemented on `main` (before the branch
workflow was enforced). Infra and design-system remediation in review. ABE-010
in review on `feature/abe-010-cart-drawer`.

Purpose: PORTFOLIO. Tier: Standard. Locales: de (canonical), en, uk.

## Done

- Cart is a shared store, not per-page state: `@/features/ordering/cart-provider`
  (module store via `useSyncExternalStore`), persisted to
  `localStorage["aue.cart.v1"]`, parsed with a Zod schema in `cartStorage.ts`
  that falls back to an empty cart. Badged header toggle, slide-out `CartDrawer`
  (Escape, backdrop click, totals, discount, empty state, CTA to
  `/vorbestellen`), `ShopCartSummary` and `CatalogShop` read the same store.
  Browser-checked: add on `/de/sortiment`, reload, unchanged totals.
- Kalyna infrastructure base imported: 4 migrations, `bootstrap_roles.sql`,
  fixture seed, 6 db scripts, 5 integration test files, env group guards.
- `.env.example` and `.github/workflows/ci.yml` restored from the base. Both
  were lost when the base was copied, which left `npm run check` red and the
  documented setup broken.
- Local databases: `aue_beckerei` (dev) and `aue_beckerei_test` (tests).
- Design system corrected: four Kalyna colour literals replaced with tokens,
  dead tokens and component classes removed, restaurant vocabulary renamed to
  bakery vocabulary. Token table is in `docs/sdd/design.md`.
- Hero video re-encoded 7.1 MB to 1.4 MB, poster frame added, and
  `prefers-reduced-motion` now gets the still instead of the loop.
- Open Graph image moved into the `[locale]` segment so it is actually emitted
  in `<head>`; the `metadataBase` build warning is gone.
- ABE-001..ABE-009: landing page, demo catalogue and filters, preorder cutoff
  and pickup slots, cart totals, admin backliste aggregation, delivery/abo/
  Firmenservice content, cafe section, bakery JSON-LD, `/sortiment` shop.

## Next

- ABE-011 `/vorbestellen` preorder flow, building on the persistent cart store
  and the existing cutoff/slot logic in `src/features/ordering/preorder.ts`. The
  drawer CTA already links there; the page is not built yet.
- Product photography. Not covered by any ticket: `Product` has no image
  field and `ProductGridCard` renders text only. Needs a ticket before ABE-021.
- i18n of the new bakery features. `de/en/uk` message files are complete, but
  all 17 bakery components hardcode German, so `/en/sortiment` and
  `/uk/sortiment` serve German. NFR-1 permits the fallback for now.

## Notes

- Supabase is not configured and is not needed for the public site or the demo
  catalogue. It becomes required at the staff-auth ticket (ABE-015+).
- `.gitignore` excludes copied dependency/build artifacts.
- `docs/sdd/` is tracked in this repository, unlike in the base.
- The old `public/373419_medium.mp4` remains in git history at 7.1 MB; only
  new clones of the tip see the 1.4 MB version.
