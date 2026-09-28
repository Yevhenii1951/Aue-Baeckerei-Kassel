# ABE-002 Catalogue Demo

Implements: FR-2, FR-3, FR-9

## Goal

Create typed demo catalogue data for Brote, Broetchen, Suesses, Getraenke,
Snacks, and Feinkost with filtering helpers.

## Verification

Scenario: GIVEN a visitor filters for vegan snacks, WHEN the catalogue is
filtered, THEN only matching products remain and allergen metadata is visible.

Tests: unit tests for category, tag, and allergen filters.
