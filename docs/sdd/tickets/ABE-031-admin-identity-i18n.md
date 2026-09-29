# ABE-031 i18n: admin and identity UI

Implements: NFR-1

Status: DONE — merged on `main` (PR #24).

## Verification result

All acceptance criteria met: `/de|en|uk/admin` render the KPI labels, filters,
status badges, order cards and Backliste panel in the page locale (demo product
names stay German); `/admin/login` shows the not-configured hint in the locale
(via `generateMetadata` + `admin.login.*`), the stray "(Admin-Login de)"
suffix was removed from `de.json`; auth and zod messages are stable codes
rendered client-side with a `t.has()` fallback. `npm run check` green (184
unit + 24 integration), `npm run build` green (/admin SSG x3 locales),
browser-verified in de/en/uk (revenue 217,20 € / €217.20).

## Goal

Move the staff/admin UI (`/admin`, `/admin/login`, `/admin/password`) off
hardcoded language onto next-intl. Today the admin surface is inconsistent:
`bakery-admin/*` is hardcoded German, `identity/*` is hardcoded English, and
the auth server actions return English messages. After this ticket
`/de/admin` is German (canonical), `/en/admin` and `/uk/admin` translate the
chrome.

## Scope

- `bakery-admin/`: `AdminDashboard`, `OrderFilters`, `OrderList`, `OrderCard`,
  `OrderStatusPath`, `StatusBadge`, `BacklistePanel`, `demoDashboard.ts`
  (status labels, cutoff note/time move to messages; demo product names stay
  German content)
- `identity/`: `AdminLoginForm`, `PasswordUpdateForm`, `authActions.ts` (auth
  result/field messages become stable codes, translated in the client)
- pages: `[locale]/(auth)/admin`, `admin/login`, `admin/password`
  (`generateMetadata` + body copy)
- delete `src/features/ordering/price.ts` in favour of the existing
  `formatEuroCents(cents, locale)`

## Out of scope

- The staff/rbac domain logic itself, RLS, Supabase wiring.
- Demo content (product and customer names in `demoOrders`/`demoBacklisteOrders`)
  stays German — content, not chrome.
- Public path i18n: ABE-030 (done).

## Acceptance Criteria

- `/de/admin` renders German, `/en/admin` English, `/uk/admin` Ukrainian for
  every label, badge, filter, button and form message.
- No user-visible language literal in the files above; all copy comes from
  `useTranslations`/`getTranslations`.
- `de`, `en` and `uk` carry the new `admin` namespace; the i18n parity test
  stays green.
- Auth errors use stable codes; the client shows the locale's wording.
- No behaviour change: filters, status path, CSV export, print and the demo
  data all work exactly as before.

## Verification

Scenario: GIVEN a staff session, WHEN `/en/admin` is opened, THEN the filters,
KPI labels, status badges and Backliste panel are English while product names
stay German.

Scenario: GIVEN `/en/admin/login`, WHEN opened, THEN the form labels and the
not-configured hint are English.

Scenario: GIVEN an invalid login, WHEN submitted, THEN the error is shown in
the page locale, not a server-language string.

Tests: existing unit suites stay green; `npm run check` + `npm run build`
pass; browser checks of `/admin` in all three locales.