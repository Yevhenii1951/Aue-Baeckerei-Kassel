"use client";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DELIVERY_ZONES } from "@/features/ordering/delivery";
import { useConsent } from "@/features/consent/consent-store";

const BAKERY_LOCATION: [number, number] = [51.3127, 9.4797];
const MAP_ZOOM_LEVEL = 12;
const ZONE_RADIUS_METERS = [2000, 5000, 8000] as const;
const ZONE_COLORS = ["#7c1428", "#c89435", "#49684a"] as const;

export function DeliveryZoneMap() {
  const { map: consent } = useConsent();
  const t = useTranslations("lieferung");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (consent !== "granted" || !containerRef.current || mapRef.current) {
      return;
    }
    let active = true;

    void import("leaflet")
      .then((leaflet) => {
        if (!active || !containerRef.current || mapRef.current) return;
        const map = leaflet.map(containerRef.current).setView(
          BAKERY_LOCATION,
          MAP_ZOOM_LEVEL,
        );
        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          })
          .addTo(map);

        DELIVERY_ZONES.forEach((zone, index) => {
          leaflet
            .circle(BAKERY_LOCATION, {
              radius: ZONE_RADIUS_METERS[index],
              color: ZONE_COLORS[index],
              weight: 2,
              fillOpacity: 0.12,
            })
            .addTo(map)
            .bindPopup(
              t("zoneRadius", { zone: zone.zone, km: zone.distanceKm }),
            );
        });

        leaflet
          .circleMarker(BAKERY_LOCATION, {
            radius: 9,
            color: "#18120f",
            fillColor: "#7c1428",
            fillOpacity: 1,
          })
          .addTo(map)
          .bindPopup("Backstube");

        mapRef.current = map;
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      });

    return () => {
      active = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [consent, t]);

  if (consent !== "granted") {
    return (
      <div className="rounded-lg border border-brand-deep/10 bg-paper p-5">
        <h2 className="font-display text-2xl font-semibold">{t("mapTitle")}</h2>
        <p className="mt-3 leading-7 text-ink/72">{t("mapHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        role="img"
        aria-label={t("mapLabel")}
        className="h-96 w-full rounded-lg border border-brand-deep/10"
      />
      {loadFailed ? (
        <p role="alert" className="text-sm text-ink/72">
          {t("mapFailed")}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-4 text-sm">
        {DELIVERY_ZONES.map((zone, index) => (
          <li key={zone.zone} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-3 rounded-full border"
              style={{ borderColor: ZONE_COLORS[index], backgroundColor: `${ZONE_COLORS[index]}22` }}
            />
            {t("zoneShort", { zone: zone.zone, km: zone.distanceKm })}
          </li>
        ))}
      </ul>
    </div>
  );
}
