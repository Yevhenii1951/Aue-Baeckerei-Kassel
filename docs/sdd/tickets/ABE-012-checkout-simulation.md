# ABE-012 Checkout Simulation

Implements: FR-6

## Goal

Create a demo checkout that feels complete without connecting real payment
providers.

## Acceptance Criteria

- Checkout step validates customer data and selected fulfillment option.
- Payment method choices exist: Stripe card, PayPal, Klarna, Bar/EC, Rechnung.
- No real payment API is called.
- Confirmation creates a demo order number like `B-2026-0001`.
- Confirmation page shows pickup/delivery summary and QR placeholder.

## Verification

Scenario: GIVEN a valid cart and customer data, WHEN checkout is confirmed,
THEN a confirmation page with order number and summary is shown.

Tests: unit tests for order number generation and checkout validation.
