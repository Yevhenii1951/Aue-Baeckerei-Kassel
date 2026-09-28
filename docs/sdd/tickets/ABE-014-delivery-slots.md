# ABE-014 Delivery Slots

Implements: FR-10

## Goal

Add delivery scheduling on top of the delivery zone checker.

## Acceptance Criteria

- Delivery uses 2-hour slots.
- Express delivery option appears when zone and time allow it.
- Delivery fee updates order summary.
- Delivery notes field is available.
- Delivery selection survives navigation until checkout.

## Verification

Scenario: GIVEN a customer chooses delivery, WHEN a slot and express option are
selected, THEN checkout summary includes delivery time and fee.

Tests: unit tests for delivery slot availability and fee totals.
