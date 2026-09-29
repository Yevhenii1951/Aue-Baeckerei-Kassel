# Asset Notes

## Current Assets

- `public/hero-oven.mp4` — first hero loop, 1920x1080, 8s, no audio track,
  1.4 MB. The original master was 2560x1440 at 7.1 Mbit/s and 7.1 MB, which is
  wasteful for a decorative background; it was re-encoded to H.264 CRF 30.
- `public/hero-oven.jpg` — still frame from the loop at 1600px wide, 117 KB.
  Used as the video `poster` and as the reduced-motion fallback.
- `public/products/placeholder.png` — neutral fallback shown for every
  catalogue product. The 66 original `public/products/*.webp` files were
  removed on 2026-09-29. Their provenance was mixed and not fully known: 14
  carried EXIF author/copyright names (KABOOMPICS/Karolina Grabowska, sergio
  villalba studio, oktay koseoglu, AMAPOLA/Barbara Olivera, BELOUSOVA, Clara
  Moring, Igor Ogashawara), of which KABOOMPICS is a known free source
  (Pexels/Unsplash, kaboompics.com) while two stated an express reservation
  ("Copyright ... All rights reserved" and the Turkish equivalent); the other 52
  had no metadata. No reliable per-file licence was recorded for the set, so it
  was dropped whole. Source the product photos afresh before any public or
  client use; `demoProducts.ts` and `companyPages.ts` point at the placeholder
  until then.
- `public/cafe/*.webp` — 3 café photos supplied by the project owner on
  2026-09-29 (`Fensterplatz.jpg`, `Fensterplatz2.jpg`, `Backstubenblick.jpg` in
  `~/Downloads/`). All three were 1920x1280 JPEG without EXIF or GPS and are
  served as 1200x800 WebP quality 80: 75 KB, 46 KB, 35 KB. They fill the
  gallery on `/kafe`; the second file is a second window-seat shot, so the
  "Kuchenvitrine" slot from ABE-034 is gone. Alt texts follow the file names and
  are to be confirmed by the owner against the real photos.
- `public/cafe/hero.webp` — the café hero, supplied by the project owner on
  2026-09-29 as `Cafe hero section.jpg` (1920x1278, no EXIF). Served as
  1600x1065 WebP quality 78, 69 KB, drawn at 60% opacity under a paper-to-cream
  gradient. The alt text is a neutral guess and needs the owner's eyes.
- The "Passt dazu" section reuses the product placeholder for the drink and the
  cake of each pairing, so it added no new files.
- `src/features/shell/BrandIcon.tsx` — the Instagram and Facebook glyphs in the
  footer, inlined as SVG paths from the Simple Icons set
  (simpleicons.org, CC0-1.0, fetched from the jsDelivr copy of `simple-icons@11`).
  The glyphs stay the property of their owners and are only used to link to the
  bakery's own profiles; the hrefs are still `#` placeholders.

## Provenance

Hero files and the café photos were supplied by the project owner for this
portfolio build. The 66 product photos were removed on 2026-09-29 because no
per-file licence was recorded for them and two carried an express reservation
of rights (see above). The catalogue now shows `placeholder.png` and the product
photos are to be sourced afresh. The four café photos are owner-supplied
interior shots with no third-party metadata; still record them here before any
commercial or public client use:

- Source: _café photos owner-supplied; product photos removed, to be re-sourced_
- Licence: _not yet recorded_
- Photographer / rights holder: _not yet recorded_

The Impressum carries a matching note so the portfolio context is visible to
visitors. That note points here for the records; it does not assert a licence.

## Before Public Commercial Use

- Add real product and cafe photography, or owned placeholders with recorded
  licences. The product catalogue currently shows `placeholder.png` for all 66
  products; the café gallery ships with 4 owner-supplied interior photos and
  still lacks recorded sources.
- Record source, license, photographer, and allowed usage for every asset.
- Do not enable Google Reviews, Instagram, maps, analytics, or tracking embeds
  without consent handling and Datenschutz updates.
