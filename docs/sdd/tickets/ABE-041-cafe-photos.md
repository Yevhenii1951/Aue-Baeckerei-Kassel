# ABE-041: Café photos on /kafe

## Kontext

The café page shipped with three dashed placeholder tiles. The owner supplied
three interior photos on 2026-09-29.

## AC

- `public/cafe/*.webp` holds the three photos, 1200x800 WebP quality 80, no
  EXIF or GPS carried over from the JPEGs.
- The gallery renders real `next/image` figures with alt text, captions kept
  from the ABE-034 copy, 3:2 aspect ratio, three columns from `sm` up and one
  column on phones.
- `photoSlots` now requires `image` and `alt`, so no dashed placeholder branch
  is left in `CompanyPage`.
- The page no longer claims the photos are still missing (notice + gallery
  intro).
- `docs/sdd/assets.md` records sizes, source and the open rights question.
- `npm run check` and `npm run build` are green.

## Open with the owner

- The second file is `Fensterplatz2.jpg`, i.e. a second window-seat shot, so
  the old "Kuchenvitrine" slot was renamed to "Fensterplatz II". A vitrine
  photo is still missing.
- Alt texts and the "Fensterplatz II" caption were derived from the file names
  and need the owner's eyes on the real photos.
- Sources and licences for all three photos are not recorded yet, like the
  product photos.
