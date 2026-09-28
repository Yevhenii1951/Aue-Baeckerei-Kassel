# ABE-017 Backliste UI

Implements: FR-7

## Goal

Expose the existing Backliste aggregation as an admin UI.

## Acceptance Criteria

- Admin can choose production date.
- Product totals are shown in descending quantity.
- Product x slot matrix is visible.
- Print-friendly layout exists.
- CSV export can be mocked or generated client-side.

## Verification

Scenario: GIVEN tomorrow has demo orders, WHEN admin opens Backliste, THEN
product totals and slot matrix match the aggregate.

Tests: existing aggregation tests plus UI smoke if practical.
