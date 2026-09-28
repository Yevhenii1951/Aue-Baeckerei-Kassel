import type { BacklisteOrder } from "./backliste";

export type AdminOrderStatus = "new" | "preparing" | "ready";

export type AdminOrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

export type AdminOrder = {
  id: string;
  customer: string;
  mode: "pickup" | "delivery";
  time: string;
  status: AdminOrderStatus;
  items: AdminOrderItem[];
};

export type TopProduct = {
  name: string;
  quantity: number;
  revenueCents: number;
};

export const CUTOFF_TIME = "20:00 Uhr";
export const CUTOFF_NOTE =
  "Nach 20:00 Uhr gilt die Vorbestellung für übermorgen.";

export function orderTotalCents(items: AdminOrderItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.priceCents,
    0,
  );
}

export function sumRevenueCents(orders: AdminOrder[]): number {
  return orders.reduce((sum, order) => sum + orderTotalCents(order.items), 0);
}

export function topProducts(
  orders: AdminOrder[],
  limit = 3,
): TopProduct[] {
  const grouped = new Map<string, TopProduct>();

  for (const order of orders) {
    for (const item of order.items) {
      const entry = grouped.get(item.name) ?? {
        name: item.name,
        quantity: 0,
        revenueCents: 0,
      };
      entry.quantity += item.quantity;
      entry.revenueCents += item.quantity * item.priceCents;
      grouped.set(item.name, entry);
    }
  }

  return Array.from(grouped.values())
    .sort(
      (left, right) =>
        right.quantity - left.quantity ||
        left.name.localeCompare(right.name, "de-DE"),
    )
    .slice(0, limit);
}

export function demoOrders(): AdminOrder[] {
  return [
    order("ABE-1001", "Maren & Lars", "delivery", "08:05", "new", [
      item("Hausbrot", 1, 450),
      item("Körnerbrötchen", 4, 120),
    ]),
    order("ABE-1002", "Fatma K.", "pickup", "08:12", "new", [
      item("Laugenbrezel", 6, 150),
      item("Zimtschnecke", 2, 320),
    ]),
    order("ABE-1003", "Studio Markt", "delivery", "08:40", "preparing", [
      item("Pain Artisan", 6, 490),
      item("Schwarzbrot", 4, 590),
      item("Knabbermix", 2, 390),
    ]),
    order("ABE-1004", "Jonas W.", "pickup", "09:02", "preparing", [
      item("Baguette", 3, 380),
      item("Schlemmertasche", 2, 350),
    ]),
    order("ABE-1005", "Familie Reuter", "delivery", "09:20", "ready", [
      item("Hausbrot", 2, 450),
      item("Roggenbauer", 1, 550),
      item("Schokoschnecke", 4, 350),
    ]),
    order("ABE-1006", "Café Krone", "delivery", "09:35", "ready", [
      item("Kartoffel-Dinkelkruste", 8, 490),
      item("Käsebrötchen-Dinkel", 12, 180),
    ]),
  ];
}

export function demoBacklisteOrders(day: string): BacklisteOrder[] {
  return [
    backlog(day, "BK-1", "Hausbrot", 6),
    backlog(day, "BK-1", "Körnerbrötchen", 24),
    backlog(day, "BK-1", "Laugenbrezel", 12),
    backlog(day, "BK-2", "Pain Artisan", 12),
    backlog(day, "BK-2", "Schwarzbrot", 8),
    backlog(day, "BK-3", "Baguette", 9),
  ];
}

function order(
  id: string,
  customer: string,
  mode: AdminOrder["mode"],
  time: string,
  status: AdminOrderStatus,
  items: AdminOrderItem[],
): AdminOrder {
  return { id, customer, mode, time, status, items };
}

function item(name: string, quantity: number, priceCents: number): AdminOrderItem {
  return { name, quantity, priceCents };
}

function backlog(
  day: string,
  pickupSlot: string,
  name: string,
  quantity: number,
): BacklisteOrder {
  return {
    id: `${pickupSlot}-${name}`,
    productionDate: day,
    pickupSlot,
    items: [{ productId: name, name, quantity }],
  };
}