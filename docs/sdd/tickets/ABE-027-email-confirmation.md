# ABE-027 Email Confirmation

Implements: FR-14

## Goal

Add optional order confirmation email behind the email feature group.

## Acceptance Criteria

- Email group remains off by default.
- Confirmation email is generated from server-side order data.
- No secrets are exposed to client code.
- Failure to send email does not lose the order.

## Verification

Scenario: GIVEN email is enabled, WHEN an order is created, THEN a confirmation
email payload is prepared and sent.

Tests: unit tests for email payload and mocked provider call.
