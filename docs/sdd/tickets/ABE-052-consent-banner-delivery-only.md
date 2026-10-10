# ABE-052 Consent Banner Only Where the Map Is

Implements: FR-consent (ABE-023), FR-map (ABE-028).

## Goal

The map consent banner lives in the public layout, so it appeared on every
page, including pages with no third-party content. The OpenStreetMap map exists
only on `/lieferung`, so the request to load it belongs there and nowhere else.

## Acceptance Criteria

- On `/lieferung` with consent pending: the banner with `Karte laden` /
  `Ohne Karte` shows, and the map placeholder shows the hint.
- The banner does not render on any other public page.
- Granting consent loads the map (tiles requested, legend visible); denying
  leaves the placeholder and the footer revoke link.
- The map hint points to the button below instead of "oben/above/вище".

## Verification

Scenario: GIVEN a fresh visitor with no stored consent, WHEN they open `/de`,
THEN no consent banner appears; WHEN they open `/de/lieferung`, THEN the banner
appears and `Karte laden` loads the tile layer.

Checked in the browser: homepage `Karte laden` count 0; `/lieferung` banner 1,
placeholder 1; after click 18/18 tiles loaded, banner 0.
`npm run check` + `npm run build`.
