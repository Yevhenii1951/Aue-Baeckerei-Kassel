# ABE-013 Delivery Zone Checker

Implements: FR-10

## Goal

Add a customer-facing delivery zone checker for Kassel.

## Acceptance Criteria

- `/lieferung` explains Zone 1, Zone 2, and Zone 3.
- PLZ input maps demo postal codes to delivery zones.
- Delivery fee and free-delivery threshold are displayed.
- Unknown PLZ gives a clear unavailable/service message.
- Checkout can switch between pickup and delivery.

## Verification

Scenario: GIVEN a customer enters a Kassel PLZ, WHEN the zone is checked, THEN
fee and free threshold are shown.

Tests: unit tests for PLZ-to-zone and fee calculation.
