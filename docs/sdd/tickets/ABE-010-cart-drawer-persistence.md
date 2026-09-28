# ABE-010 Cart Drawer Persistence

Implements: FR-6, FR-9

## Goal

Turn the local cart summary into a persistent customer cart that works across
catalogue and ordering pages.

## Acceptance Criteria

- Cart state persists in `localStorage`.
- A cart drawer opens from the header/shop CTA.
- Customers can increase, decrease, and remove items.
- Cart totals, breakfast bundle discount, and empty state are visible.
- Drawer has a clear CTA to `/vorbestellen`.

## Verification

Scenario: GIVEN a visitor adds products on `/de/sortiment`, WHEN they reload
the page, THEN the cart still contains the products and totals are correct.

Tests: unit tests for cart storage parsing and fallback behavior.
