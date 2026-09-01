import { loadDb, mutate } from "@/lib/db/store";
import { nowIso, uid } from "@/lib/utils";

export function findCouponByCode(code: string) {
  return loadDb().coupons.find((c) => c.code.toUpperCase() === code.toUpperCase()) ?? null;
}

export function countRedemptions(couponId: string, customerId?: string | null) {
  const rows = loadDb().coupon_redemptions.filter((r) => r.coupon_id === couponId);
  if (customerId) return rows.filter((r) => r.customer_id === customerId).length;
  return rows.length;
}

export function recordRedemption(couponId: string, customerId: string | null, orderId: string) {
  mutate((db) => {
    db.coupon_redemptions.push({
      id: uid(),
      coupon_id: couponId,
      customer_id: customerId,
      order_id: orderId,
      created_at: nowIso(),
    });
  });
}
