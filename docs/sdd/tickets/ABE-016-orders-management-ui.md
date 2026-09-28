# ABE-016 Orders Management UI

Implements: FR-7

## Goal

Add an admin orders list with operational status handling.

## Acceptance Criteria

- Admin can view demo orders by date, status, and fulfillment type.
- Status path is visible: neu -> in Zubereitung -> fertig -> abgeholt/geliefert.
- Order detail drawer/page shows customer, items, slot, total, and notes.
- Cancellation/refund stays a mock action with clear label.

## Verification

Scenario: GIVEN admin filters orders by tomorrow and pickup, WHEN results load,
THEN only matching orders are shown.

Tests: unit tests for admin order filtering.
