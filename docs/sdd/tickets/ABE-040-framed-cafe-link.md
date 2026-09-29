# ABE-040: Framed café link in the header

## Kontext

After ABE-038 the café sat in the nav row like a category. It is a place to
visit, not a step of the ordering flow, so the owner wants it set apart.

## AC

- The header nav lists Sortiment, Vorbestellen, Kontakt, Karriere,
  Partner werden — no café.
- The café is a framed link next to the cart on every viewport, styled by
  `.nav-cafe-link`: rounded, amber border, amber text, filled on hover.
- The footer keeps the café inline, between Vorbestellen and Kontakt, plus the
  delivery page.
- Nothing overlaps or overflows at 1024 px or 390 px.
- `npm run check` and `npm run build` are green.

## Out of scope

- The café page content; the owner will supply photos later.
