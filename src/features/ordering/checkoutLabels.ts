export function deliveryTimeLabel(data: {
  express: boolean;
  deliveryDate: string;
  deliverySlotId: string;
}): string {
  if (data.express) {
    return "Express — in ca. 2 Std.";
  }

  const parts = data.deliverySlotId.split("-");
  const time = parts[parts.length - 1];

  return `${formatDate(data.deliveryDate)}, ${time} Uhr`;
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
