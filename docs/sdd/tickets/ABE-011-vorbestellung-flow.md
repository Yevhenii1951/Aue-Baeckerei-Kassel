# ABE-011 Vorbestellung Flow

Implements: FR-4, FR-5, FR-6

## Goal

Create `/vorbestellen` as the main preorder flow for tomorrow/morning pickup.

## Acceptance Criteria

- Page reads cart items from persistent cart state.
- Earliest date follows the 20:00 Europe/Berlin cutoff.
- Customer can choose pickup date and 30-minute pickup slot.
- Full/limited/available slot states are visible.
- Customer data form captures name, email, phone, and notes.
- Order summary shows items, subtotal, discount, and total.

## Verification

Scenario: GIVEN Berlin time is after 20:00, WHEN a customer opens preorder,
THEN the earliest selectable pickup date is the day after tomorrow.

Tests: existing cutoff/slot unit tests plus form validation tests.
