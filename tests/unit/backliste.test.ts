import { describe, expect, it } from "vitest";
import {
  aggregateBackliste,
  backlisteCsv,
  backlisteSlots,
} from "@/features/bakery-admin/backliste";

describe("backliste aggregation", () => {
  it("aggregates product totals for the selected production date", () => {
    const backliste = aggregateBackliste([
      order("B-1", "2026-09-29", "06:30", [
        item("hausbrot", "Hausbrot", 2),
        item("laugenbrezel", "Laugenbrezel", 6),
      ]),
      order("B-2", "2026-09-29", "07:00", [
        item("hausbrot", "Hausbrot", 1),
        item("zimtschnecke", "Zimtschnecke", 4),
      ]),
      order("B-3", "2026-09-30", "06:30", [item("hausbrot", "Hausbrot", 9)]),
    ], "2026-09-29");

    expect(backliste.productTotals).toEqual([
      { productId: "laugenbrezel", name: "Laugenbrezel", quantity: 6 },
      { productId: "zimtschnecke", name: "Zimtschnecke", quantity: 4 },
      { productId: "hausbrot", name: "Hausbrot", quantity: 3 },
    ]);
  });

  it("builds a product by slot matrix", () => {
    const backliste = aggregateBackliste([
      order("B-1", "2026-09-29", "06:30", [item("hausbrot", "Hausbrot", 2)]),
      order("B-2", "2026-09-29", "07:00", [item("hausbrot", "Hausbrot", 1)]),
    ], "2026-09-29");

    expect(backliste.slotMatrix).toEqual([
      {
        productId: "hausbrot",
        name: "Hausbrot",
        slots: { "06:30": 2, "07:00": 1 },
      },
    ]);
  });

  it("sorts visible matrix slots and exports a CSV", () => {
    const backliste = aggregateBackliste([
      order("B-1", "2026-09-29", "07:00", [item("hausbrot", "Hausbrot", 1)]),
      order("B-2", "2026-09-29", "06:30", [item("hausbrot", "Hausbrot", 2)]),
    ], "2026-09-29");

    expect(backlisteSlots(backliste)).toEqual(["06:30", "07:00"]);
    expect(backlisteCsv(backliste)).toBe(
      '"Produkt","Gesamt","06:30","07:00"\n"Hausbrot","3","2","1"',
    );
  });
});

function order(
  id: string,
  productionDate: string,
  pickupSlot: string,
  items: Array<{ productId: string; name: string; quantity: number }>,
) {
  return { id, productionDate, pickupSlot, items };
}

function item(productId: string, name: string, quantity: number) {
  return { productId, name, quantity };
}
