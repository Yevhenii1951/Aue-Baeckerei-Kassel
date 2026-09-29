# ABE-042: Café hero photo and pairing cards

## Kontext

The owner supplied a fourth café photo for the hero and asked for the
"Passt dazu" section to become photo cards whose description appears clearly
on hover.

## AC

- `/kafe` has a full-bleed hero band under the title block: the photo at 60%
  opacity under a paper-to-cream gradient, 46vh with a 18rem floor and a 34rem
  ceiling, `priority` loaded, `object-cover`.
- "Passt dazu" renders four pairing cards instead of text cards: the drink as
  the card image, the cake as a circular inset, title and description on a dark
  overlay.
- The overlay is `.pairing-caption`: opacity 0 by default, 1 on
  `group:hover` and `group:focus-within`, and always 1 under `@media (hover: none)`
  so touch devices never lose the text.
- The hero is optional data (`page.hero`), so the other three content pages are
  unchanged; `highlights` became optional and the other three still supply it.
- `docs/sdd/assets.md` records the conversion.
- `npm run check` and `npm run build` are green.

## Open with the owner

- Alt text of the hero is "Innenraum des Cafés an der Backstube" — a guess from
  the file name, because the photo cannot be inspected from the repo.
