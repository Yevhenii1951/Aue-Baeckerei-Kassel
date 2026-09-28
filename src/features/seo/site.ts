import { z } from "zod";
import { routing } from "@/i18n/routing";
import { serverEnv } from "@/lib/env/server";

export const SITE_URL = (serverEnv.URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);
export const SITE_NAME = serverEnv.SITE_NAME ?? "Aue-Bäckerei Kassel";
export const SITE_LOCALES = routing.locales;
export type SiteLocale = (typeof SITE_LOCALES)[number];

const supportedLocaleSchema = z.enum(SITE_LOCALES);

export function parseSupportedLocale(value: string): SiteLocale {
  return supportedLocaleSchema.parse(value);
}

export function localizedSiteUrl(locale: SiteLocale, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}
