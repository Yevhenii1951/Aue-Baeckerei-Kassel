import type { Metadata } from "next";
import { localizedSiteUrl, SITE_LOCALES, SITE_NAME, type SiteLocale } from "./site";

// Must match the size exported by src/app/[locale]/opengraph-image.tsx.
const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

interface PublicMetadataInput {
  locale: SiteLocale;
  path: string;
  title: string;
  description: string;
}


export function buildPublicMetadata({
  locale,
  path,
  title,
  description,
}: PublicMetadataInput): Metadata {
  const languages = Object.fromEntries(
    SITE_LOCALES.map((candidate) => [candidate, localizedSiteUrl(candidate, path)]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: localizedSiteUrl(locale, path),
      languages: {
        ...languages,
        "x-default": localizedSiteUrl("de", path),
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      alternateLocale: SITE_LOCALES.filter((candidate) => candidate !== locale),
      url: localizedSiteUrl(locale, path),
      siteName: SITE_NAME,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: SITE_NAME,
        },
      ],
    },
  };
}
