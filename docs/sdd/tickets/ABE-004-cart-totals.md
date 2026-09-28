# ABE-004 Cart Totals

Implements: FR-6, FR-9

## Goal

Add cart state and shared total calculation in integer cents.

## Verification

Scenario: GIVEN a cart with bread and coffee, WHEN quantities change, THEN line
totals and order total are recalculated without floating point drift.

Tests: unit tests for totals, quantity updates, and bundle discount rules.
