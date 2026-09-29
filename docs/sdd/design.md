# Design Direction

Subject confirmed with the owner 2026-09-29: the landing felt like a default
Tailwind card assembly; goal is a distinctive craft-bakery landing. Direction
chosen: editorial typography + cinematic hero + disciplined rhythm, subtle
whole-site grain, one orchestrated load moment, small answer-the-action
motions, a light icon set. Boldness lives in one place — the hero; everything
after stays quiet.

## Visual Idea

The memorable element is the oven video: a dark, cinematic first viewport with
real heat, steam, hands, and crust. The page opens on that moment and does not
compete with itself afterwards: the headline is typeset in a warm editorial
serif, three real product photographs peek above the fold as a promise of the
shop, and every later section stays calm, operational and legible: clear tabs,
generous product photography, exact prices, allergen badges, and a visible
order deadline.

Avoid a generic beige bakery page. Use warmth, but pair it with baker's
graphite, fermented amber, flour-white surfaces, and a small note of
copper/green from Kassel parks and cafe plants. A barely-there grain across
the whole site keeps the surfaces from looking flat without shouting.

## Palette

- Oven black: `#17120E` for hero overlays, navigation, and strong text.
- Crust brown: `#7A3F22` for primary brand actions and selected states.
- Ferment amber: `#D79A43` for freshness, cutoff, and small highlights.
- Flour paper: `#FFF9EF` for page background and product surfaces.
- Rye grey: `#D8CEC0` for borders, muted panels, and disabled states.
- Aue green: `#315C45` for local/sustainable/cafe accents.

Token names in `src/app/globals.css` follow the bakery, not the raw colour,
so JSX reads `bg-amber` and `text-brand-deep` rather than a colour word:

| Token | Role |
| --- | --- |
| `--color-brand` | crust brown, primary action |
| `--color-brand-dark` | crust brown, hover/secondary action |
| `--color-brand-deep` | oven black, dark surfaces and strong text |
| `--color-amber` | ferment amber, freshness, cutoff, price |
| `--color-amber-soft` | amber tint for badges |
| `--color-cream` | flour paper, light page surface |
| `--color-paper` | card surface, one step lighter than cream |
| `--color-sage` | Aue green, local and cafe accents |
| `--color-ink` | body text |

The palette does not change as part of this refresh — it is already
distinctive (cream + crust-brown + amber + sage is not the generic
cream/terracotta default). Every token must keep at least one use. A colour
that no component references does not belong in the theme; add it in the same
commit as its first use. Component classes are `.surface`, `.panel`,
`.btn-amber`, `.btn-ghost-dark` and `.nav-link`. JSX uses token classes, never
hardcoded brand colours.

The whole-site background texture is not a colour token: it is a fixed grain
overlay (see Motion). It must not creep into behaviour, focus states, or
reduced-motion.

## Typography

- Sans: keep Manrope for shop, admin, filters, prices, forms, and all
  operational text.
- Display: switch the display slot from Cormorant Garamond to
  **Fraunces** via `next/font/google` (keep `--font-display` as the variable;
  drop the Cormorant import). Fraunces reads warm, characterful and bakery-
  specific at large sizes where Cormorant reads thin and template-y. Use its
  `opsz`/weight range: heavier at hero (600–700), lighter in section lead-ins.
- Editorial ledes (the sentence under a heading) may be Fraunces italic at
  a slightly larger size; never italic/bold a single word inside a headline —
  accents must not be inline highlights.
- No all-caps decorative labels. Eyebrows stay sentence case with restrained
  tracking (`Morgens frisch, abends bestellt.`).
- Product cards use compact Manrope headings, visible price, and ingredient
  text kept below 80 characters per line. Display line lengths stay short
  (~55–65 characters); keep generous line-height on serif text.

## Layout

Public pages are mobile-first, left-aligned, and built for fast choices.

Page rhythm (replaces same-padding repeated bands):

```text
┌ hero: oven video + grain + vignette ─┐
│ nav over video, cream fade at bottom │
│ Fraunces H1 (lines rise in, staged)  │
│ [Vorbestellen] [Sortiment ansehen]   │
│ cutoff pill · 3 product thumbs rise  │
└──────────────────────────────────────┘
\  cream band: paths (3 tiles, single reveal)   /
\  paper band: steps (numbered — real sequence) /
\  cream band: assortment + bestsellers          /
\  ink band: conversion (café tone)              /
\  cream band: cafe + hours + trust              /
```

- Sections are full-width bands alternating `cream` and `paper`, not identical
  bordered boxes stacked with the same padding everywhere.
- Decorative cards change: only surfaces that hold a distinct unit of content
  keep a border; headings + hairline dividers carry the structure. No nested
  cards. Radius stays ≤8px, reserved for interactive/photographic surfaces.
- The `border-brand-deep/10 bg-paper rounded-lg` default card is a smell:
  use it when a box is genuinely a distinct unit, not as the page's rhythm.
- Hero miniatures: three real product photos (`/products/<id>.webp`) tucked
  into the bottom of the hero fold — a promise of the shop, linking to
  `/sortiment`. This fulfils the old "hint of product tabs below fold" note.

## Components

- Sticky mobile bottom action: `Jetzt vorbestellen`.
- Cutoff countdown: persistent small status module, never a modal.
- Product cards: photo, title, short description, price, tags, allergens, two
  actions where relevant (`In den Warenkorb`, `Vorbestellen`). Photo scales
  1.03 on hover — image is the rich moment, the card stays real.
- Paths/steps tiles: icon (lucide) + heading + one line + CTA arrow that
  slides on hover for the paths; the steps block keeps its numbered markers
  because it is a real ordered process.
- Icons: `lucide-react`, used only where an icon carries information — opening
  hours (Clock), order/pickup (Store), delivery PLZ (MapPin), local (Leaf),
  oven/fresh (Flame). Drop-in, tree-shaken, no icon bundle.
- Cafe tab/page: coffee, pastry, seating, and a future photo gallery.
- Slot picker: 30-minute pickup slots with capacity state.
- Delivery zone checker: PLZ input first, map later behind consent.
- Admin backliste: unchanged by this refresh.

## Image Direction

The hero loop is `public/hero-oven.mp4` with `public/hero-oven.jpg` as its
poster. `prefers-reduced-motion` swaps the video for the still.

66 real product photos exist at `/products/<id>.webp` and are already wired to
catalogue cards and detail pages. The landing hero reuses three of them as
miniatures; the assortment section may reuse `CatalogPreview`. No new imagery
is invented; the photo provenance rules in `docs/sdd/assets.md` still apply.

## Motion

- **Grain.** A fixed, barely-visible grain overlay across the whole site
  (single overhead `body::before` with a tiny inline SVG `feTurbulence`
  texture, pointer-events none, opacity ~0.04, multiplied on `cream`/`paper`).
  On the hero the same idea goes stronger as vignette + noise so the video
  layer has body instead of reading as a flat gradient.
- **Page enter.** One global CSS mount animation on route change
  (`fade + 10px rise`, ~300–350ms) applied to the routed `<main>`. Because
  Next.js remounts the page per navigation, no JS is needed; it never hides
  content if animations are disabled.
- **Hero load sequence.** A single orchestrated moment: eyebrow → headline
  lines → CTA → bottom strip/thumbnails, each fading up with a small delay
  (CSS keyframes, not a library). No other section gets a scroll reveal by
  default.
- **One reveal.** A single `Reveal` component (IntersectionObserver, fade +
  16px) is reserved for the first content moment after the fold — the three
  path tiles. It is the exception, not the rule. A CIS fallback must render
  the content visible if the observer or JS is missing; `prefers-reduced-motion`
  disables it entirely.
- **Answer-the-action.** Hover/active transitions that show what changed:
  photo scale on product cards, CTA arrow slide, step-tile number shift,
  nav underline. No scroll-jacking, no marquees, no custom cursors.
- No Framer Motion. No scroll-reveal animation belongs on every section —
  scattered fade-and-slide is the generated look this refresh is removing.

## Copy Voice

German is canonical. The voice is warm but direct, unchanged:

- `Morgens frisch, abends bestellt.`
- `Bis 20:00 bestellen, morgen abholen.`
- `Gerade frisch aus dem Ofen.`
- `Passt gut dazu.`
- `Brotzeit fuer das Buero anfragen.`

Avoid exaggerated luxury language. The bakery feels premium because the
details are concrete: local flour, long dough rest, sourdough, pickup slots,
clear allergen information.

## Self-Critique

Template risk this refresh guards against:

- Fraunces + warm cream + amber can read as "artisan bistro" — the
  counterweights are the dark oven-video first viewport, the operational
  Manrope chrome, sentence-case voices, and the tension of the ink
  conversion band.
- A whole-site grain layer can look like a filter — so it stays barely
  visible (~4%) and is disabled under `prefers-reduced-motion`.
- Icons can soften a shop into decoration — so they are used only where they
  carry information, and the paths tiles keep a restrained, editorial tone.
- The old trap was every block as a bordered card; the new one is rustic
  over-grain and italic everywhere. Keep 80% Manrope / clean structure and
  spend serif and motion only in the hero and section lead-ins.