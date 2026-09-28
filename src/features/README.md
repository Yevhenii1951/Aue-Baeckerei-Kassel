# Features

Feature-based colocation: a module owns its domain, its store, its Server
Actions and its components. `src/lib` holds cross-cutting infrastructure only —
it must never import from a feature, which keeps the dependency direction
one-way and lets a feature be deleted without touching anything else.

Modules present in this base:

| Module | Owns |
| --- | --- |
| `identity` | staff profiles, roles, invitations, Supabase staff auth |
| `catalog` | product data, allergen metadata, filtering and catalogue UI |
| `ordering` | preorder cutoff, pickup slots, cart/order domain logic |
| `seo` | locale-aware metadata, canonical and hreflang URLs |
| `legal` | Impressum/Datenschutz draft shell |
| `shell` | site header and footer |

Adding a module: create `src/features/<name>/`, keep it independent of the other
features, and document the boundary in this table.

Rules: no barrel exports, no `any`, files under 200 lines, components under
150 lines, exported functions have explicit return types.
