# ABE-044: Brand icons for the social links

## Kontext

The footer listed Instagram and Facebook as underlined text with `#` hrefs.
The owner asked for icons.

## AC

- Both links render an SVG glyph at 1.25rem, cream at 75% and amber on hover,
  with a 50x50 hit area for touch.
- The visible name stays available to screen readers and to the pointer through
  `aria-label` and `title`; the SVG itself is `aria-hidden`.
- The paths are the Simple Icons set (CC0-1.0), inlined in
  `src/features/shell/BrandIcon.tsx` — two glyphs do not justify a dependency.
  The provenance is recorded in `docs/sdd/assets.md`.
- Hrefs are still `#` placeholders until the owner has the real profiles.
- `npm run check` and `npm run build` are green.

## Note

Brand marks belong to their owners. They are used the way the platforms
require it: to link to the profiles they identify.
