# ABE-051 Mobile Header and Drawer Repair

Implements: NFR-2, NFR-4.

## Goal

The burger menu opened broken (drawer collapsed to the header height, links
clipped) and at 320 px the header row overflowed, cutting off the burger.

## Acceptance Criteria

- The menu drawer covers the viewport; every link is visible and tappable.
- The header row fits at 320 px; the burger is fully inside the viewport.
- The café stays reachable on mobile: framed pill from `sm`, drawer entry below.
- The page behind the open drawer does not scroll.
- Focus moves into the dialog on open and returns to the burger on close.

## Verification

Scenario: GIVEN a 320 px viewport, WHEN the visitor opens the menu, THEN the
drawer fills the viewport with all six links (including Café), Escape closes
it, and the focus is back on the burger.

Tests: browser measurements at 320/360/390/414/640/1024/1440;
`npm run check` + `npm run build`.
