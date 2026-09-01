import { loadDb, mutate } from "@/lib/db/store";
import { nowIso, uid } from "@/lib/utils";

export function getWishlist(customerId: string) {
  const db = loadDb();
  let list = db.wishlists.find((w) => w.customer_id === customerId);
  if (!list) {
    list = mutate((d) => {
      const row = { id: uid(), customer_id: customerId, created_at: nowIso() };
      d.wishlists.push(row);
      return row;
    });
  }
  return list;
}

export function listWishlistItems(customerId: string) {
  const list = getWishlist(customerId);
  return loadDb().wishlist_items.filter((i) => i.wishlist_id === list.id);
}

export function addWishlistItem(customerId: string, variantId: string) {
  return mutate((db) => {
    let list = db.wishlists.find((w) => w.customer_id === customerId);
    if (!list) {
      list = { id: uid(), customer_id: customerId, created_at: nowIso() };
      db.wishlists.push(list);
    }
    const exists = db.wishlist_items.find((i) => i.wishlist_id === list!.id && i.variant_id === variantId);
    if (exists) return exists;
    const row = { id: uid(), wishlist_id: list.id, variant_id: variantId, created_at: nowIso() };
    db.wishlist_items.push(row);
    return row;
  });
}

export function removeWishlistItem(customerId: string, variantId: string) {
  mutate((db) => {
    const list = db.wishlists.find((w) => w.customer_id === customerId);
    if (!list) return;
    db.wishlist_items = db.wishlist_items.filter(
      (i) => !(i.wishlist_id === list.id && i.variant_id === variantId),
    );
  });
}

export function isWished(customerId: string, variantId: string) {
  return listWishlistItems(customerId).some((i) => i.variant_id === variantId);
}
