import { addPaise, mulQty, percentOf, minPaise, type Paise } from "@/lib/money";
import type { Coupon } from "@/lib/db/types";
import { getSettings } from "@/lib/repositories/settings";
import * as productsRepo from "@/lib/repositories/products";

export interface PricedLine {
  variant_id: string;
  product_id: string;
  product_name: string;
  variant_title: string;
  sku: string;
  quantity: number;
  unit_price_paise: Paise;
  line_total_paise: Paise;
  category_id: string;
}

export interface PriceQuote {
  lines: PricedLine[];
  subtotal_paise: Paise;
  discount_paise: Paise;
  tax_paise: Paise;
  shipping_paise: Paise;
  grand_total_paise: Paise;
  coupon_code: string | null;
  shipping_note: string;
  tax_note: string;
}

export function priceLines(items: { variant_id: string; quantity: number }[]): PricedLine[] {
  return items.map((item) => {
    const variant = productsRepo.getVariantById(item.variant_id);
    if (!variant) throw new Error("Unknown variant in cart");
    const product = productsRepo.getProductById(variant.product_id);
    if (!product) throw new Error("Unknown product in cart");
    const unit = variant.price_paise;
    return {
      variant_id: variant.id,
      product_id: product.id,
      product_name: product.name,
      variant_title: variant.title,
      sku: variant.sku,
      quantity: item.quantity,
      unit_price_paise: unit,
      line_total_paise: mulQty(unit, item.quantity),
      category_id: product.category_id,
    };
  });
}

export function applyCouponToSubtotal(
  lines: PricedLine[],
  coupon: Coupon | null,
): { discount: Paise; eligible: Paise } {
  if (!coupon) return { discount: 0, eligible: 0 };
  let eligibleLines = lines;
  if (coupon.product_ids.length) {
    eligibleLines = lines.filter((l) => coupon.product_ids.includes(l.product_id));
  } else if (coupon.category_ids.length) {
    eligibleLines = lines.filter((l) => coupon.category_ids.includes(l.category_id));
  }
  const eligible = eligibleLines.reduce((s, l) => addPaise(s, l.line_total_paise), 0);
  if (eligible < coupon.min_subtotal_paise) return { discount: 0, eligible };
  let discount: Paise = 0;
  if (coupon.type === "percentage") {
    discount = percentOf(eligible, coupon.value * 100);
  } else {
    discount = coupon.value;
  }
  if (coupon.max_discount_paise != null) discount = minPaise(discount, coupon.max_discount_paise);
  if (discount > eligible) discount = eligible;
  return { discount, eligible };
}

export function quote(input: {
  items: { variant_id: string; quantity: number }[];
  coupon?: Coupon | null;
}): PriceQuote {
  const settings = getSettings();
  const lines = priceLines(input.items);
  const subtotal = lines.reduce((s, l) => addPaise(s, l.line_total_paise), 0);
  const { discount } = applyCouponToSubtotal(lines, input.coupon ?? null);
  const afterDiscount = subtotal - discount;
  const tax = 0;
  let shipping = 0;
  let shipping_note = "Shipping is estimated. Live rates are a Stage 2 integration.";
  if (afterDiscount <= 0) {
    shipping = 0;
  } else if (afterDiscount >= settings.free_shipping_over_paise) {
    shipping = 0;
    shipping_note = `Estimated free shipping over ${settings.free_shipping_over_paise / 100} rupees. Confirmed after payment.`;
  } else {
    shipping = settings.flat_shipping_paise;
    shipping_note = "Estimated flat shipping. Not charged until Stage 2 payment.";
  }
  return {
    lines,
    subtotal_paise: subtotal,
    discount_paise: discount,
    tax_paise: tax,
    shipping_paise: shipping,
    grand_total_paise: addPaise(afterDiscount, tax, shipping),
    coupon_code: input.coupon?.code ?? null,
    shipping_note,
    tax_note: "Tax breakdown is not configured. Stage 2 GST settings will apply.",
  };
}
