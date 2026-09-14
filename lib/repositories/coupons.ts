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

export function listAllCoupons() {
  return loadDb().coupons.sort((a, b) => a.code.localeCompare(b.code));
}

export function getCouponById(id: string) {
  return loadDb().coupons.find((c) => c.id === id) ?? null;
}

export function createCoupon(input: Omit<import("@/lib/db/types").Coupon, "id" | "created_at">) {
  return mutate((db) => {
    const row: import("@/lib/db/types").Coupon = {
      ...input,
      id: uid(),
      created_at: nowIso(),
    };
    db.coupons.push(row);
    return row;
  });
}

export function updateCoupon(id: string, patch: Partial<Omit<import("@/lib/db/types").Coupon, "id" | "created_at">>) {
  return mutate((db) => {
    const row = db.coupons.find((c) => c.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  });
}

export function deleteCoupon(id: string) {
  mutate((db) => {
    db.coupons = db.coupons.filter((c) => c.id !== id);
  });
}

