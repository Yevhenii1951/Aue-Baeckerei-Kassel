import type { BacklisteOrder } from "./backliste";

export type AdminOrderStatus =
  | "new"
  | "preparing"
  | "ready"
  | "collected"
  | "delivered";

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
  date?: string;
  items: AdminOrderItem[];
  notes?: string;
};

export type TopProduct = {
  name: string;
  quantity: number;
  revenueCents: number;
};

export const CUTOFF_TIME = "20:00";

export const ORDER_STATUS_PATH: readonly AdminOrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "collected",
  "delivered",
];

export function demoOrders(day: string): AdminOrder[];
export function demoOrders(): AdminOrder[];
export function demoOrders(day?: string): AdminOrder[] {
  if (day === undefined) {
    return [
      order("ABE-1001", "Maren & Lars", "delivery", "08:05", "new", [item("Hausbrot", 1, 450), item("Körnerbrötchen", 4, 120)]),
      order("ABE-1002", "Fatma K.", "pickup", "08:12", "new", [item("Laugenbrezel", 6, 150), item("Zimtschnecke", 2, 320)]),
      order("ABE-1003", "Studio Markt", "delivery", "08:40", "preparing", [item("Pain Artisan", 6, 490), item("Schwarzbrot", 4, 590), item("Knabbermix", 2, 390)]),
      order("ABE-1004", "Jonas W.", "pickup", "09:02", "preparing", [item("Baguette", 3, 380), item("Schlemmertasche", 2, 350)]),
      order("ABE-1005", "Familie Reuter", "delivery", "09:20", "ready", [item("Hausbrot", 2, 450), item("Roggenbauer", 1, 550), item("Schokoschnecke", 4, 350)]),
      order("ABE-1006", "Café Krone", "delivery", "09:35", "ready", [item("Kartoffel-Dinkelkruste", 8, 490), item("Dinkel Plus Käse", 12, 380)]),
    ];
  }

  const tomorrow = addDays(day, 1);

  return [
    datedOrder("ABE-1001", day, "Maren & Lars", "delivery", "08:05", "delivered", [item("Hausbrot", 1, 450), item("Körnerbrötchen", 4, 120)]),
    datedOrder("ABE-1002", day, "Fatma K.", "pickup", "08:12", "collected", [item("Laugenbrezel", 6, 150), item("Zimtschnecke", 2, 320)]),
    datedOrder("ABE-1003", day, "Studio Markt", "delivery", "08:40", "ready", [item("Pain Artisan", 6, 490), item("Schwarzbrot", 4, 590), item("Knabbermix", 2, 390)]),
    datedOrder("ABE-1004", day, "Jonas W.", "pickup", "09:02", "preparing", [item("Baguette", 3, 380), item("Schlemmertasche", 2, 350)]),
    datedOrder("ABE-1005", day, "Familie Reuter", "delivery", "09:20", "new", [item("Hausbrot", 2, 450), item("Roggenbauer", 1, 550), item("Schokoschnecke", 4, 350)]),
    datedOrder("ABE-1006", day, "Café Krone", "delivery", "09:35", "preparing", [item("Kartoffel-Dinkelkruste", 8, 490), item("Dinkel Plus Käse", 12, 380)]),
    datedOrder("ABE-2001", tomorrow, "Sana I.", "pickup", "07:45", "new", [item("Laugenbrezel", 10, 150), item("Hausbrötchen", 10, 90), item("Zimtschnecke", 6, 320)]),
    datedOrder("ABE-2002", tomorrow, "Kita Sonnenschein", "delivery", "08:00", "new", [item("Vollkorn-Saftkorn", 3, 520), item("Käsedings", 20, 180)]),
    datedOrder("ABE-2003", tomorrow, "Uwe B.", "pickup", "09:15", "new", [item("Bauernlaib", 2, 520), item("Dinkel-Toast", 1, 450)]),
  ];
}

export function orderTotalCents(items: AdminOrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0);
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

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));

  return shifted.toISOString().slice(0, 10);
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

function datedOrder(
  id: string,
  date: string,
  customer: string,
  mode: AdminOrder["mode"],
  time: string,
  status: AdminOrderStatus,
  items: AdminOrderItem[],
): AdminOrder {
  return { id, customer, mode, time, status, date, items };
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
