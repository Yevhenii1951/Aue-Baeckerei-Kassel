import type { MetadataRoute } from "next";
import { LOCAL_SEO_PAGES } from "@/features/content/localSeoPages";
import { localizedSiteUrl, SITE_LOCALES } from "@/features/seo/site";

const STATIC_PATHS = [
  "",
  "/sortiment",
  "/lieferung",
  "/vorbestellen",
  "/kafe",
  "/kontakt",
  "/karriere",
  "/partner",
  "/impressum",
  "/datenschutz",
] as const;

const INDEXABLE_PATHS = [
  ...STATIC_PATHS,
  ...LOCAL_SEO_PAGES.map((page) => `/${page.slug}`),
] as readonly string[];

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.flatMap((path) => {
    const languages = {
      de: localizedSiteUrl("de", path),
      en: localizedSiteUrl("en", path),
      uk: localizedSiteUrl("uk", path),
      "x-default": localizedSiteUrl("de", path),
    };

    return SITE_LOCALES.map((locale) => ({
      url: localizedSiteUrl(locale, path),
      alternates: { languages },
    }));
  });
}
