import { loadDb, mutate } from "@/lib/db/store";
import type { Order, OrderItem } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function nextOrderNumber(db: { order_sequence: number }) {
  db.order_sequence += 1;
  const year = new Date().getUTCFullYear();
  return `VZ-${year}-${String(db.order_sequence).padStart(6, "0")}`;
}

export function findByIdempotency(key: string, customerId: string | null) {
  return (
    loadDb().orders.find((o) => o.idempotency_key === key && o.customer_id === customerId) ?? null
  );
}

export function getOrderById(id: string) {
  return loadDb().orders.find((o) => o.id === id) ?? null;
}

export function getOrderByNumber(orderNumber: string) {
  return loadDb().orders.find((o) => o.order_number === orderNumber) ?? null;
}

export function listOrdersForCustomer(customerId: string) {
  return loadDb()
    .orders.filter((o) => o.customer_id === customerId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listAllOrders() {
  return loadDb().orders.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listOrderItems(orderId: string) {
  return loadDb().order_items.filter((i) => i.order_id === orderId);
}

export function listOrderEvents(orderId: string) {
  return loadDb()
    .order_events.filter((e) => e.order_id === orderId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function insertOrder(order: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">, items: Omit<OrderItem, "id" | "order_id">[]) {
  return mutate((db) => {
    if (order.idempotency_key) {
      const existing = db.orders.find(
        (o) => o.idempotency_key === order.idempotency_key && o.customer_id === order.customer_id,
      );
      if (existing) return existing;
    }
    const now = nowIso();
    const row: Order = {
      ...order,
      id: uid(),
      order_number: nextOrderNumber(db),
      created_at: now,
      updated_at: now,
    };
    db.orders.push(row);
    for (const item of items) {
      db.order_items.push({ ...item, id: uid(), order_id: row.id });
    }
    db.order_events.push({
      id: uid(),
      order_id: row.id,
      type: "created",
      message: "Order created. Payment pending.",
      created_at: now,
    });
    return row;
  });
}

export function cancelPendingOrder(id: string) {
  return mutate((db) => {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return null;
    if (order.status !== "pending_payment") return order;
    order.status = "cancelled";
    order.updated_at = nowIso();
    db.order_events.push({
      id: uid(),
      order_id: order.id,
      type: "cancelled",
      message: "Pending order cancelled.",
      created_at: nowIso(),
    });
    return order;
  });
}
