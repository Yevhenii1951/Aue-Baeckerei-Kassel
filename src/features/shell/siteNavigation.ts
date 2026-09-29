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
 * The header carries the pages a visitor needs, the footer adds the service
 * detail and the legal pages. One source of truth keeps the desktop nav, the
 * drawer and the footer from drifting apart.
 */
export function navigationLinks(
  locale: SiteLocale,
  labels: NavLabels,
): NavLink[] {
  return [
    { href: `/${locale}/sortiment`, label: labels.assortment },
    { href: `/${locale}/vorbestellen`, label: labels.preorder },
    { href: `/${locale}/kafe`, label: labels.cafe },
    { href: `/${locale}/kontakt`, label: labels.contact },
    { href: `/${locale}/karriere`, label: labels.career },
    { href: `/${locale}/partner`, label: labels.partner },
  ];
}

export function footerNavigationLinks(
  locale: SiteLocale,
  labels: NavLabels,
): NavLink[] {
  return [...navigationLinks(locale, labels), { href: `/${locale}/lieferung`, label: labels.delivery }];
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
 * Brand glyphs are not drawn here — that would mean shipping other people's
 * logos; owned SVGs belong in public/ with an entry in docs/sdd/assets.md.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];
