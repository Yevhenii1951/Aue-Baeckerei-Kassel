import { formatEuroCents } from "@/lib/format";
import type { OrderLine } from "@/features/ordering/orderService";
import type { EmailMessage } from "./domain";

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  mode: "pickup" | "delivery";
  deliveryLabel: string | null;
  lines: OrderLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}

export function buildOrderConfirmation(
  data: OrderConfirmationData,
): EmailMessage {
  const itemLines = data.lines.map(
    (line) =>
      `${line.quantity} × ${line.name} — ${formatEuroCents(line.lineTotalCents, "de")}`,
  );

  const feeLine =
    data.mode === "delivery" && data.deliveryFeeCents > 0
      ? `Liefergebühr: ${formatEuroCents(data.deliveryFeeCents, "de")}`
      : null;

  const whenLine =
    data.mode === "delivery" && data.deliveryLabel
      ? `Lieferung: ${data.deliveryLabel}`
      : "Abholung in der Bäckerei";

  const text = [
    `Hallo ${data.customerName},`,
    "",
    "vielen Dank für deine Bestellung. Wir haben sie erhalten und melden uns, "
      + "sobald sie für dich bereitsteht.",
    "",
    `Bestellnummer: ${data.orderNumber}`,
    ...itemLines,
    `Zwischensumme: ${formatEuroCents(data.subtotalCents, "de")}`,
    ...(feeLine ? [feeLine] : []),
    `Gesamt: ${formatEuroCents(data.totalCents, "de")}`,
    "",
    whenLine,
    "",
    "Bis bald,",
    "deine Aue-Bäckerei Kassel",
  ].join("\n");

  return {
    to: data.customerEmail,
    subject: `Deine Bestellung ${data.orderNumber}`,
    text,
    html: buildHtml({ data, itemLines, feeLine, whenLine }),
  };
}

function buildHtml(input: {
  data: OrderConfirmationData;
  itemLines: string[];
  feeLine: string | null;
  whenLine: string;
}): string {
  const rows = [...input.itemLines, ...(input.feeLine ? [input.feeLine] : [])]
    .map((row) => `<li>${escapeHtml(row)}</li>`)
    .join("");

  return [
    "<p>Hallo " + escapeHtml(input.data.customerName) + ",</p>",
    "<p>vielen Dank für deine Bestellung. Wir haben sie erhalten und melden uns, "
      + "sobald sie für dich bereitsteht.</p>",
    "<p><strong>Bestellnummer:</strong> " + escapeHtml(input.data.orderNumber) + "</p>",
    "<ul>" + rows + "</ul>",
    "<p><strong>Gesamt: </strong>"
      + escapeHtml(formatEuroCents(input.data.totalCents, "de"))
      + "</p>",
    "<p>" + escapeHtml(input.whenLine) + "</p>",
    "<p>Bis bald,<br>deine Aue-Bäckerei Kassel</p>",
  ].join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
