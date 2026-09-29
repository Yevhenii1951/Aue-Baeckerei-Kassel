# ABE-032 landing refresh

Implements: NFR-1 (visual/narrative polish), design direction
`docs/sdd/design.md` (updated 2026-09-29).

## Goal

The landing read as a default Tailwind card assembly. Refresh it to the
confirmed direction: editorial typography (Fraunces display), a cinematic
oven-video hero with grain/vignette, staged headline load, real product
miniatures in the fold, a discipline rhythm of cream/paper bands instead of
bordered boxes everywhere, a barely-there whole-site grain, one page-enter
animation per navigation, a single scroll reveal for the paths tiles, and a
small informational lucide icon set. Decor and motion stay out of the
functional surfaces (ordering, admin).

## Scope

- Display font: `next/font/google` Fraunces replaces Cormorant Garamond
  (`--font-display` variable stays; Cormorant import removed).
- `globals.css`: whole-site grain overlay (`body::before`, inline SVG
  `feTurbulence`, ~4%, disabled under `prefers-reduced-motion`), `.page-enter`
  mount animation, hero vignette/grain utilities, staged hero keyframes.
- Hero (`page.tsx`): vignette + noise over the video instead of a flat
  gradient, soft fade into cream at the bottom, staged load of eyebrow →
  headline → CTA → strip, three real product photo miniatures in the fold
  (from `/products/*.webp`, linking to `/sortiment`).
- Section rhythm on the home page + `ConversionSections` + `CafeSection`:
  alternate cream/paper bands, hairline dividers instead of border-everything,
  paths tiles get a lucide icon + CTA arrow slide, steps keep their numbered
  markers (real sequence).
- `Reveal` component (IntersectionObserver, fade + 16px, staggered children,
  rendered visible when JS is missing, disabled under reduced motion), used
  ONLY for the paths tiles — no per-section scroll reveals.
- New dependency: `lucide-react` (tree-shaken icons: Clock, Store, MapPin,
  Leaf, Flame, ArrowRight and peers actually used — nothing decorative).

## Out of scope

- Ordering, admin, catalogue behaviour and i18n copy (no message changes
  unless hero microcopy needs it).
- New stock imagery. Only the 66 existing product photos are reused.
- Framer Motion, marquees, custom cursors, scroll-jacking.

## Acceptance Criteria

- Landing no longer reads as bordered-card kit: a section exists that is
  neither a bordered box nor carries identical padding to its neighbour.
- Hero renders grain/vignette, staged load, a cream fade-out and three real
  product photos that link to `/sortiment`.
- Whole site background has a barely-visible texture; `prefers-reduced-motion`
  disables grain, page-enter and Reveal.
- `Reveal` shows content when JS is absent (no blank section).
- Icons are used only where they carry meaning; no icon appears on a product
  card, order or admin surface.
- `npm run check` green (184 unit + 24 integration), `npm run build` green,
  browser check of `/de`, `/de/sortiment`, `/de/vorbestellen` in light and
  reduced-motion states.

## Verification

Scenario: GIVEN `/de` at 1440px, WHEN the page loads, THEN the hero shows the
video under vignette, the headline lines rise top-to-bottom, three product
photos sit in the fold, and the paths tiles fade up once after the fold.

Scenario: GIVEN a browser with `prefers-reduced-motion: reduce`, WHEN `/de` is
opened, THEN no grain overlay, no rise animations, content fully visible.