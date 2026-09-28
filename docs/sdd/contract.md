# Contract

## Domain Modules

- `src/features/catalog`: product types, demo catalogue data, filters, allergen
  legend, category helpers.
- `src/features/ordering`: cutoff calculation, pickup slot model, cart totals,
  preorder validation.
- `src/features/bakery-admin`: backliste aggregation and dashboard view models.
- `src/features/content`: public landing content, section components, local
  business copy that is not generic shell infrastructure.

## Product Contract

Products use integer cents and German canonical copy.

```ts
type ProductCategory =
  | "bread"
  | "rolls"
  | "sweets"
  | "drinks"
  | "snacks"
  | "fineGoods";

type Product = {
  id: string;
  category: ProductCategory;
  name: string;
  subtitle?: string;
  description: string;
  priceCents: number;
  unit: string;
  ingredients: string[];
  allergens: AllergenCode[];
  tags: string[];
  imageUrl?: string;
  preorder: boolean;
  shop: boolean;
};
```

## Allergen Codes

- A: Gluten
- C: Eier
- F: Senf
- G: Milch
- H: Schalenfruechte
- N: Sesam

## Ordering Contract

- Business timezone is `Europe/Berlin`.
- Default preorder cutoff is 20:00.
- After cutoff, earliest preorder date moves from tomorrow to the day after
  tomorrow.
- Pickup slots are 30 minutes.
- Slot capacity is an integer and defaults to 15 in demo mode.
- Money calculations use integer cents.

## Database Plan

Phase 1 may use typed demo data for speed. Database tables are introduced only
when the feature needs persistence:

- `products`
- `orders`
- `order_items`
- `pickup_slots`
- `subscriptions`

Every exposed table follows the base RLS/grants pattern. Admin access is staff
only and never enforced by middleware alone.
