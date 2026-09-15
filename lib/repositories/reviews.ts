import { loadDb, mutate } from "@/lib/db/store";
import type { Review } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function listReviewsForCustomer(customerId: string): Review[] {
  return loadDb()
    .reviews.filter((r) => r.customer_id === customerId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listReviewsForProduct(productId: string): Review[] {
  return loadDb()
    .reviews.filter((r) => r.product_id === productId && r.published)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createReview(
  input: Omit<Review, "id" | "created_at">,
): Review {
  return mutate((db) => {
    const row: Review = {
      ...input,
      id: uid(),
      created_at: nowIso(),
    };
    db.reviews.push(row);
    return row;
  });
}

export function deleteReview(id: string, customerId?: string): boolean {
  return mutate((db) => {
    const idx = db.reviews.findIndex(
      (r) => r.id === id && (!customerId || r.customer_id === customerId),
    );
    if (idx === -1) return false;
    db.reviews.splice(idx, 1);
    return true;
  });
}
