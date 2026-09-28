# State

Status: ABE-001 through ABE-009 implemented on `main` (before the branch
workflow was enforced). Infra and design-system remediation in review.

Purpose: PORTFOLIO. Tier: Standard. Locales: de (canonical), en, uk.

## Done

- Kalyna infrastructure base imported: 4 migrations, `bootstrap_roles.sql`,
  fixture seed, 6 db scripts, 5 integration test files, env group guards.
- `.env.example` and `.github/workflows/ci.yml` restored from the base. Both
  were lost when the base was copied, which left `npm run check` red and the
  documented setup broken.
- Local databases: `aue_beckerei` (dev) and `aue_beckerei_test` (tests).
  `npm run check` is green: 83 unit + 16 integration.
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

- ABE-010 cart drawer and persistent cart state, on branch
  `feature/abe-010-cart-drawer`. Cart state is currently local `useState`
  inside `CatalogShop`, so it dies on navigation.
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
