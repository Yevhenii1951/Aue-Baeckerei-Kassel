# ABE-019 Order Server Actions

Implements: FR-4, FR-5, FR-6

## Goal

Move order creation from demo-only client flow to server-validated persistence.

## Acceptance Criteria

- Server action validates cart, customer data, fulfillment, and payment mock.
- Server recalculates prices and totals.
- Server checks slot capacity before creating order.
- Order and order items persist in Postgres.
- Clear error messages for invalid cart, full slot, and unavailable product.

## Verification

Scenario: GIVEN a cart targets a full pickup slot, WHEN order creation runs,
THEN the server rejects it without creating partial records.

Tests: integration tests for create-order success and full-slot rejection.
