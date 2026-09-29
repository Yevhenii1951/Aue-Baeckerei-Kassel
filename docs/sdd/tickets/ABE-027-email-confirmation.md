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

## Implementation notes

- Layers: `domain.ts` (contract), `brevo.ts` (adapter), `orderConfirmation.ts`
  (pure payload), `runtime.ts` (env gate). `checkout.ts` takes an optional
  `onOrderConfirmed` and calls it after the session exists, inside try/catch.
- The sender identity is **required** for the group. The bakery has no mail
  domain, so inventing one in code would have put a wrong address into real
  customer mail. `assertEnvGroup` fails closed instead.
- `env-groups.test.ts` was updated: it caught the two new required keys, which
  is the behaviour change being intentional. Added a case for a fully
  configured group.
- Verified: `npm run check` green (182 unit + 24 integration), `npm run build`
  green, demo checkout `B-2026-0001` still completes with the groups off.
- Not verified: a real Brevo delivery. No API key and no sender domain exist
  here. Needs `ENABLE_EMAIL=true`, `BREVO_API_KEY`, `EMAIL_SENDER_NAME` and
  `EMAIL_SENDER_ADDRESS`.
- Consequence worth flagging: the demo checkout never calls the server, so no
  order row exists and there is nothing to confirm. Mail only happens on the
  ABE-026 Stripe path.
