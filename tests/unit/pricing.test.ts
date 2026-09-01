import { describe, expect, it, beforeAll } from "vitest";
import { resetDb } from "../../lib/db/store";
import { quote } from "../../lib/services/pricing";
import { validateCoupon } from "../../lib/services/coupons";
import { checkoutPending } from "../../lib/services/checkout";
import { findByIdempotency } from "../../lib/repositories/orders";
import * as cartsRepo from "../../lib/repositories/carts";
import { updateProduct, getProductById } from "../../lib/repositories/products";
import { searchCatalog } from "../../lib/services/catalog";
import { BusinessRuleError } from "../../lib/errors";

beforeAll(() => {
  resetDb();
});

describe("pricing and coupons", () => {
  it("ignores any client-supplied price and uses catalogue", () => {
    const q = quote({ items: [{ variant_id: "prod-honey-v1", quantity: 1 }] });
    expect(q.lines[0].unit_price_paise).toBe(34900);
    expect(q.subtotal_paise).toBe(34900);
  });

  it("applies WELCOME10 when subtotal qualifies", () => {
    const items = [
      { variant_id: "prod-honey-v1", quantity: 1 },
      { variant_id: "prod-cashew-v1", quantity: 1 },
    ];
    const coupon = validateCoupon("WELCOME10", items, null);
    const q = quote({ items, coupon });
    expect(q.discount_paise).toBeGreaterThan(0);
    expect(q.discount_paise).toBeLessThanOrEqual(20000);
  });

  it("rejects expired coupon", () => {
    expect(() => validateCoupon("OLD50", [{ variant_id: "prod-honey-v1", quantity: 1 }], null)).toThrow(
      BusinessRuleError,
    );
  });

  it("rejects empty cart checkout", () => {
    const cart = cartsRepo.getOrCreateCart({ customerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" });
    cartsRepo.clearCart(cart.id);
    expect(() =>
      checkoutPending({
        customerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        sessionId: "empty-session",
        email: "ananya@varizel.dev",
        address: {
          name: "A",
          phone: "9999999999",
          line1: "line",
          line2: null,
          landmark: null,
          city: "Bengaluru",
          state: "KA",
          postal_code: "560001",
          country: "IN",
        },
        idempotencyKey: "empty-cart-test",
      }),
    ).toThrow(BusinessRuleError);
  });
});

describe("cart merge", () => {
  it("merges duplicate variants", () => {
    resetDb();
    const guest = cartsRepo.getOrCreateCart({ sessionId: "sess-merge" });
    cartsRepo.addItem(guest.id, "prod-honey-v1", 1);
    cartsRepo.addItem(guest.id, "prod-honey-v1", 2);
    const items = cartsRepo.listItems(guest.id);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    const customerCart = cartsRepo.mergeGuestIntoCustomer("sess-merge", "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    const merged = cartsRepo.listItems(customerCart.id);
    const honey = merged.find((i) => i.variant_id === "prod-honey-v1");
    expect(honey).toBeTruthy();
    expect(honey!.quantity).toBeGreaterThanOrEqual(3);
  });
});

describe("checkout idempotency", () => {
  it("creates a pending order once for the same key", () => {
    resetDb();
    const cart = cartsRepo.getOrCreateCart({ customerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" });
    cartsRepo.clearCart(cart.id);
    cartsRepo.addItem(cart.id, "prod-honey-v1", 1);
    const input = {
      customerId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      sessionId: null as string | null,
      email: "ananya@varizel.dev",
      address: {
        name: "Ananya Rao",
        phone: "9876500001",
        line1: "12 Indiranagar",
        line2: null,
        landmark: null,
        city: "Bengaluru",
        state: "Karnataka",
        postal_code: "560038",
        country: "IN",
      },
      idempotencyKey: "idem-1",
    };
    const a = checkoutPending(input);
    cartsRepo.addItem(cart.id, "prod-oil-v1", 1);
    const b = checkoutPending(input);
    expect(a.id).toBe(b.id);
    expect(findByIdempotency("idem-1", input.customerId)?.id).toBe(a.id);
    expect(a.status).toBe("pending_payment");
  });
});

describe("visibility", () => {
  it("does not list draft products publicly", () => {
    resetDb();
    updateProduct("prod-honey", { status: "draft" });
    expect(getProductById("prod-honey")?.status).toBe("draft");
    const res = searchCatalog({ q: "honey" });
    expect(res.items.find((i) => i.product.id === "prod-honey")).toBeUndefined();
    resetDb();
  });
});
