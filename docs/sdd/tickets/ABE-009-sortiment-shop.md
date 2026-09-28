# ABE-009 Sortiment Shop

Implements: FR-2, FR-3, FR-6, FR-9

## Goal

Turn the catalogue from a landing preview into a real customer-facing shop page.

## Acceptance Criteria

- `/de/sortiment` has a full catalogue surface with categories, search, tags,
  allergen exclusion, and sorting.
- Product cards show price, unit, tags, allergens, and two actions where
  relevant: cart and preorder.
- A local cart summary reacts to add/quantity changes and shows integer-cent
  totals.
- Header navigation points to the real Sortiment route.

## Verification

Scenario: GIVEN a visitor opens `/de/sortiment`, WHEN they filter for vegan and
add products, THEN only matching products are shown and the cart summary updates.

Tests: unit tests for sorting/filtering and cart totals.
