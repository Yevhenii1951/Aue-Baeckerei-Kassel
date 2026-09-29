# ABE-045 — Cart is emptied after a submitted order

## Problem

Submitting on `/vorbestellen` and on `/kasse` showed the confirmation, but the
cart kept its items: the header badge still counted them, `localStorage` kept
`aue.cart.v1`, and the summary panel still listed the order. A guest could read
"Vielen Dank" and then walk to the counter with a cart full of the same goods,
or place the identical order twice by reloading the page.

`cart-provider.tsx` had `addToCart`, `changeQuantity`, `openCart` and
`closeCart`, but nothing to empty the cart, so no flow could call it.

## Change

- `clearCart()` in `src/features/ordering/cart-provider.tsx`: drops the items
  through the existing `updateItems` (so `localStorage` is rewritten) and closes
  the drawer. Exposed on `useCart()`.
- `PreorderFlow` and `CheckoutFlow` call it on a successful submit, after
  validation and before the confirmation renders.
- `PreorderSummary` takes an optional `frozenTotals`. The confirmation screens
  pass the totals captured at submit time, so the placed order stays visible
  while the cart itself is empty. `ConfirmedOrder` carries that copy.
- Both flows guard the empty-cart branch with `&& !confirmed`. Without it the
  emptied cart swapped the "Vielen Dank" panel for "Dein Warenkorb ist noch
  leer" on the next render.

## Verified

Browser, `/de` at 1280 px: added a product, picked a slot, submitted. Cart
storage is `[]`, the header badge is gone, and the summary still shows the
submitted line with its total. Repeated for `/kasse` with cash on pickup —
order number `B-2026-0001` rendered, cart empty. `npm run check` green (191
unit, 24 integration), `npm run build` green.

## Notes

No test. The defect is store state in a module singleton, not computed logic,
and asserting it would need a DOM library the project does not depend on. The
browser run above is the contract.

The Stripe path is untouched: `/kasse/erfolg` is a server page reached by
redirect, and nothing there empties the cart. It matters only once payments are
enabled, and the cart is empty by then anyway if the customer returns via the
redirect from the cart that was already submitted.
