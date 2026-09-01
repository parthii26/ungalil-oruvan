import { loadDb, mutate } from "@/lib/db/store";
import type { Cart } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

const MAX_QTY = 20;

export function findCart(opts: { customerId?: string | null; sessionId?: string | null }) {
  const db = loadDb();
  if (opts.customerId) {
    const owned = db.carts.find((c) => c.customer_id === opts.customerId);
    if (owned) return owned;
  }
  if (opts.sessionId) return db.carts.find((c) => c.session_id === opts.sessionId && !c.customer_id) ?? null;
  return null;
}

export function getOrCreateCart(opts: { customerId?: string | null; sessionId?: string | null }): Cart {
  const existing = findCart(opts);
  if (existing) return existing;
  return mutate((db) => {
    const now = nowIso();
    const cart: Cart = {
      id: uid(),
      customer_id: opts.customerId ?? null,
      session_id: opts.customerId ? null : opts.sessionId ?? uid(),
      created_at: now,
      updated_at: now,
    };
    db.carts.push(cart);
    return cart;
  });
}

export function listItems(cartId: string) {
  return loadDb().cart_items.filter((i) => i.cart_id === cartId);
}

export function addItem(cartId: string, variantId: string, quantity: number) {
  return mutate((db) => {
    const existing = db.cart_items.find((i) => i.cart_id === cartId && i.variant_id === variantId);
    const now = nowIso();
    if (existing) {
      existing.quantity = Math.min(MAX_QTY, existing.quantity + quantity);
      existing.updated_at = now;
      return existing;
    }
    const row = {
      id: uid(),
      cart_id: cartId,
      variant_id: variantId,
      quantity: Math.min(MAX_QTY, quantity),
      created_at: now,
      updated_at: now,
    };
    db.cart_items.push(row);
    const cart = db.carts.find((c) => c.id === cartId);
    if (cart) cart.updated_at = now;
    return row;
  });
}

export function setItemQty(itemId: string, quantity: number) {
  return mutate((db) => {
    const item = db.cart_items.find((i) => i.id === itemId);
    if (!item) return null;
    if (quantity <= 0) {
      db.cart_items = db.cart_items.filter((i) => i.id !== itemId);
      return null;
    }
    item.quantity = Math.min(MAX_QTY, quantity);
    item.updated_at = nowIso();
    return item;
  });
}

export function removeItem(itemId: string) {
  mutate((db) => {
    db.cart_items = db.cart_items.filter((i) => i.id !== itemId);
  });
}

export function clearCart(cartId: string) {
  mutate((db) => {
    db.cart_items = db.cart_items.filter((i) => i.cart_id !== cartId);
  });
}

export function mergeGuestIntoCustomer(sessionId: string, customerId: string) {
  return mutate((db) => {
    const guest = db.carts.find((c) => c.session_id === sessionId && !c.customer_id);
    let customerCart = db.carts.find((c) => c.customer_id === customerId);
    if (!customerCart) {
      customerCart = {
        id: uid(),
        customer_id: customerId,
        session_id: null,
        created_at: nowIso(),
        updated_at: nowIso(),
      };
      db.carts.push(customerCart);
    }
    if (!guest || guest.id === customerCart.id) return customerCart;
    const guestItems = db.cart_items.filter((i) => i.cart_id === guest.id);
    for (const gi of guestItems) {
      const existing = db.cart_items.find(
        (i) => i.cart_id === customerCart!.id && i.variant_id === gi.variant_id,
      );
      if (existing) {
        existing.quantity = Math.min(MAX_QTY, existing.quantity + gi.quantity);
        existing.updated_at = nowIso();
      } else {
        gi.cart_id = customerCart.id;
      }
    }
    db.cart_items = db.cart_items.filter((i) => i.cart_id !== guest.id);
    db.carts = db.carts.filter((c) => c.id !== guest.id);
    return customerCart;
  });
}

export const CART_MAX_QTY = MAX_QTY;
