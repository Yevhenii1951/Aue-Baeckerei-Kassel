# ABE-001 Foundation Landing

Implements: FR-1, FR-8, NFR-1, NFR-2, NFR-3, NFR-4, NFR-5

## Goal

Rename the copied base and replace the placeholder public home page with the
first Aue-Baeckerei landing page using the provided hero video.

## Acceptance Criteria

- Project metadata and shell brand no longer say `kalyna-base` or
  `Projektname`.
- Home page has video hero, preorder CTA, assortment CTA, cutoff status, three
  path choices, bestseller preview, cafe teaser, and trust/legal-safe footer.
- Public navigation includes Start, Sortiment, Vorbestellen, Cafe, and legal
  links where appropriate.
- Reduced-motion users still get a usable hero without animation dependency.

## Verification

Scenario: GIVEN a visitor opens `/de`, WHEN the page loads, THEN the first
viewport clearly shows Aue-Baeckerei, the preorder promise, and the 20:00 cutoff
CTA.

Checks: `npm run typecheck`, `npm run lint`, and `npm run build`.
