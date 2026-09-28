# ABE-021 Product Detail Pages

Implements: FR-2, FR-9

## Goal

Create SEO-friendly product detail pages.

## Acceptance Criteria

- `/sortiment/[product]` shows product description, price, unit, tags,
  allergens, ingredients, and CTAs.
- Related products section uses tags/category.
- Product JSON-LD is emitted.
- Unknown product returns not-found.

## Verification

Scenario: GIVEN a customer opens a product page, WHEN they inspect details, THEN
ingredients, allergens, price, and related products are visible.

Tests: unit tests for product slug lookup and related-product selection.
