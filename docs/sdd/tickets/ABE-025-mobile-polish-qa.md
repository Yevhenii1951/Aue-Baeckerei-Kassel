# ABE-025 Mobile Polish QA

Implements: NFR-2, NFR-4.

## Goal

Make the customer flow feel polished on mobile.

## Acceptance Criteria

- Sticky mobile cart/CTA works without covering important content.
- Filters are usable on small screens.
- Buttons and form controls are touch-friendly.
- No text overflow on mobile or desktop.
- Reduced-motion users are respected.
- Visual QA notes are recorded.

## Verification

Scenario: GIVEN a mobile viewport, WHEN a customer filters, adds to cart, and
continues to preorder, THEN all controls are usable and no content overlaps.

Tests: browser smoke/manual QA notes.

## QA notes

Recorded while fixing the ticket. Viewports: 320×568, 390×844, 1280×800.
Measurement is `getBoundingClientRect`, not eyeballing.

### Found and fixed

1. **Sticky header ate a fifth of the screen.** All six nav links plus the brand
   and the cart button were in one wrapping flex row: 185 px tall on a 390 px
   viewport, and it was `sticky top-0`, so it covered content on every scroll.
   Replaced with a burger + drawer below `lg` (pattern from Kalyna's
   `MobileMenu`, bakery tokens). Now 77 px at 320 px and at 390 px.
2. **Cart overlay survived navigation.** `isOpen` lives in a module-level
   singleton in `cart-provider.tsx`, so tapping "Zur Vorbestellung" changed the
   route but left the drawer and its `bg-ink/60` backdrop on top of the
   preorder page at `z-50`. The customer had to press Escape or find the × to
   get to the page they just asked for. `CartDrawer` now closes on pathname
   change. This was the real "cart covers important content" bug.
3. **Nav, footer and cart links were 22–32 px tall**, below the 24×24 minimum
   in WCAG 2.5.8. `.nav-link` is now `inline-flex min-h-11 items-center`, which
   fixes header and footer at once, since both used it. The brand link and the
   cart button got explicit `min-h-11`.
4. **Slot and date pickers were 41–42 px.** `PreorderSlotPicker` and the date
   row in `PreorderFlow` now carry `min-h-11`. Cart quantity steppers were
   `size-9` (36 px) and are now `size-11`; the drawer's close button was
   `size-10`.
5. **Brand broke mid-word at 320 px.** With the full nav in the header the brand
   got squeezed to 71 px and wrapped as "Aue-" / "Bäcke" / "rei". With the
   burger that space is free, and `whitespace-nowrap` plus a compact cart button
   (icon + count below `sm`, "Warenkorb" text from `sm`) keeps it on one line.
6. **Scroll lock was dead code.** Both overlays set `document.body.style.overflow
   = "hidden"`, but this layout scrolls on `html` (`overflow-x: clip`), so the
   page behind the drawer scrolled anyway. Replaced with `touch-none` on the
   backdrop, which stops the pan gesture without fighting the `html` clip.

### Verified, no change needed

- No horizontal overflow at 320/390/1280 (`scrollWidth` 305/375/1265).
- Category tabs: 50 px tall, `overflow-x-auto` for the 13 categories, filter
  goes 66 → 13 products for "Brote". Usable by swipe on mobile.
- Customer form fields already `min-h-11`; preorder page ends up with zero
  targets under 44 px.
- Cart drawer is 375×844 on mobile, the "Zur Vorbestellung" CTA is 339×50 and
  ends at y=735, inside the 844 px viewport.
- `prefers-reduced-motion: reduce` collapses the drawer transitions to ~0 s
  through the existing global CSS rule, no per-component handling needed.
- Cart contents survive the navigation (3 items kept, badge intact).

### Not addressed here

- The consent banner and the cart drawer can both want the bottom of the
  screen. Worth a look when a real customer sees it, not a blocker.
- German strings are still hardcoded in 17 components (`/en` and `/uk` fall back
  to German). Separate from this ticket.
