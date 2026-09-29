# ABE-026 Stripe Test Mode

Implements: FR-13

## Goal

Add optional Stripe test-mode checkout behind the payments feature group.

## Acceptance Criteria

- Payments group remains off by default.
- Stripe keys are server-only.
- Checkout session uses server-calculated totals.
- Success/cancel routes are handled.
- Demo can still run without Stripe.

## Verification

Scenario: GIVEN payments are enabled with test keys, WHEN checkout starts, THEN
a Stripe test checkout session is created with correct line totals.

Tests: server action tests with mocked Stripe client.

## Implementation notes

- `createOrder` now returns `subtotalCents`, `deliveryFeeCents`, `totalCents`
  and the priced `lines` alongside the ids. That is what the Stripe session is
  built from; the browser never sends an amount.
- Layers: `stripeClient.ts` (server-only, interface + factory), `checkout.ts`
  (pure `startCheckout`, the tested unit), `runtime.ts` (real deps, `null` when
  the group is off), `paymentActions.ts` (server action).
- Verified: `npm run check` green (173 unit + 24 integration), `npm run build`
  green, demo order `B-2026-0001` still completes with payments off, cancel
  notice renders, thank-you page is `noindex` and not in the sitemap.
- Not verified: a real Stripe redirect. No test key is configured, so
  `stripe.checkout.sessions.create` has not been called against Stripe here.
  Needs `URL`, `ENABLE_PAYMENTS=true`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET` in `.env.local` to try end to end.
- Not in scope: the webhook that would mark the order paid, and the payment
  status write-back. No ticket covers them yet.
