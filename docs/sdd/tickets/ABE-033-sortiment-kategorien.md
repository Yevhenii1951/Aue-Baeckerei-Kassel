# ABE-033: Sortiment section -> category cards

## Kontext

The landing-section "Sortiment fur Fruhstuck, Pause und
Buro" currently embeds the full catalogue preview (`CatalogPreview`) plus
bestseller chips. It duplicates the whole shop on the start page. It should
become one simple section with category cards (photo + label), each linking to
its own category page.

## AC

- Homepage: the sortiment section shows exactly one grid of 6 category cards.
- Each card has a representative photo, the category label and a product count.
- Each card links to `/sortiment/kategorie/<category>`.
- The category page renders the shop with that category preselected and its own
  title/metadata.
- Unknown category slug -> 404.
- `CatalogPreview` is removed (now unused); the `home.bestsellers*` messages
  are removed from all locales.
- `npm run check` and `npm run build` are green.

## Out of scope

- Changing the shop (`/sortiment`) behaviour itself.
- Filter-by-URL support; the categories come from `PRODUCT_CATEGORIES`.