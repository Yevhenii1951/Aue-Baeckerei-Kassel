# ABE-039: Cart lives only in the header

## Kontext

The owner wants one cart entry point. The header carried both a cart icon and
an amber "Jetzt vorbestellen" CTA, the catalog page repeated the cart as a
sticky panel, and the mobile menu repeated the CTA a third time.

## AC

- The header shows the cart icon only; no preorder button in the header or in
  the mobile menu. `ctaPreorder` is gone from all locales.
- `/sortiment` renders no cart panel: `ShopCartSummary` is deleted and the
  catalog grid is single column again.
- "Zur Vorbestellung" in the cart drawer leads to `/vorbestellen` and the
  drawer closes on navigation.
- The cart stays reachable through the header badge on every page.
- `npm run check` and `npm run build` are green.

## Out of scope

- The preorder flow on `/vorbestellen` itself.
- The product card buttons ("In den Warenkorb" / "Vorbestellen").
