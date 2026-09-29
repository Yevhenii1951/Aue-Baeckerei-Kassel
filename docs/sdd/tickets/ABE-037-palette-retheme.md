# ABE-037: Palette re-theme (green / amber / navy)

## Kontext

The owner asked for the whole site to move to the colour scheme of the agreed
reference: deep green, amber yellow and a navy that carries the dark surfaces.
The previous palette was crust brown on oven black. The direction and the
mapping are recorded in `docs/sdd/design.md`.

## AC

- Tokens in `src/app/globals.css`: `brand #17453e`, `brand-dark #0f332c`,
  `brand-deep #0f0f2d`, `amber #fae462`, `amber-soft #fbf1c1`,
  `cream #f7f4ec`, `paper #fdfcf7`, `ink #22222c`.
- `sage` is retired. Every former `text-sage` / `border-sage` / `bg-sage` use
  points at `brand`, which is the same role with the new colour.
- The hero vignette, the body grid, the focus ring, the card borders and both
  shadows are mixed from the tokens — no raw colour literals left in
  `globals.css` or in JSX.
- All text/background pairs used for body copy, eyebrows, nav links, the amber
  CTA and the cart panel pass WCAG AA (worst measured pair: 9.76:1).
- Typefaces are untouched: Alegreya (display) and Manrope (sans), both with
  Cyrillic so the uk locale stays on brand.
- `npm run check` and `npm run build` are green.

## Verified

- Landing, `/sortiment`, `/vorbestellen`, `/kontakt` and `/kafe` at 1440, 1024
  and 390 px: no horizontal overflow, cart panel `bg-brand-dark` with cream
  text, badge amber on navy, aria-label "Warenkorb, 1 Artikel".

## Out of scope

- Component-level design changes (rounded shapes, spacing, imagery) beyond
  what the new colours force.
- The remaining `ConsentRevokeLink` German label (noted in `state.md`).
