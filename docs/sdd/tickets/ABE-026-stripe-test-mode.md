# ABE-026 Stripe Test Mode

Implements: FR-13

## Goal

Add optional Stripe test-mode checkout behind the payments feature group.

## Acceptance Criteria

- Payments group remains off by default.
- Stripe keys are server-only.
- Checkout session uses server-calculated totals.
- Success/cancel routes are handled.
- Demo can still run without Stripe.

## Verification

Scenario: GIVEN payments are enabled with test keys, WHEN checkout starts, THEN
a Stripe test checkout session is created with correct line totals.

Tests: server action tests with mocked Stripe client.
