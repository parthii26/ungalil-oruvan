import { describe, it, expect, beforeEach } from "vitest";
import { nextOrderNumber, listAllOrders } from "@/lib/repositories/orders";
import { resetDb } from "@/lib/db/store";

describe("Order ID / Number formatting", () => {
  beforeEach(() => {
    resetDb();
  });

  it("generates order numbers with the UO prefix and padded 6-digit sequence", () => {
    const db = { order_sequence: 5 };
    const orderNum = nextOrderNumber(db);
    const currentYear = new Date().getUTCFullYear();

    expect(orderNum).toBe(`UO-${currentYear}-000006`);
    expect(db.order_sequence).toBe(6);
  });

  it("verifies seeded orders use the UO prefix", () => {
    const orders = listAllOrders();
    expect(orders.length).toBeGreaterThan(0);
    for (const order of orders) {
      expect(order.order_number).toMatch(/^UO-\d{4}-\d{6}$/);
    }
  });
});
