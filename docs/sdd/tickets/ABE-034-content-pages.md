# ABE-034: Content pages for Kontakt, Karriere, Partner, Café

## Kontext

The owner asked for a modern site chrome and named the links it has to
carry: Impressum, Datenschutz, Kontakt, Sortiment, Partner werden, Karriere.
Three of those routes did not exist. The café also lived as the last block of
the landing page with empty photo frames, while the plan is a real café page
with its own idea and content; the photos arrive later.

Ordering note: the site chrome (ABE-035/036) links to these pages, so the
pages come first. ABE-034 therefore contains no visual change to the chrome
beyond retargeting the two links that pointed at `#cafe`.

## AC

- `/kontakt` shows address, opening hours, phone and mail, the preorder cutoff
  and the delivery area, plus a demo notice that phone and mail are
  placeholders.
- `/kafe` carries the café concept, hours, coffee/cake pairings, and a gallery
  block of three named photo slots that are explicitly marked as pending.
- `/karriere` explains the early shift and the areas, without inventing job
  postings.
- `/partner` reuses the three conversion cards (Lieferung, Brot-Abo,
  Firmenservice) as its offer.
- Contact data on the pages is not invented: address and hours come from
  `bakeryJsonLd`, phone and mail are the Impressum placeholders.
- The landing loses the café block; its "Café besuchen" path card links to
  `/kafe`, and the header/footer café link points there as well.
- The local-SEO page `/cafe-kassel` is removed and permanently redirects to
  `/kafe`, so the two do not compete for the same query.
- All four pages are prerendered, have unique metadata with "Kassel" in the
  description, and appear in the sitemap.
- `npm run check` and `npm run build` are green.

## Decisions

- Copy lives in `src/features/content/companyPages.ts` in German and renders
  unchanged per locale, exactly like the local-SEO pages. Only the chrome
  around it is localised.
- The conversion cards moved from `home.conversion*` messages to the same
  module, so `/partner` and the landing share one source of truth.
- The café page keeps the wording that already existed (`cafePairings`,
  `cafePhotoSlots`) and reworks only the framing around it.

## Out of scope

- Real photos (owner supplies them), a contact form, a job-application flow.
- The site chrome rework itself: header, footer, palette (ABE-035/036).
