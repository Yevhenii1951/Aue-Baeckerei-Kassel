# Business Spec

## Must

- FR-1: The start page presents Aue-Baeckerei as a modern Kassel bakery with a
  video hero, core CTA paths, cutoff status, bestseller preview, cafe note, and
  local trust signals.
- FR-2: The catalogue shows products across Brote, Broetchen, Suesses,
  Getraenke, Snacks, and Feinkost with German names, prices in cents, tags, and
  allergen codes.
- FR-3: Customers can filter catalogue items by category, tags, and allergens in
  demo mode.
- FR-4: A preorder flow calculates the earliest available fulfillment date from
  a 20:00 Europe/Berlin cutoff.
- FR-5: Pickup slots are 30 minutes and expose capacity state.
- FR-6: Cart totals are calculated server-side or from shared domain functions,
  using integer euro cents.
- FR-7: Admin users can see a backliste aggregate for the next production day.
- FR-8: Impressum and Datenschutz remain reachable from every public page.

## Should

- FR-9: Product cards offer cross-sell hints such as bread plus butter,
  marmalade, coffee, or lunch bundle.
- FR-10: Delivery zone content explains Kassel zones and can later accept a PLZ.
- FR-11: Brot-Abo and Firmenservice are visible as conversion paths, even if the
  first phase uses inquiry/mock flows.
- FR-12: Cafe content has its own visible section/tab and can accept future
  interior photos.

## Later

- FR-13: Real Stripe, PayPal, Klarna, SEPA, and invoice payment flows.
- FR-14: Real courier tracking, SMS, push notifications, Google Reviews,
  Instagram feed, and AI Brot-Berater.
- FR-15: CMS editing for products, recipes, banners, and photos.

## Non-Functional Requirements

- NFR-1: German is canonical; English and Ukrainian may fall back to German
  during early implementation.
- NFR-2: Respect `prefers-reduced-motion`.
- NFR-3: No hardcoded brand colors in JSX; use tokens in `globals.css`.
- NFR-4: Public UI is mobile-first and keyboard-accessible.
- NFR-5: German legal pages must remain present and linked.
- NFR-6: No production secrets or third-party tracking in the repository.

## Success Metrics

- The home page communicates the preorder concept within the first viewport.
- A recruiter/client can identify catalogue, ordering, and admin competence in
  under two minutes.
- Domain logic tests cover cutoff, slot capacity, totals, and filters before
  those features are marked done.

## Open Questions

- Final owned product and cafe photos will be added later by the project owner.
- Real legal copy is required before any commercial launch.
