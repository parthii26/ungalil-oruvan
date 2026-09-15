import { isPaymentConfigured, createRazorpayOrder } from "./payment";
import * as ordersRepo from "@/lib/repositories/orders";
import { inventoryService } from "./inventory";
import { mutate } from "@/lib/db/store";
import { nowIso, uid } from "@/lib/utils";

export interface PaymentIntent {
  provider: "razorpay" | "cod";
  configured: boolean;
  orderId: string;
  amountPaise: number;
  razorpayOrderId?: string;
  testMode?: boolean;
  message: string;
}

/** Stage 2 Payment Gateway Service */
export class PaymentsService {
  isConfigured(): boolean {
    return true;
  }

  async createIntent(orderId: string): Promise<PaymentIntent> {
    const order = ordersRepo.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (isPaymentConfigured()) {
      const razorpayRes = await createRazorpayOrder(order.id, order.grand_total_paise);
      return {
        provider: "razorpay",
        configured: true,
        orderId: order.id,
        amountPaise: order.grand_total_paise,
        razorpayOrderId: razorpayRes.razorpay_order_id,
        testMode: false,
        message: "Razorpay order initialized.",
      };
    }

    return {
      provider: "razorpay",
      configured: true,
      orderId: order.id,
      amountPaise: order.grand_total_paise,
      razorpayOrderId: `rzp_mock_${order.order_number}`,
      testMode: true,
      message: "Sandbox payment mode active. Instant test verification supported.",
    };
  }

  capture(orderId: string, paymentId?: string): { success: boolean; orderId: string; status: string } {
    const order = ordersRepo.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const txId = paymentId ?? `pay_mock_${Date.now()}`;
    const now = nowIso();

    mutate((db) => {
      const match = db.orders.find((o) => o.id === order.id);
      if (match) {
        match.status = "confirmed";
        match.updated_at = now;
      }

      db.order_events.push({
        id: uid(),
        order_id: order.id,
        type: "status_change",
        message: `Payment authorized & captured (${txId}). Order confirmed.`,
        created_at: now,
      });

      // Queue outbox order confirmation
      const items = ordersRepo.listOrderItems(order.id);
      db.outbox_events.push({
        id: uid(),
        type: "order_confirmation",
        payload: {
          email: order.email,
          orderNumber: order.order_number,
          totalFormatted: `₹${(order.grand_total_paise / 100).toFixed(2)}`,
          items: items.map((i) => ({
            name: `${i.product_name} (${i.variant_title})`,
            qty: i.quantity,
            price: `₹${(i.line_total_paise / 100).toFixed(2)}`,
          })),
        },
        processed_at: null,
        created_at: now,
      });
    });

    // Deduct inventory stock via FEFO
    inventoryService.commit(order.id);

    return { success: true, orderId: order.id, status: "confirmed" };
  }
}

export const paymentsService = new PaymentsService();

