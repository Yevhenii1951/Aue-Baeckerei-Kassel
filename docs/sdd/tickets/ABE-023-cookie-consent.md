# ABE-023 Cookie Consent

Implements: NFR-5, NFR-6

## Goal

Add consent handling for optional embeds and tracking-like features.

## Acceptance Criteria

- Technically necessary mode is default.
- Optional maps/reviews/social embeds are blocked until consent.
- Consent state is stored locally.
- Datenschutz copy documents the categories.
- No external embed loads before consent.

## Verification

Scenario: GIVEN a fresh visitor, WHEN the page loads, THEN no optional third
party embed is requested before consent.

Tests: unit tests for consent state helper.
