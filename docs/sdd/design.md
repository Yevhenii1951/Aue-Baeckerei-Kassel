# Design Direction

## Subject

Aue-Baeckerei is a premium craft bakery near Karlsaue and Bebelplatz in Kassel.
The site sells the feeling of warm bread in the morning, but the product is
also a digital ordering system: evening preorders, pickup slots, delivery,
subscriptions, catering, and an owner-facing baking dashboard.

Primary audience: people in Kassel who want reliable fresh bread, breakfast,
coffee, office catering, or a weekly bread subscription.

Primary job: make ordering feel simpler than calling the bakery, while keeping
the brand handmade and local.

## Visual Idea

The memorable element is the oven video: a dark, cinematic first viewport with
real heat, steam, hands, and crust. Everything after that becomes calmer and
more operational: clear tabs, generous product photography, exact prices,
allergen badges, and a visible order deadline.

Avoid a generic beige bakery page. Use warmth, but pair it with baker's graphite,
fermented amber, flour-white surfaces, and a small note of copper/green from
Kassel parks and cafe plants.

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

Every token must have at least one use. A colour that no component references
does not belong in the theme; add it in the same commit as its first use.
Component classes are `.surface`, `.panel`, `.btn-amber`, `.btn-ghost-dark`
and `.nav-link`. JSX uses token classes, never hardcoded brand colours.

## Typography

- Sans: keep the existing Manrope-style UI rhythm for shop, admin, filters,
  prices, and forms.
- Display: use the existing serif display slot for hero and editorial headings,
  but with restrained weight and short lines.
- Product cards use compact sans headings, visible price, and ingredient text
  kept below 80 characters per line.
- Avoid all-caps decorative labels. Use sentence case.

## Layout

Public pages are mobile-first, left-aligned, and built for fast choices.

Hero:

```text
┌────────────────────────────────────────┐
│ video full bleed                       │
│ nav over video                         │
│                                        │
│ Morgens frisch, abends bestellt.       │
│ [Vorbestellen] [Sortiment ansehen]     │
│ cutoff pill: Bestellschluss 20:00      │
│                                        │
│ hint of product tabs below fold        │
└────────────────────────────────────────┘
```

Catalogue:

```text
┌ filters / search / tabs ───────────────┐
│ Brote | Broetchen | Suesses | Kaffee   │
├─────────────┬─────────────┬────────────┤
│ product     │ product     │ product    │
│ image       │ image       │ image      │
│ price/actions/allergens                │
└────────────────────────────────────────┘
```

Ordering:

```text
┌ product list ─────────────┬ cart/order ┐
│ day selector              │ cutoff     │
│ pickup slots              │ totals     │
│ recommendations           │ checkout   │
└───────────────────────────┴────────────┘
```

Admin:

```text
┌ KPI strip ─────────────────────────────┐
├ orders feed ────────┬ backliste matrix ┤
├ inventory alerts ───┴ analytics        ┤
└────────────────────────────────────────┘
```

Cards stay simple with radius at 8px or less. No nested cards. Page sections are
full-width bands or unframed constrained layouts.

## Components

- Sticky mobile bottom action: `Jetzt vorbestellen`.
- Cutoff countdown: persistent small status module, never a modal.
- Product cards: image, title, short description, price, tags, allergens, two
  actions where relevant: `In den Warenkorb` and `Vorbestellen`.
- Product tabs: Brote, Broetchen, Suesses, Getraenke, Snacks, Feinkost.
- Cafe tab/page: coffee, pastry, seating, and a future photo gallery.
- Slot picker: 30-minute pickup slots with capacity state.
- Delivery zone checker: PLZ input first, map later behind consent.
- Admin backliste: product totals plus product x slot matrix.

## Image Direction

The hero loop is `public/hero-oven.mp4` with `public/hero-oven.jpg` as its
poster frame. `prefers-reduced-motion` swaps the video for the still, so the
first viewport never depends on motion.

Product cards currently render no photograph. Product imagery is a known gap
and is not covered by an existing ticket — see `docs/sdd/state.md`. Until owned
photos exist, a product card is text, price, allergens and actions only.

Long-term asset plan: replace placeholders with owned bakery photos before any
commercial or public client use.

## Motion

- Hero video autoplay muted loop, with readable overlay.
- `prefers-reduced-motion` gets the poster frame instead of the loop.
- No Framer Motion. No scroll-reveal animation exists; if one is added it
  needs its own IntersectionObserver hook, because a bare CSS class that hides
  content until a script reveals it will hide it forever if the script is
  missing.

## Copy Voice

German is canonical. The voice is warm but direct:

- `Morgens frisch, abends bestellt.`
- `Bis 20:00 bestellen, morgen abholen.`
- `Gerade frisch aus dem Ofen.`
- `Passt gut dazu.`
- `Brotzeit fuer das Buero anfragen.`

Avoid exaggerated luxury language. The bakery feels premium because the details
are concrete: local flour, long dough rest, sourdough, pickup slots, clear
allergen information.

## Self-Critique

Potential generic risk: warm cream plus brown can become a default bakery
template. The counterweight is the dark oven-video first viewport, operational
shop structure, visible cutoff logic, and restrained cafe/local green accent.

Potential scope risk: the brief contains enough features for a production
platform. Phase 1 must prove the core portfolio story: landing, catalogue,
preorder logic, cart, and baking-list admin.
