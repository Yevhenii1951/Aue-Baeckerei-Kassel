# ABE-046 — Real product photos for the catalogue

## Problem

Since the earlier photo set was dropped in `2806e9f` and `6636e58` the whole
catalogue had shown one neutral `placeholder.png`: 66 product cards, 8 category
galleries and 8 "Passt dazu" pairings all pointed at the same dashed tile.
Nothing on `/sortiment` looked like food.

The owner then supplied 69 JPEG in `~/Downloads/` and confirmed these are the
new product photos, with instructions to remove what was there before.

## Change

- 51 of the 69 photos are shipped in `public/products/`, all re-encoded to
  1200x900 WebP quality 80 (3.3 MB), matching the `4:3` frame
  `ProductGridCard` already reserved. The originals stay in `~/Downloads/`.
  The 18 unused ones stay out of the repository.
- `PRODUCT_IMAGES` in `demoProducts.ts`: a `Record<string, string>` that the
  `product()` helper reads, so all 66 products get an image from one lookup
  table instead of 66 rewritten call sites.
- The 8 "Passt dazu" images in `companyPages.ts` now point at the photo of the
  drink and cake of their own pairing.
- `public/products/placeholder.png` is deleted. Every product has a photo, so
  the fallback branch was dead weight.

## Assignment

Exact match where the set had one. Four products have no photo of their own and
reuse a related one: `zimtschnecke` and `apfel-mandel-schnecke` (streusel
cake), `mango-lassi` (caramel macchiato), `earl-grey` (chai latte). The 13
bread products share 3 photos, as the owner asked for a random fallback where
the set had nothing better, so one bread photo repeats on several cards.

## Verified

`npm run check` green, `npm run build` green. The existing test
"gives every catalogue product an image that exists in public assets" now
covers the new set, and the JSON-LD test asserts against `product.imageUrl`
instead of a hardcoded file so it tests the transformation rather than the data.

## Notes

Provenance is recorded in `docs/sdd/assets.md` and is **not** clean. The owner
declared all 69 files to be free Pexels downloads, but no per-file URL came with
them, and three originals carry an express reservation of rights in their EXIF
— two of them (`snacks-deli-1`, `snacks-deli-4`) are in the shipped set. The
exporter strips metadata, so the repository does not show it. This is fine for
a portfolio build; it blocks public or client use until each file is traced to a
Pexels page.

46 of the 69 sources were portrait and were centre-cropped to `4:3`, which
crops up to 58% of their height. Nobody has compared the renders against the
real subjects — the owner should, since I cannot look at the images.
