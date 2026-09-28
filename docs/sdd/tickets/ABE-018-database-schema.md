# ABE-018 Database Schema

Implements: FR-2, FR-4, FR-5, FR-6, FR-7

## Goal

Introduce persistent tables for products, orders, order items, pickup slots, and
delivery zones.

## Acceptance Criteria

- Migration adds `products`, `orders`, `order_items`, `pickup_slots`,
  `delivery_zones`.
- Prices are integer cents.
- Timestamps are `timestamptz`.
- RLS/grants follow the base pattern.
- Public read access is limited to published products and delivery zones.
- Staff can manage operational records.

## Verification

Scenario: GIVEN database migrations run locally, WHEN schema is inspected, THEN
all ecommerce tables exist with grants/RLS enabled.

Tests: integration tests for RLS and schema basics.
