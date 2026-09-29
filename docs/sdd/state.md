# State

Status: ABE-001 through ABE-009 implemented on `main` (before the branch
workflow was enforced). ABE-010 through ABE-021, plus ABE-022 to ABE-031,
merged on `main`.

Purpose: PORTFOLIO. Tier: Standard. Locales: de (canonical), en, uk.

## Done

- ABE-031 admin/identity i18n on `feature/abe-031-admin-identity-i18n`: the
  staff surface is off hardcoded language onto a new `admin` next-intl
  namespace. `bakery-admin/*` (which was hardcoded German) and `identity/*`
  (which was hardcoded English) now render de/en/uk chrome: dashboard KPIs,
  order filters, status badges, the status path, order cards, the Backliste
  panel, the login/password forms and the three admin pages (via
  `generateMetadata`). German stays canonical; en/uk translate chrome.
  Demo data (product/customer names, backliste rows) stays German as content.
  `demoDashboard.ts` lost `ORDER_STATUS_LABEL` and `CUTOFF_NOTE` (status labels
  and the "20:00 cutoff" copy now live in `admin.statuses`/`admin.dashboard`);
  `CUTOFF_TIME` stayed a "20:00" constant and "Uhr" comes from messages.
  Money in admin now goes through `formatEuroCents(cents, locale)` and
  `src/features/ordering/price.ts` was deleted. Auth server actions now return
  stable codes (zod messages too: `invalid_email`, `password_too_short`,
  `passwords_must_match`) under `admin.auth.*`, and the client renders the
  locale wording with a `t.has()` fallback. The stray "(Admin-Login de)"
  suffix in `de.json` `login.notConfigured` was removed. `npm run check` green
  (184 unit + 24 integration); `npm run build` green with `/admin` SSG in all
  three locales; browser-verified in de/en/uk (typed demo prices agree across
  locales, e.g. 217,20 € / €217.20).
- ABE-030 public-path i18n on `feature/abe-030-i18n-public-path`: the public
  customer journey is off hardcoded German. All catalog/cart/preorder/
  checkout/delivery components and the `sortiment`, `lieferung`, `/kasse` and
  preorder pages render through `useTranslations`/`getTranslations`;
  Zod validation surfaces stable codes via a new `validation` namespace;
  `catalog.types` now exports `PRODUCT_CATEGORIES`/`ALLERGEN_CODES` so the
  enum and the messages cannot drift (a parity test pins them together).
  `tagLabel` falls back to the raw German tag instead of leaking a key.
  Site chrome is localised too: `ConsentBanner`, root `error.tsx`,
  `layout.tsx` `generateMetadata` and the Open Graph image. Hardcoded
  `de-DE` remains only where it is intentional: Impressum/Datenschutz, the
  server email, local SEO content and `demoProducts.ts` — catalogue content
  stays German in every locale by owner decision (NFR-1 fallback now covers
  content, not chrome). Money stays `formatEuroCents`. `npm run check` green
  (184 unit + 24 integration, incl. the rewritten `i18n-messages.test.ts`);
  `npm run build` green with all three locales SSG; browser-verified in de/en/uk.
- ABE-027 order confirmation email on `feature/abe-027-email-confirmation`: a
  new `src/features/notifications` with `domain.ts` (the `EmailAdapter`
  contract), `brevo.ts` (the provider adapter, ported from Kalyna with bakery
  vocabulary instead of the restaurant's), `orderConfirmation.ts` (the pure
  payload builder) and `runtime.ts` (the env gate). The message is built from
  the same server-calculated lines and totals that reach Stripe, and the order
  number doubles as the Brevo `idempotency-key` so a retry cannot send twice.
  HTML escapes customer input; the text part carries the same numbers.
  `startCheckout` now takes an optional `onOrderConfirmed` and calls it only
  after the payment session exists, inside a `try`/`catch`, so a Brevo outage
  cannot take down an order that is already committed or stop a customer who
  is already at Stripe — that "a failed mail must not lose the order" case is
  a test, not a claim.
  The bakery has no mail domain, so `EMAIL_SENDER_NAME` and
  `EMAIL_SENDER_ADDRESS` are **required** for the group rather than invented;
  `assertEnvGroup` fails closed without them, and `env-groups.test.ts` was
  updated (it caught the change) plus a new case for the enabled group.
  6 new unit tests.
  Worth knowing: because the demo checkout never reaches the server, the
  confirmation only exists on the Stripe path — with payments off there is no
  order row to confirm. A real Brevo delivery was not exercised; no API key
  and no sender domain are configured here.
- ABE-026 Stripe test mode on `feature/abe-026-stripe-test-mode`: a new
  `src/features/payments` in three layers — `stripeClient.ts` (server-only
  `StripeCheckoutClient` behind an interface, `stripe@^22.6.2`, the version
  Kalyna pins), `checkout.ts` (the pure `startCheckout` that is the only place
  an order and a Stripe session are joined, and therefore the only place worth
  testing) and `runtime.ts` (wires the real pool and key, returns `null` while
  the group is off), plus the `startStripeCheckoutAction` server action. The
  browser only ever sends `productId` + `quantity`; `createOrder` now also
  returns the server-calculated `subtotalCents`/`deliveryFeeCents`/`totalCents`
  and the priced `lines`, and those are what reach Stripe, so a tampered cart
  cannot move the amount. Delivery fee is its own line item, and `orderId` +
  `orderNumber` travel in `client_reference_id` and both `metadata` bags.
  Payments stay behind the existing `ENABLE_PAYMENTS` group, so with the group
  off (the default) `/kasse` keeps the ABE-012 demo confirmation untouched; only
  the `stripe` method, and only when the group is on, leaves for Stripe. Added
  the `/kasse/erfolg` thank-you page (noindex, absent from the sitemap) and
  `?payment=cancelled` back at the checkout with a "nothing was charged" notice.
  4 new unit tests with a mocked Stripe client.
  Browser-verified: the demo order `B-2026-0001` still completes end to end,
  the cancel notice renders, the thank-you page returns `noindex` with the
  order number. A live Stripe redirect was **not** exercised — no test key is
  configured, so `stripe.checkout.sessions.create` has never run against
  Stripe from this repo. The request shape follows the official
  `stripe-node` docs, and marking the order paid still needs a webhook, which
  no ticket covers yet.
- ABE-025 mobile polish on `feature/abe-025-mobile-polish`: the header no
  longer renders six nav links in a wrapping row that made the sticky bar 185 px
  tall on a 390 px screen; a burger + drawer below `lg` (reused from Kalyna's
  `MobileMenu`) brings it to 77 px. The real overlap bug was elsewhere:
  `cart-provider` keeps `isOpen` in a module-level singleton, so navigating via
  "Zur Vorbestellung" left the drawer and its backdrop on top of the preorder
  page — `CartDrawer` now closes on pathname change. Nav, footer, slot, date
  and quantity controls all moved to `min-h-11`/`size-11`, and the brand no
  longer breaks mid-word at 320 px. Both overlays used `body { overflow: hidden }`
  which does nothing here because `html` is the scroll container, so that was
  replaced with `touch-none` on the backdrop. Findings and measurements are in
  `docs/sdd/tickets/ABE-025-mobile-polish-qa.md`.
- ABE-028 consent-safe delivery map on `feature/abe-028-map-delivery-ui`:
  `DeliveryZoneMap.tsx` draws the three zones as concentric circles around the
  bakery using radii taken from `DELIVERY_ZONES` (2/5/8 km) instead of invented
  bounds, so the picture cannot drift from the fee table, plus a bakery marker
  and a colour legend. Leaflet + `@types/leaflet` were added at the same
  versions Kalyna uses; the CSS import sits on the server page, following the
  Kalyna `kontakt` page. The component reuses the ABE-023 store, so a fresh
  visitor sees a text placeholder and PLZ checking keeps working. Verified
  against a production build: zero leaflet/OSM requests before consent, 26 tiles
  and 4 SVG circles after, PLZ 34123 still resolves to Zone 2 / 4,50 € with the
  map denied.
- ABE-022 local SEO pages on `feature/abe-022-local-seo-pages`: five
  intent-focused pages (`/lieferung-kassel`, `/brot-abo-kassel`,
  `/catering-kassel`, `/cafe-kassel`, `/sauerteigbrot-kassel`) from a new
  `localSeoPages.ts` content module, rendered by one `src/app/[locale]/[slug]`
  route with `generateStaticParams` (same convention as the product detail page)
  and `notFound()` for unknown slugs. Copy reuses real facts — delivery zones
  and fees from `DELIVERY_ZONES`, opening hours and pairings from the existing
  `home` messages — and adds no reviews, awards or ratings. The sitemap also
  grew: `/sortiment`, `/lieferung` and `/vorbestellen` were missing from it
  entirely before, so the site was asking search engines to index a home page
  and two legal pages only. 33 URLs now, each with de/en/uk + x-default.
  11 new unit tests.
- ABE-024 Datenschutz sections on `feature/abe-024-datenschutz-sections`: the
  two placeholder paragraphs became six sections covering technically necessary
  data, optional third-party content, order/contact data, the payment demo,
  server logs and the pre-launch review. Copy is extracted to
  `src/features/legal/privacySections.ts` and rendered by a reusable
  `LegalSectionBlock`, so the page stays under the file limit. Every statement
  was checked against the code rather than assumed: order columns are
  `customer_name/email/phone` + `delivery_address` + `customer_note`
  (`orderService.ts:84`), the payment step takes no card data, and the logger
  redacts email/phone/address/password/token keys (`src/lib/logger.ts:5`). The
  embeds that are *not* used are named explicitly, which is easier to defend
  than silence. 6 new unit tests; footer Impressum link verified reachable.
- ABE-023 cookie consent on `feature/abe-023-cookie-consent`: new
  `src/features/consent` with a pure Zod-validated `consentStorage` core
  (mirrors `cartStorage.ts`), a module store via `useSyncExternalStore`
  (mirrors `fulfillment-store.ts`), a bottom `ConsentBanner` and a footer
  `ConsentRevokeLink`. Technically necessary mode is the default: the map
  category starts `pending` and no third-party request is made before a choice.
  A denied choice persists as `denied` (not as a missing value), so the banner
  does not nag on every visit, and the footer link resets it back to `pending`.
  Datenschutz gained an "Optionale Inhalte Dritter" section naming the
  necessary/map categories, the OpenStreetMap IP exposure, and the embeds that
  are deliberately absent. Verified in the browser: zero OSM/tile/analytics
  requests before consent, banner appears, both choices persist, revoke returns
  the banner.
- Portfolio/photo notice on `feature/abe-024-legal-photo-notice`: the Impressum
  now states the site is a portfolio demo with sample data, that the product
  photos are illustrative with provenance documented in the repository, and that
  sources and licences must be cleared before commercial use. It also records
  that all images are served from the project's own server with no external
  image CDN, tracking or third-party embeds (verified: no tracker, no
  `remotePatterns`, no external image hosts in `src`). `docs/sdd/assets.md`
  records the owner's statement about the photo origin and drops a stale line
  claiming the catalogue has no image surface. Remaining ABE-024 scope (order,
  contact, payment mock, maps/embeds and logs sections) is still open.
- Product photos on `feature/abe-photos-product-images`: converted 66 supplied
  JPG product photos from `~/Downloads/` to 1200x900 WebP in `public/products`
  (one per catalogue product) and wired them to catalogue cards, product detail
  pages and product JSON-LD.
- ABE-021 product detail pages on `feature/abe-021-product-detail-pages`:
  added `/sortiment/[product]` with static params for demo catalogue products,
  unknown-product `notFound()`, per-product metadata, product JSON-LD, price,
  unit, tags, allergens, ingredient fallback, CTAs and related products by
  category/tag. Catalogue cards now link to detail pages. Ingredient arrays are
  still empty in the current demo data; the detail page does not invent facts
  and shows the existing fallback until real product data is added.
- ABE-020 demo seed on `feature/abe-020-demo-seed`: added
  `db/seeds/0002_ecommerce_demo.sql` with the full 66-product catalogue,
  three Kassel delivery zones, five pickup slots and three demo pickup orders
  with items/totals for admin/backliste smoke data. It uses the existing seed
  runner; `db:local:seed` remains protected by the local `DATABASE_URL` +
  `DEV_DATABASE_NAME` guard. New integration coverage resets a fresh test DB,
  runs migrations + seeds, then verifies public catalogue/zones and operational
  slots/orders/items.
- ABE-019 order server actions on `feature/abe-019-order-server-actions`:
  added `createOrderAction` plus a transactional Postgres service. The server
  validates checkout/customer/payment input, validates cart slugs and quantities,
  recalculates product prices from published DB products, checks pickup-slot
  capacity under row lock, and persists `orders` + `order_items` atomically. Full
  pickup slots return a clear `FULL_SLOT` result without partial records. The
  checkout UI remains on the demo confirmation until ABE-020 seeds real products
  and pickup slots for the public flow.
- ABE-018 database schema on `feature/abe-018-database-schema`: migration
  `0005_ecommerce_schema.sql` adds `products`, `orders`, `order_items`,
  `pickup_slots` and `delivery_zones` with integer cent prices, `timestamptz`
  operational timestamps, indexes, RLS and explicit grants. Public reads are
  limited to published products and active delivery zones; active staff sessions
  can manage ecommerce records. New integration tests cover table/RLS presence,
  money/timestamp column types, public read limits and staff writes.
- ABE-017 Backliste UI on `feature/abe-017-backliste-ui`: `/admin#backliste`
  now has a production date picker, sorted product totals, a product x slot
  matrix, print-friendly controls and a client-side CSV export from the shared
  `aggregateBackliste` data. Added pure `backlisteSlots` and `backlisteCsv`
  helpers with unit coverage for the visible matrix/export scenario.
- ABE-016 admin orders management UI on
  `feature/abe-016-orders-management-ui`: `/admin` now has filterable demo
  orders by date (Heute/Morgen), operational status and fulfillment type. The
  status path is visible (`Neu → In Zubereitung → Bereit → Abgeholt →
  Geliefert`), order cards expand to show customer/order detail, items, sum,
  note and disabled demo-only cancel/refund buttons. New pure filter helpers in
  `orderFilters.ts` are unit-tested, including the verification scenario
  Morgen + Abholung showing only tomorrow pickup orders.
- ABE-015 `/admin` dashboard on `feature/abe-015-admin-dashboard-ui`: KPI tiles
  (orders today, revenue, top product, 20:00 preorder cutoff), a today's-orders
  list (ID, customer, pickup/delivery, time, position count, status badge, total)
  and a Backliste panel from the shared `aggregateBackliste`. All values derive
  from pure `demoDashboard.ts` data; `sumRevenueCents`, `orderTotalCents` and
  `topProducts` are unit-tested. Anchors link to the Bestellungen and Backliste
  sections, and the staff auth shell stays (Staff-Login link to `/admin/login`).
  The day label comes from the client clock via `useClientNow` + Berlin date.
- ABE-014 delivery slots (in review on `feature/abe-014-delivery-slots`):
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

- ABE-031 is the last i18n ticket; nothing hardcoded remains on the surface.
  Follow-ups if any: end-to-end auth flows against a real Supabase project
  (the form-level codes are already localised but were not exercised with a
  live staff session).
- ABE-029 PWA was explicitly dropped by the owner: not in scope.

## Notes

- Supabase is not configured and is not needed for the public site, the demo
  catalogue or the demo checkout/delivery/admin-dashboard (ABE-015 uses demo
  data). It becomes required when orders/pickup persistence arrives (ABE-020+).
- `.gitignore` excludes copied dependency/build artifacts.
- `docs/sdd/` is tracked in this repository, unlike in the base.
- The old `public/373419_medium.mp4` remains in git history at 7.1 MB; only
  new clones of the tip see the 1.4 MB version.
