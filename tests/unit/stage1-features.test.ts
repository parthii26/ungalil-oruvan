import { describe, it, expect, beforeEach } from "vitest";
import { resetDb } from "@/lib/db/store";
import { listAllOrders, updateOrderStatus } from "@/lib/repositories/orders";
import {
  listAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
} from "@/lib/repositories/coupons";
import {
  listAllVariantsWithProduct,
  updateVariantStock,
  getVariantById,
} from "@/lib/repositories/products";
import {
  createMessage,
  listAllMessages,
  markRead,
  deleteMessage,
  unreadCount,
} from "@/lib/repositories/contact";
import { listAllPages, getPageById, updatePage } from "@/lib/repositories/pages";
import { isPaymentConfigured, createRazorpayOrder, verifyRazorpaySignature } from "@/lib/services/payment";
import { isNotificationsConfigured, sendOrderConfirmation } from "@/lib/services/notifications";
import { generateInvoiceData } from "@/lib/services/invoice";

describe("Stage 1 Features & Stage 2 Scaffold", () => {
  beforeEach(() => {
    resetDb();
  });

  describe("Order Status Workflow", () => {
    it("updates order status and logs order event", () => {
      const orders = listAllOrders();
      expect(orders.length).toBeGreaterThan(0);
      const target = orders[0];

      const updated = updateOrderStatus(target.id, "confirmed", "Admin manually approved order");
      expect(updated).not.toBeNull();
      expect(updated?.status).toBe("confirmed");

      // Verify event was recorded
      const refreshed = listAllOrders().find((o) => o.id === target.id);
      expect(refreshed?.status).toBe("confirmed");
    });
  });

  describe("Coupon Management", () => {
    it("creates, updates, retrieves, and deletes coupons", () => {
      const initialCount = listAllCoupons().length;

      const created = createCoupon({
        code: "TESTFEST20",
        type: "percentage",
        value: 20,
        min_subtotal_paise: 50000,
        max_discount_paise: 10000,
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 86400000).toISOString(),
        usage_limit: 50,
        per_customer_limit: 1,
        product_ids: [],
        category_ids: [],
        is_active: true,
      });

      expect(created.id).toBeDefined();
      expect(listAllCoupons().length).toBe(initialCount + 1);

      const found = getCouponById(created.id);
      expect(found?.code).toBe("TESTFEST20");

      updateCoupon(created.id, { value: 25, is_active: false });
      const updated = getCouponById(created.id);
      expect(updated?.value).toBe(25);
      expect(updated?.is_active).toBe(false);

      deleteCoupon(created.id);
      expect(getCouponById(created.id)).toBeNull();
      expect(listAllCoupons().length).toBe(initialCount);
    });
  });

  describe("Inventory Stock", () => {
    it("updates variant stock quantity", () => {
      const variants = listAllVariantsWithProduct();
      expect(variants.length).toBeGreaterThan(0);
      const targetId = variants[0].variant.id;

      const updated = updateVariantStock(targetId, 120);
      expect(updated?.stock_qty).toBe(120);

      const fetched = getVariantById(targetId);
      expect(fetched?.stock_qty).toBe(120);
    });
  });

  describe("Contact Messages", () => {
    it("submits contact message and manages read/delete lifecycle", () => {
      expect(unreadCount()).toBe(0);

      const msg = createMessage({
        name: "Kavitha",
        email: "kavitha@example.com",
        message: "Do you have organic black rice in stock?",
      });

      expect(msg.id).toBeDefined();
      expect(unreadCount()).toBe(1);

      const all = listAllMessages();
      expect(all.some((m) => m.id === msg.id)).toBe(true);

      markRead(msg.id);
      expect(unreadCount()).toBe(0);

      deleteMessage(msg.id);
      expect(listAllMessages().some((m) => m.id === msg.id)).toBe(false);
    });
  });

  describe("Policy Pages", () => {
    it("retrieves and updates policy pages", () => {
      const pages = listAllPages();
      expect(pages.length).toBeGreaterThanOrEqual(4);

      const privacy = pages.find((p) => p.slug === "privacy");
      expect(privacy).toBeDefined();
      expect(privacy?.body).not.toContain("Development placeholder");

      updatePage(privacy!.id, { title: "Updated Privacy Policy" });
      const updated = getPageById(privacy!.id);
      expect(updated?.title).toBe("Updated Privacy Policy");
    });
  });

  describe("Stage 2 Scaffolding Fallbacks", () => {
    it("handles unconfigured payment gateway gracefully", async () => {
      expect(isPaymentConfigured()).toBe(false);
      const res = await createRazorpayOrder("order-123", 10000);
      expect(res.created).toBe(false);
      expect(res.reason).toContain("Razorpay is not configured");

      const verify = verifyRazorpaySignature({
        razorpay_order_id: "order_1",
        razorpay_payment_id: "pay_1",
        razorpay_signature: "fake_sig",
      });
      expect(verify.verified).toBe(false);
    });

    it("handles unconfigured email notifications gracefully", async () => {
      expect(isNotificationsConfigured()).toBe(false);
      const res = await sendOrderConfirmation({
        to: "customer@example.com",
        orderNumber: "UO-2026-000001",
        totalFormatted: "₹500.00",
        items: [{ name: "Wild Honey", qty: 1, price: "₹500.00" }],
      });
      expect(res.queued).toBe(false);
      expect(res.reason).toContain("Resend is not configured");
    });

    it("formats invoice data accurately", () => {
      const orders = listAllOrders();
      const order = orders[0];
      const invoice = generateInvoiceData(order, []);
      expect(invoice.invoiceNumber).toBe(`INV-${order.order_number}`);
      expect(invoice.orderNumber).toBe(order.order_number);
      expect(invoice.customerEmail).toBe(order.email);
    });
  });
});
