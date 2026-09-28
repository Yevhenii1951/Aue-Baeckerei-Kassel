# ABE-020 Demo Seed

Implements: FR-2, FR-7

## Goal

Seed a rich demo environment for sales presentations.

## Acceptance Criteria

- Seed inserts full catalogue.
- Seed inserts delivery zones.
- Seed inserts pickup slots and demo orders.
- Admin dashboard and Backliste have useful data immediately.
- Seed is safe for local/demo database only.

## Verification

Scenario: GIVEN a fresh local DB, WHEN seed runs, THEN public catalogue and
admin demo views are populated.

Tests: seed smoke/integration test where practical.
