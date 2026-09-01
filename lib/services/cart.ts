import { BusinessRuleError, UnauthorizedError } from "@/lib/errors";
import * as cartsRepo from "@/lib/repositories/carts";
import * as productsRepo from "@/lib/repositories/products";
import { assertPurchasable } from "./catalog";
import { quote, type PriceQuote } from "./pricing";
import { validateCoupon } from "./coupons";
import type { Coupon } from "@/lib/db/types";

export interface CartViewItem {
  item_id: string;
  variant_id: string;
  quantity: number;
  product_name: string;
  product_slug: string;
  variant_title: string;
  sku: string;
  unit_price_paise: number;
  image: string | null;
}

export interface CartView {
  cart_id: string;
  items: CartViewItem[];
  quote: PriceQuote;
}

export function resolveCart(opts: { customerId?: string | null; sessionId?: string | null }) {
  return cartsRepo.getOrCreateCart(opts);
}

export function viewCart(
  opts: { customerId?: string | null; sessionId?: string | null },
  couponCode?: string | null,
): CartView {
  const cart = cartsRepo.getOrCreateCart(opts);
  const raw = cartsRepo.listItems(cart.id);
  const items: CartViewItem[] = [];
  for (const row of raw) {
    const variant = productsRepo.getVariantById(row.variant_id);
    const product = variant ? productsRepo.getProductById(variant.product_id) : null;
    if (!variant || !product || product.status !== "published" || variant.status !== "active") {
      continue;
    }
    items.push({
      item_id: row.id,
      variant_id: variant.id,
      quantity: row.quantity,
      product_name: product.name,
      product_slug: product.slug,
      variant_title: variant.title,
      sku: variant.sku,
      unit_price_paise: variant.price_paise,
      image: productsRepo.getThumbnail(product.id)?.path ?? null,
    });
  }
  let coupon: Coupon | null = null;
  if (couponCode) {
    try {
      coupon = validateCoupon(
        couponCode,
        items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
        opts.customerId ?? null,
      );
    } catch {
      coupon = null;
    }
  }
  return {
    cart_id: cart.id,
    items,
    quote: quote({
      items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
      coupon,
    }),
  };
}

export function addToCart(
  opts: { customerId?: string | null; sessionId?: string | null },
  variantId: string,
  quantity: number,
) {
  assertPurchasable(variantId);
  if (quantity < 1) throw new BusinessRuleError("Quantity must be at least 1.");
  const cart = cartsRepo.getOrCreateCart(opts);
  return cartsRepo.addItem(cart.id, variantId, quantity);
}

export function updateQty(itemId: string, quantity: number, owner: { customerId?: string | null; sessionId?: string | null }) {
  const cart = cartsRepo.findCart(owner);
  if (!cart) throw new BusinessRuleError("Cart not found.");
  const item = cartsRepo.listItems(cart.id).find((i) => i.id === itemId);
  if (!item) throw new BusinessRuleError("Item not found.");
  return cartsRepo.setItemQty(itemId, quantity);
}

export function removeFromCart(itemId: string, owner: { customerId?: string | null; sessionId?: string | null }) {
  const cart = cartsRepo.findCart(owner);
  if (!cart) return;
  const item = cartsRepo.listItems(cart.id).find((i) => i.id === itemId);
  if (!item) return;
  cartsRepo.removeItem(itemId);
}

export function emptyCart(owner: { customerId?: string | null; sessionId?: string | null }) {
  const cart = cartsRepo.findCart(owner);
  if (cart) cartsRepo.clearCart(cart.id);
}

export function mergeOnLogin(sessionId: string | null, customerId: string) {
  if (!sessionId) return;
  cartsRepo.mergeGuestIntoCustomer(sessionId, customerId);
}

export function requireCustomer(customerId: string | null | undefined): string {
  if (!customerId) throw new UnauthorizedError();
  return customerId;
}
