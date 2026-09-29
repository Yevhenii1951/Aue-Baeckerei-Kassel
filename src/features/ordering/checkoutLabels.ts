export type DeliveryTimeData = {
  express: boolean;
  deliveryDate: string;
  deliverySlotId: string;
};

type Translator = (key: string, values?: Record<string, string | number>) => string;

// Called from the client with the active locale. The order confirmation email
// formats the same label on the server, where it stays German on purpose.
export function deliveryTimeLabel(
  data: DeliveryTimeData,
  locale: string,
  t: Translator,
): string {
  if (data.express) {
    return t("lieferung.expressShort");
  }

  const parts = data.deliverySlotId.split("-");
  const time = parts[parts.length - 1];

  return `${formatDate(data.deliveryDate, locale)}, ${t("lieferung.atTime", { time })}`;
}

export function formatDate(date: string, locale: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
