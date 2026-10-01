# Asset Notes

## Current Assets

- `public/hero-oven.mp4` — first hero loop, 1920x1080, 8s, no audio track,
  1.4 MB. The original master was 2560x1440 at 7.1 Mbit/s and 7.1 MB, which is
  wasteful for a decorative background; it was re-encoded to H.264 CRF 30.
- `public/hero-oven.jpg` — still frame from the loop at 1600px wide, 117 KB.
  Used as the video `poster` and as the reduced-motion fallback.
- `public/products/*.webp` — 51 product photos, all served as 1200x900 WebP
  quality 80 (3.3 MB in total), added on 2026-10-01. They come from a set of 69
  JPEG the project owner supplied in `~/Downloads/` and declared to be free
  Pexels downloads. No per-file source URL was recorded (see Provenance).
  `PRODUCT_IMAGES` in `demoProducts.ts` maps all 66 catalogue products onto
  these 51 files; 18 supplied photos are unused and stay out of the repository.
  Four products have no photo of their own and reuse a related one: `zimtschnecke`
  and `apfel-mandel-schnecke` (streusel cake), `mango-lassi` (caramel
  macchiato), `earl-grey` (chai latte). The 13 bread products share only 3
  photos, so each bread photo renders on several cards. 46 of the 69 sources
  were portrait and were centre-cropped to 4:3, which crops up to 58% of their
  height; nobody has compared the results against the real subjects.
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
- The "Passt dazu" section reuses the product photo of the drink and the cake
  of each pairing, so it added no new files. Four of the eight pairings point at
  a substitute photo for the same reason as the catalogue.
- `src/features/shell/BrandIcon.tsx` — the Instagram and Facebook glyphs in the
  footer, inlined as SVG paths from the Simple Icons set
  (simpleicons.org, CC0-1.0, fetched from the jsDelivr copy of `simple-icons@11`).
  The glyphs stay the property of their owners and are only used to link to the
  bakery's own profiles; the hrefs are still `#` placeholders.

## Provenance

Hero files and the café photos were supplied by the project owner for this
portfolio build. The four café photos are owner-supplied interior shots with no
third-party metadata; still record them here before any commercial or public
client use:

- Source: _café photos owner-supplied_
- Licence: _not yet recorded_
- Photographer / rights holder: _not yet recorded_

### Product photos

The owner supplied 69 JPEG in `~/Downloads/` on 2026-10-01 and stated that all
of them are free downloads from Pexels. The Pexels licence permits commercial
use without attribution, so on that statement the shipped photos are usable.
Two things stop this from being a verified record:

- **No per-file URL.** The licence claim is owner-declared. A Pexels page URL is
  what ties an individual file to that licence, and none was supplied.
- **Three files contradict the claim outright.** EXIF in the originals states
  an express reservation of rights — `feinkost-knabbermix-1` ("SOBSTVENOST
  Seregiy"), `snacks-deli-1` ("Copyright 2016. All right reserved.") and
  `snacks-deli-4` ("Telif Hakkı 2025. Tüm hakları saklıdır."). Two of the three
  are in the shipped set: `snacks-deli-1` renders as `classique-frikadelle` and
  `snacks-deli-4` as `classique-tomate-ei`. The exporter stripped all metadata,
  so nothing in `public/products/` reveals this.

All 69 originals carry an EXIF block, and none of them carries GPS. 17 name an
author or a copyright string; 14 of those 17 are in the shipped set. Two are the
reservations named above. The other 12 want a recorded credit even though Pexels
asks for none: `feinkost-geschenkkorb-1` (bondarev nick), `feinkost-geschenkkorb-3`
(Varzhen Gennadiy), `getraenke-caramel-macchiato-1` (DTuncer),
`getraenke-caramel-macchiato-2` (jay chan), `snacks-deli-7` (YAW),
`suess-brownie-3` and `-4` (studioheaven), `suess-brownie-5` (Jonathan Lapada),
`suess-kaesekuchen-3` (Lusia), `suess-streuselkuchen-7` (Nadine Ginzel),
`broetchen-laugenstange-1` (Baran Robin) and `broetchen-laugenstange-5` (Taiss
A&S). The three marked originals left out of the repository are
`feinkost-knabbermix-1` (the third reservation), `suess-brownie-6` and
`suess-streuselkuchen-8`.

No shipped file carries EXIF, IPTC, XMP or GPS. Every raster asset in
`public/` went through a metadata-stripping encoder, and the café photos arrived
without metadata, so the repository itself shows none of the above. The names
above survive only because they were transcribed here.

- Source: _owner-declared Pexels; per-file URLs missing_
- Licence: _Pexels License (free commercial use, no attribution), unverified_
- Photographer / rights holder: _not recorded_

For reference, an earlier set of 66 product photos was removed on 2026-09-29
because no per-file licence was recorded for it and two of its files carried the
same kind of express reservation.

The Impressum carries a matching note so the portfolio context is visible to
visitors. That note points here for the records; it does not assert a licence.

## Before Public Commercial Use

- Record the Pexels source URL for each shipped product photo. Two shipped
  files carry an express reservation of rights in their original EXIF and must
  be re-shot or traced to a Pexels page before any public or client use.
- Check the centre-cropped 4:3 renders against the real subjects; 46 of the 69
  sources were portrait.
- Consider shooting the 13 bread products: they share 3 photos, so the same
  image repeats several times in the grid.
- Record source, licence, photographer, and allowed usage for the four café
  photos, which ship without any recorded licence.
- Do not enable Google Reviews, Instagram, maps, analytics, or tracking embeds
  without consent handling and Datenschutz updates.
