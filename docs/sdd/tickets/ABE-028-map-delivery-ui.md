# ABE-028 Map Delivery UI

Implements: FR-10, FR-23

## Goal

Add a consent-safe delivery map UI.

## Acceptance Criteria

- Map placeholder is shown before consent.
- Leaflet/OSM loads only after map consent.
- Delivery zones are visually distinguished.
- PLZ checker remains usable without the map.

## Verification

Scenario: GIVEN map consent is not granted, WHEN delivery page loads, THEN no
map tiles are requested and PLZ checker still works.

Tests: consent helper tests; browser/network check if available.
