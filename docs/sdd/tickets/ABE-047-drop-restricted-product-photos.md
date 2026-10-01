# ABE-047 — Drop the two shipped product photos with a rights reservation

## Problem

ABE-046 shipped 51 product photos and recorded in `docs/sdd/assets.md` that two
of them contradict the owner's blanket "all free Pexels" claim. Their original
EXIF states an express reservation of rights:

- `snacks-deli-1` — "Copyright 2016. All right reserved."
- `snacks-deli-4` — "Telif Hakkı 2025. Tüm hakları saklıdır."

The owner reviewed the list and asked for both to be replaced. A third marked
file, `feinkost-knabbermix-1` ("SOBSTVENOST Seregiy"), was never picked in
ABE-046 and never reached the repository, so this ticket only had to move two
products.

The catch: the set contains exactly 8 `deli sandwich baguette` photos for 10
snack products, and ABE-046 already used all 8. There was no clean ninth and
tenth, so the two products had to land on photos that are already in use.

## Change

`classique-frikadelle` and `classique-tomate-ei` moved off `snacks-deli-1` and
`snacks-deli-4`, and four other snack products moved with them so the remaining
six photos carry the load evenly:

| photo | products |
|---|---|
| `snacks-deli-2` | `schlemmertasche`, `classique-tomate-ei` |
| `snacks-deli-3` | `laugenkorn-schinken-kaese`, `brotzeit-omelett` |
| `snacks-deli-5` | `avocado-bagel`, `classique-frikadelle` |
| `snacks-deli-6` | `dinkel-plus-kaese`, `classique-pute` |
| `snacks-deli-7` | `wikinger-pute` |
| `snacks-deli-8` | `baeckwich-florida` |

That is 10 products on 6 photos, 2-2-2-2-1-1, which is the best spread the set
allows. `public/products/snacks-deli-1.webp` and
`public/products/snacks-deli-4.webp` are deleted. The shipped set is 49 photos.

All 8 photos are the same subject — deli sandwiches in baguettes — so the
reassignment costs nothing semantically.

## Verified

`npm run check` green, `npm run build` green. Browser on `/de/sortiment` and
`/de/sortiment/kategorie/snacks`: 66/66 images load, no request for a deleted
file. No shipped file contradicts the owner's licence claim any more.

## Notes

The trade-off is repetition: four snack photos now render twice instead of once.
That is worse for the grid and better for the licence position. The owner
chose the licence position; the ticket records the cost so it is not a
surprise later.

Removing the two files does not make the provenance verified. It removes the
one piece of evidence that contradicted the owner. The remaining gap is
unchanged: no per-file Pexels URL was ever supplied, so the claim is still
owner-asserted and still unverified.

The metadata is gone from disk either way — the exporter strips EXIF, so nothing
in `public/products/` would ever have shown that these two were deliberately
excluded. `docs/sdd/assets.md` is the only place that records it.