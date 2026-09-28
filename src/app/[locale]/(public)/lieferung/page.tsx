import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "leaflet/dist/leaflet.css";
import { DeliveryZoneChecker } from "@/features/ordering/DeliveryZoneChecker";
import { DeliveryZoneMap } from "@/features/ordering/DeliveryZoneMap";
import {
  DELIVERY_ZONES,
  type DeliveryZoneInfo,
} from "@/features/ordering/delivery";
import { formatPrice } from "@/features/ordering/price";
import { buildPublicMetadata } from "@/features/seo/publicMetadata";
import { parseSupportedLocale } from "@/features/seo/site";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lieferung" });

  return buildPublicMetadata({
    locale: parseSupportedLocale(locale),
    path: "/lieferung",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function LieferungPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<React.ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lieferung");

  return (
    <div className="bg-cream">
      <section className="border-b border-brand-deep/10 bg-paper">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
          <p className="text-sm font-semibold text-sage">{t("eyebrow")}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-ink/72">{t("intro")}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {DELIVERY_ZONES.map((zone) => (
            <ZoneCard key={zone.zone} zone={zone} />
          ))}
        </div>

        <DeliveryZoneChecker subtotalCents={0} />

        <div className="mt-10">
          <DeliveryZoneMap />
        </div>
      </section>
    </div>
  );
}

function ZoneCard({ zone }: { zone: DeliveryZoneInfo }): React.ReactElement {
  return (
    <div className="surface p-5">
      <p className="text-sm font-semibold text-sage">Zone {zone.zone}</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-deep">
        bis {zone.distanceKm} km
      </h2>
      <p className="mt-2 text-sm text-ink/70">{zone.note}</p>
      <dl className="mt-4 grid gap-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink/60">Lieferkosten</dt>
          <dd className="font-medium text-brand-deep">
            {formatPrice(zone.feeCents)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/60">Ab Warenwert frei</dt>
          <dd className="font-medium text-brand-deep">
            {formatPrice(zone.freeThresholdCents)}
          </dd>
        </div>
      </dl>
    </div>
  );
}