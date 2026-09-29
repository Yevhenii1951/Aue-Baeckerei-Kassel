# ABE-030 i18n: public customer path

Implements: NFR-1

Status: done (PR #23, merged).

## Goal

Move the public customer journey off hardcoded German so `/en` and `/uk` serve
their own language instead of falling back.

## Scope

Catalog, cart, preorder, checkout, delivery and site chrome:

- `catalog/`: `CatalogShop`, `ProductGridCard`, `ShopCartSummary`,
  `CatalogPreview`, `CategoryTabs`, `productDetails.ts`, `types.ts`
  (`PRODUCT_CATEGORIES`/`ALLERGEN_CODES`), new `tagLabel.ts`
- `ordering/`: `CartDrawer`, `CheckoutConfirmation`, `CheckoutCustomerForm`,
  `CheckoutFlow`, `PreorderFlow`, `PreorderSummary`, `PreorderSlotPicker`,
  `PreorderCustomerForm`, `DeliveryZoneMap`, `DeliveryZoneChecker`,
  `DeliveryPanel`, `DeliverySchedule`, `useStripeCheckout`, `checkout-form.ts`,
  `preorder-form.ts` (Zod codes), `checkoutLabels.ts`, `delivery.ts`,
  `cartStorage.ts`
- `payments/`: `checkout.ts` (code, no German message in the client path)
- `shell/`: `CartToggleButton`, `ConsentBanner`, `error.tsx`, `[locale]/layout.tsx`
  (generateMetadata), `[locale]/opengraph-image.tsx`
- pages: `sortiment/[product]`, `sortiment`, `lieferung`
- `messages/{de,en,uk}.json`: new namespaces `validation`, `consent` and
  extended `catalog`/`cart`/`kasse`/`vorbestellen`/`lieferung`/`sortiment`/`shell`

## Out of scope

- **Impressum and Datenschutz stay German in every locale, on purpose.**
  German law requires a German Impressum; a translation is not a substitute.
  Marked in code and in `state.md` so it does not read as unfinished work.
- **Deutsche Inhalte bleiben deutsch (Entscheidung des Eigentümers).** The
  product catalogue (`demoProducts.ts`), the ~35 product tags and the local SEO
  landing pages (`localSeoPages.ts`) are *content*, and content stays German in
  every locale — `en`/`uk` translate the UI chrome only. `tagLabel.ts` falls
  back to the raw German tag when a translation is missing instead of leaking
  a message key. The order-confirmation email is German by design.
- Admin and identity UI: ABE-031.

## Acceptance Criteria

- No user-visible German literal in the files above; all copy comes from
  `useTranslations` / `getTranslations`.
- `de`, `en` and `uk` all carry the new keys; the i18n parity test stays green
  (parity plus `catalog.categories`/`catalog.allergens` coverage).
- German stays the canonical wording — `en`/`uk` are translations of it, not
  rewrites.
- No behaviour change: cart, slot picking, validation and the demo checkout
  must work exactly as before.
- Money stays `formatEuroCents`; no hand-written currency strings.

## Verification

Scenario: GIVEN `/en/sortiment` and `/uk/sortiment`, WHEN a product is opened
and added to the cart, THEN the labels are in that locale and the cart and
checkout still complete.

Scenario: GIVEN `/en/vorbestellen` and `/en/lieferung`, WHEN opened, THEN
headings, slots, zone names and the delivery checker are in English.

Scenario: GIVEN `/en/impressum`, WHEN it is opened, THEN the content is German
by design, not a fallback accident.

Tests: `npm run check` green — 184 unit + 24 integration (incl. the rewritten
`i18n-messages.test.ts` and `catalog-product-details.test.ts`). `npm run build`
green, all three locales SSG. Browser-verified in `de`, `en` and `uk` on the
dev server; the only console error is the benign React dev-mode eval/CSP note
(absent in production builds).