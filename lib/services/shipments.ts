import { loadDb, mutate } from "@/lib/db/store";
import * as ordersRepo from "@/lib/repositories/orders";
import { nowIso, uid } from "@/lib/utils";

export interface ShipmentRecord {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: "manifested" | "in_transit" | "out_for_delivery" | "delivered";
  shippedAt: string;
  estimatedDelivery: string;
}

/** Stage 2 Shipment & Dispatch Service */
export class ShipmentService {
  isConfigured(): boolean {
    return true;
  }

  create(orderId: string, carrier: string = "India Post Speed Post"): { created: boolean; shipment?: ShipmentRecord; reason?: string } {
    const order = ordersRepo.getOrderById(orderId);
    if (!order) return { created: false, reason: "Order not found." };

    const trackingNumber = `UO-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippedAt = nowIso();
    const estDelivery = new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0];

    const shipment: ShipmentRecord = {
      orderId: order.id,
      trackingNumber,
      carrier,
      status: "manifested",
      shippedAt,
      estimatedDelivery: estDelivery,
    };

    mutate((db) => {
      const match = db.orders.find((o) => o.id === order.id);
      if (match) {
        match.status = "shipped";
        match.updated_at = shippedAt;
      }
      db.order_events.push({
        id: uid(),
        order_id: order.id,
        type: "status_change",
        message: `Dispatched via ${carrier} (AWB: ${trackingNumber}). Estimated delivery: ${estDelivery}.`,
        created_at: shippedAt,
      });

      // Queue outbox shipping notification
      db.outbox_events.push({
        id: uid(),
        type: "order_shipped",
        payload: {
          email: order.email,
          orderNumber: order.order_number,
          trackingNote: `Dispatched via ${carrier}. Tracking AWB: ${trackingNumber}`,
        },
        processed_at: null,
        created_at: shippedAt,
      });
    });

    return { created: true, shipment };
  }

  track(orderNumberOrAwb: string): { found: boolean; milestones: { status: string; date: string; message: string }[] } {
    const db = loadDb();
    const order = db.orders.find(
      (o) => o.order_number.toLowerCase() === orderNumberOrAwb.toLowerCase() || o.id === orderNumberOrAwb,
    );
    if (!order) return { found: false, milestones: [] };

    const events = ordersRepo.listOrderEvents(order.id);
    return {
      found: true,
      milestones: events.map((e) => ({
        status: e.type,
        date: e.created_at,
        message: e.message,
      })),
    };
  }
}

export const shipmentService = new ShipmentService();

