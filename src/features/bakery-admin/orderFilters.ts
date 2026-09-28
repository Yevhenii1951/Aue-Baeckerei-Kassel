import type { AdminOrder, AdminOrderStatus } from "./demoDashboard";

export type OrderModeFilter = "all" | "pickup" | "delivery";
export type OrderStatusFilter = "all" | AdminOrderStatus;

export interface OrderFilters {
  date: string;
  status: OrderStatusFilter;
  mode: OrderModeFilter;
}

export function filterByDate(
  orders: AdminOrder[],
  date: string,
): AdminOrder[] {
  return orders.filter((order) => order.date === date);
}

export function filterByStatus(
  orders: AdminOrder[],
  status: OrderStatusFilter,
): AdminOrder[] {
  return status === "all" ? orders : orders.filter((order) => order.status === status);
}

export function filterByMode(
  orders: AdminOrder[],
  mode: OrderModeFilter,
): AdminOrder[] {
  return mode === "all" ? orders : orders.filter((order) => order.mode === mode);
}

export function applyOrderFilters(
  orders: AdminOrder[],
  filters: OrderFilters,
): AdminOrder[] {
  return filterByMode(filterByStatus(filterByDate(orders, filters.date), filters.status), filters.mode);
}