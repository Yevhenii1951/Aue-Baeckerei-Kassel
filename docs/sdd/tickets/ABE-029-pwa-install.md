# ABE-029 PWA Install

Implements: FR-14

## Goal

Make the shop installable as a lightweight PWA demo.

## Acceptance Criteria

- Web app manifest exists.
- App icons are present.
- Offline fallback is conservative and does not fake order creation.
- Add-to-home-screen metadata is present.

## Verification

Scenario: GIVEN the site is opened in a supported browser, WHEN install criteria
are checked, THEN the app is installable for demo use.

Tests: manifest smoke test.
