import { loadDb } from "@/lib/db/store";

export class ReviewService {
  listPublished(productId: string) {
    return loadDb().reviews.filter((r) => r.product_id === productId && r.published);
  }

  average(productId: string) {
    const rows = this.listPublished(productId);
    if (!rows.length) return { average: 0, count: 0 };
    const sum = rows.reduce((s, r) => s + r.rating, 0);
    return { average: Math.round((sum / rows.length) * 10) / 10, count: rows.length };
  }
}

export const reviewService = new ReviewService();
