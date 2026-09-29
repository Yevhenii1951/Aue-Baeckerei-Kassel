# ABE-038: Café in the header navigation

## Kontext

The owner asked for the café back in the header after ABE-035 shipped the new
IA without it. `/kafe` exists (ABE-034), so this is a navigation change only.

## AC

- The header navigation lists Sortiment, Vorbestellen, Café, Kontakt, Karriere,
  Partner werden; the drawer mirrors the same list.
- The footer keeps the same list plus Liefergebiet.
- The link lists still come from one place: `cafe` moved from the footer-only
  label type into `NavLabels`, so `footerNavigationLinks` is the header list
  plus the delivery page.
- Six items fit at 1024 px without overlapping the cart or the CTA, and nothing
  overflows at 390 px.
- `npm run check` and `npm run build` are green.

## Out of scope

- Reordering the IA beyond the café placement the owner asked for.
