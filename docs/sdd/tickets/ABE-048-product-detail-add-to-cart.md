# ABE-048 — Product detail "In den Warenkorb" was a link, not a button

## Problem

The primary CTA on every product detail page did nothing the label promised.

`src/app/[locale]/(public)/sortiment/[product]/page.tsx` rendered

```tsx
<Link href={`/${locale}/sortiment`} className="btn-amber text-center">
  {t("addToCart")}
</Link>
```

`addToCart` is "In den Warenkorb" in German — the same string the catalogue
grid card uses for a real `<button>` that calls `addToCart(product)`. On the
detail page the identical label was attached to a link back to the catalogue.
Clicking it navigated away and left `aue.cart.v1` untouched. The cart drawer
never opened, no item was added, and the page it led to was the one the visitor
had just left.

The misleading part is that the behaviour was correct *elsewhere*. Verified in
the browser on `/de/sortiment`: 65 grid cards render `In den Warenkorb` as a
`BUTTON`, and clicking one writes
`[{"productId":"brownie","name":"Brownie","category":"sweets","unitPriceCents":450,"quantity":1}]`
to `aue.cart.v1`. The detail page was the only place where the label and the
action disagreed.

Not a regression from the photo work. `git blame` dates the link markup to
`24f0c159` (2026-09-28) and the `addToCart` label to `6e67ad72` (2026-09-29),
both from earlier ABE tickets.

## Change

New client component `src/features/catalog/components/AddToCartButton.tsx`,
built on the same store the grid uses:

- `useCart()` for `items` and `addToCart` — no new state, no second cart.
- Reads its own quantity out of `items` by `productId`.
- `useTranslations("catalog")`, so it reuses the existing `addToCart` and
  `inCart` keys in all three locales. No new i18n keys.
- The page keeps `Link` for the sibling "Vorbestellen" action, which was always
  correct.
- `CartToggleButton` now displays the sum of item quantities instead of the
  number of distinct product lines, so adding the same product updates the
  visible badge (`null -> 1 -> 2`).

The page is a Server Component, so the click handler cannot live in it. The
component stays small and the page stays a server component.

Behaviour follows the owner's decision: the button adds the item and **does not
open the cart drawer**. Feedback is the label flipping to `inCart` with the
count ("Im Warenkorb: 2"), the same affordance the grid card already uses.

## Verified

`npm run check` green — 191 unit + 24 integration. `npm run build` green.

Browser, 3 locales x 3 products (`brownie`, `caffe-crema`,
`classique-frikadelle`), all 9 combinations asserted: HTTP 200, the CTA is a
`BUTTON`, the expected `productId` is stored with `quantity: 1`, the URL does
not change, the cart drawer does not open (`drawerBefore: 0, drawerAfter: 0`),
and the label changes. Labels per locale: `In den Warenkorb` -> `Im Warenkorb:
1`, `Add to cart` -> `In cart: 1`, `До кошика` -> `У кошику: 1`.

Two clicks give one cart line at `quantity: 2` — no duplicate lines. The header
badge updates from null -> "1" -> "2". The button measures 349x54, identical to the
sibling "Vorbestellen" link, so the amber CTA did not change size when it became
a button.

No `pageerror`. The CSP `eval()` console error is the pre-existing dev-only
React warning, present before this ticket.

## Notes

No unit test. The defect is that a `Link` had no click handler, and no correct
seam exists to assert that without a DOM library the project does not depend on
— the same trade-off recorded in ABE-045. The store logic it now calls is
already covered. The browser loop above is the contract.

Two processes failed against the fixed build and both were the probe, not the
code: a non-`exact` `getByRole` name treats `A|B|C` as a literal substring, and
a `status` field that was only set on the 404 branch made the filter read
`undefined !== 200` and report 9/9 failures against 9/9 passing data. The
criteria are listed in the ticket because a loop that cannot report PASS is not
evidence.
