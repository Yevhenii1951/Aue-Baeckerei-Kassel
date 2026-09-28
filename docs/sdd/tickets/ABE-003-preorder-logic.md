# ABE-003 Preorder Logic

Implements: FR-4, FR-5

## Goal

Implement cutoff and pickup-slot domain logic for Europe/Berlin demo ordering.

## Verification

Scenario: GIVEN the current Berlin time is after 20:00, WHEN earliest preorder
date is calculated, THEN the earliest available date is the day after tomorrow.

Tests: unit tests for before cutoff, after cutoff, slot capacity, and full slot.
