# State

Status: ABE-001 through ABE-009 implemented on `main` (before the branch
workflow was enforced). Infra and design-system remediation in review. ABE-010
through ABE-013 merged on `main`. ABE-014 in review on
`feature/abe-014-delivery-slots`.

Purpose: PORTFOLIO. Tier: Standard. Locales: de (canonical), en, uk.

## Done

- ABE-014 delivery slots on `feature/abe-014-delivery-slots`: 2-hour delivery
  slots 10:00–20:00 (`deliverySlots.ts`, past slots vanish for today in
  Europe/Berlin), an express option for zones 1–2 ordered before 12:00
  (+3,00 €, 2-hour window), optionally delivery date tabs (today + next two
  days), the delivery fee (zone fee, free above threshold) plus express
  surcharge lands in the order summary and on the confirmation, and the
  fulfillment selection (mode, date, slot, express) survives navigation via
  `fulfillment-store.ts` (`localStorage["aue.fulfillment.v1"]`). Order form
  requires a slot for delivery; `CheckoutConfirmation` shows Lieferzeit and
  Lieferkosten. Browser-checked: slot + fee in summary, confirmation with time
  and fee, reload keeps Lieferung and the slot. Fixed `useSyncExternalStore`
  getSnapshot returning a fresh `Date` (infinite loop) via cached `useClientNow`.
- ABE-013 `/lieferung` delivery zone checker on
  `feature/abe-013-delivery-zone-checker`: `delivery.ts` maps Kassel PLZs to
  zones (1/2/3 with fee 2,50/4,50/6,50 € and free thresholds 20/30/40 € —
  values set with the project owner), `/lieferung` explains the three zones and
  checks a PLZ with a clear service/unavailable message, and the `/kasse`
  delivery panel shows the matched zone and fee live as the PLZ is typed.
- ABE-012 `/kasse` demo checkout (in review on
  `feature/abe-012-checkout-simulation`):
  fulfillment switch (Abholung/Lieferung with address fields), 5 payment
  methods (Stripe/PayPal/Klarna/Bar·EC/Rechnung, no real API), Zod validation
  in `checkout-form.ts`, demo order number `B-2026-<seq>` (`orderNumber.ts`),
  confirmation with pickup/delivery summary and QR placeholder. Cart-empty
  state reuses the store. Browser-checked: address fields appear on Lieferung,
  field errors, order `B-2026-0001`.
- ABE-011 `/vorbestellen` preorder flow (in review on
  `feature/abe-011-vorbestellung`):
  page reads the persistent cart store, picks a pickup date (20:00
  Europe/Berlin cutoff, earliest date via `useSyncExternalStore` — no build-time
  date baked), a 30-minute slot, and the customer form (name/email/phone/notes,
  Zod in `preorder-form.ts`). Slots come from deterministic `demoSlots.ts`
  (capacity 15) so full/limited/available all show. Order summary reuses
  `PreorderSummary` (items, discount, total). New code is de-hardcoded, but a
  `vorbestellen` namespace was added to de/en/uk to satisfy the i18n parity
  test. Browser-checked: date shift, slot reset per date, validation errors,
  confirmation screen, empty-cart state.
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

- ABE-012+: move on to the next unrouted vertical. The product photography
  ticket precedes ABE-021.
- Product photography. Not covered by any ticket: `Product` has no image
  field and `ProductGridCard` renders text only. Needs a ticket before ABE-021.
- i18n of the new bakery features. `de/en/uk` message files are complete, but
  all 17 bakery components hardcode German, so `/en/sortiment` and
  `/uk/sortiment` serve German. NFR-1 permits the fallback for now. ABE-011
  added a `vorbestellen` namespace to all three files to keep the parity test
  green.

## Notes

- Supabase is not configured and is not needed for the public site, the demo
  catalogue or the demo checkout/delivery/admin-dashboard (ABE-015 uses demo
  data). It becomes required when orders/pickup persistence arrives (ABE-020+).
- `.gitignore` excludes copied dependency/build artifacts.
- `docs/sdd/` is tracked in this repository, unlike in the base.
- The old `public/373419_medium.mp4` remains in git history at 7.1 MB; only
  new clones of the tip see the 1.4 MB version.
