import type { SiteLocale } from "@/features/seo/site";

export type NavLink = {
  href: string;
  label: string;
};

export type NavLabels = {
  assortment: string;
  preorder: string;
  contact: string;
  career: string;
  partner: string;
  delivery: string;
  imprint: string;
  privacy: string;
};

/** The footer adds the café, which the header deliberately does not carry. */
export type FooterLabels = NavLabels & {
  cafe: string;
};

/**
 * The header carries the transaction only; legal pages live in the footer.
 * One source of truth keeps the desktop nav, the drawer and the footer from
 * drifting apart.
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

export function footerNavigationLinks(
  locale: SiteLocale,
  labels: FooterLabels,
): NavLink[] {
  return [
    ...navigationLinks(locale, labels),
    { href: `/${locale}/kafe`, label: labels.cafe },
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
 * Brand glyphs are not drawn here — that would mean shipping other people's
 * logos; owned SVGs belong in public/ with an entry in docs/sdd/assets.md.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];
