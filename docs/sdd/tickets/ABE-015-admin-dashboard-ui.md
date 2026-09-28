# ABE-015 Admin Dashboard UI

Implements: FR-7

## Goal

Create the first owner-facing admin dashboard.

## Acceptance Criteria

- `/admin` dashboard shows today's orders, revenue, top products, and cutoff.
- Dashboard uses demo data until persistence is introduced.
- Staff auth shell remains in place.
- Admin dashboard links to orders and Backliste sections.

## Verification

Scenario: GIVEN a staff user opens admin, WHEN the dashboard loads, THEN core
KPIs and operational links are visible.

Tests: no new domain tests unless dashboard derives computed values.
