import type { SiteLocale } from "@/features/seo/site";

export type NavLink = {
  href: string;
  label: string;
};

export type NavLabels = {
  assortment: string;
  preorder: string;
  cafe: string;
  contact: string;
  career: string;
  partner: string;
  delivery: string;
  imprint: string;
  privacy: string;
};

/**
 * The header carries the catalogue, the ordering and the company pages. The
 * café sits apart from them as a framed link next to the cart, because it is a
 * place to visit rather than a step in the ordering flow. The footer lists
 * every page inline plus the service area. Same labels, same hrefs.
 */
export function navigationLinks(
  locale: SiteLocale,
  labels: NavLabels,
): NavLink[] {
  return [
    { href: `/${locale}/sortiment`, label: labels.assortment },
    { href: `/${locale}/vorbestellen`, label: labels.preorder },
    { href: `/${locale}/kontakt`, label: labels.contact },
    { href: `/${locale}/karriere`, label: labels.career },
    { href: `/${locale}/partner`, label: labels.partner },
  ];
}

export function cafeLink(locale: SiteLocale, label: string): NavLink {
  return { href: `/${locale}/kafe`, label };
}

export function footerNavigationLinks(
  locale: SiteLocale,
  labels: NavLabels,
): NavLink[] {
  return [
    { href: `/${locale}/sortiment`, label: labels.assortment },
    { href: `/${locale}/vorbestellen`, label: labels.preorder },
    cafeLink(locale, labels.cafe),
    { href: `/${locale}/kontakt`, label: labels.contact },
    { href: `/${locale}/karriere`, label: labels.career },
    { href: `/${locale}/partner`, label: labels.partner },
    { href: `/${locale}/lieferung`, label: labels.delivery },
  ];
}

export function legalLinks(locale: SiteLocale, labels: NavLabels): NavLink[] {
  return [
    { href: `/${locale}/impressum`, label: labels.imprint },
    { href: `/${locale}/datenschutz`, label: labels.privacy },
  ];
}

/**
 * Placeholder profiles: the owner has no accounts yet, so the footer shows the
 * channels without pretending they exist. Replace the hrefs, not the markup.
 * The glyphs in BrandIcon.tsx are the Simple Icons paths, linked because they
 * point at the bakery's own profiles.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];
