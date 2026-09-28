export type BacklisteOrderItem = {
  productId: string;
  name: string;
  quantity: number;
};

export type BacklisteOrder = {
  id: string;
  productionDate: string;
  pickupSlot: string;
  items: BacklisteOrderItem[];
};

export type ProductTotal = {
  productId: string;
  name: string;
  quantity: number;
};

export type SlotMatrixRow = {
  productId: string;
  name: string;
  slots: Record<string, number>;
};

export type Backliste = {
  productionDate: string;
  orderCount: number;
  productTotals: ProductTotal[];
  slotMatrix: SlotMatrixRow[];
};

export function aggregateBackliste(
  orders: BacklisteOrder[],
  productionDate: string,
): Backliste {
  const scopedOrders = orders.filter(
    (order) => order.productionDate === productionDate,
  );
  const totals = new Map<string, ProductTotal>();
  const matrix = new Map<string, SlotMatrixRow>();

  for (const order of scopedOrders) {
    for (const item of order.items) {
      const total = totals.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        quantity: 0,
      };
      total.quantity += item.quantity;
      totals.set(item.productId, total);

      const row = matrix.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        slots: {},
      };
      row.slots[order.pickupSlot] =
        (row.slots[order.pickupSlot] ?? 0) + item.quantity;
      matrix.set(item.productId, row);
    }
  }

  return {
    productionDate,
    orderCount: scopedOrders.length,
    productTotals: Array.from(totals.values()).sort(sortByQuantityThenName),
    slotMatrix: Array.from(matrix.values()).sort(sortMatrixRows),
  };
}

function sortByQuantityThenName(left: ProductTotal, right: ProductTotal): number {
  if (right.quantity !== left.quantity) {
    return right.quantity - left.quantity;
  }

  return left.name.localeCompare(right.name, "de-DE");
}

function sortMatrixRows(left: SlotMatrixRow, right: SlotMatrixRow): number {
  return left.name.localeCompare(right.name, "de-DE");
}
