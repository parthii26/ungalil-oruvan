import { BusinessRuleError } from "@/lib/errors";
import type { AddressSnapshot } from "@/lib/db/types";
import * as ordersRepo from "@/lib/repositories/orders";
import * as couponsRepo from "@/lib/repositories/coupons";
import * as cartsRepo from "@/lib/repositories/carts";
import { viewCart } from "./cart";
import { validateCoupon } from "./coupons";
import { quote } from "./pricing";
import { assertPurchasable } from "./catalog";

export function checkoutPending(input: {
  customerId: string | null;
  sessionId: string | null;
  email: string;
  address: AddressSnapshot;
  couponCode?: string | null;
  notes?: string | null;
  idempotencyKey: string;
}) {
  if (input.idempotencyKey) {
    const existing = ordersRepo.findByIdempotency(input.idempotencyKey, input.customerId);
    if (existing) return existing;
  }

  const cart = viewCart({ customerId: input.customerId, sessionId: input.sessionId });
  if (!cart.items.length) throw new BusinessRuleError("Your cart is empty.");

  for (const item of cart.items) {
    assertPurchasable(item.variant_id);
  }

  let coupon = null;
  if (input.couponCode) {
    coupon = validateCoupon(
      input.couponCode,
      cart.items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
      input.customerId,
    );
  }

  const priced = quote({
    items: cart.items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
    coupon,
  });

  const order = ordersRepo.insertOrder(
    {
      customer_id: input.customerId,
      email: input.email,
      status: "pending_payment",
      coupon_code: priced.coupon_code,
      subtotal_paise: priced.subtotal_paise,
      discount_paise: priced.discount_paise,
      tax_paise: priced.tax_paise,
      shipping_paise: priced.shipping_paise,
      grand_total_paise: priced.grand_total_paise,
      shipping_address: input.address,
      billing_address: input.address,
      notes: input.notes ?? null,
      idempotency_key: input.idempotencyKey,
    },
    priced.lines.map((l) => ({
      variant_id: l.variant_id,
      product_name: l.product_name,
      variant_title: l.variant_title,
      sku: l.sku,
      quantity: l.quantity,
      unit_price_paise: l.unit_price_paise,
      discount_paise: 0,
      tax_paise: 0,
      line_total_paise: l.line_total_paise,
    })),
  );

  if (coupon) {
    couponsRepo.recordRedemption(coupon.id, input.customerId, order.id);
  }

  const rawCart = cartsRepo.findCart({ customerId: input.customerId, sessionId: input.sessionId });
  if (rawCart) cartsRepo.clearCart(rawCart.id);

  return order;
}
