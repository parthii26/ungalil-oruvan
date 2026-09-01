import { BusinessRuleError } from "@/lib/errors";
import * as couponsRepo from "@/lib/repositories/coupons";
import type { Coupon } from "@/lib/db/types";
import { applyCouponToSubtotal, priceLines } from "./pricing";

export function validateCoupon(
  code: string,
  items: { variant_id: string; quantity: number }[],
  customerId: string | null,
): Coupon {
  const coupon = couponsRepo.findCouponByCode(code.trim());
  if (!coupon || !coupon.is_active) {
    throw new BusinessRuleError("This coupon is not valid.");
  }
  const now = Date.now();
  if (now < Date.parse(coupon.starts_at) || now > Date.parse(coupon.ends_at)) {
    throw new BusinessRuleError("This coupon is not valid right now.");
  }
  if (coupon.usage_limit != null && couponsRepo.countRedemptions(coupon.id) >= coupon.usage_limit) {
    throw new BusinessRuleError("This coupon has reached its usage limit.");
  }
  if (
    customerId &&
    coupon.per_customer_limit != null &&
    couponsRepo.countRedemptions(coupon.id, customerId) >= coupon.per_customer_limit
  ) {
    throw new BusinessRuleError("You have already used this coupon.");
  }
  const lines = priceLines(items);
  const { discount } = applyCouponToSubtotal(lines, coupon);
  if (discount <= 0) {
    throw new BusinessRuleError("This coupon does not apply to the current cart.");
  }
  return coupon;
}
