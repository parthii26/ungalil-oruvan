"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { createReview, deleteReview } from "@/lib/repositories/reviews";
import { getProductById } from "@/lib/repositories/products";
import { ForbiddenError, ValidationError, toUserMessage } from "@/lib/errors";

export async function submitReviewAction(_prev: unknown, formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.customerId) {
      throw new ForbiddenError("You must be logged in to leave a review.");
    }

    const productId = String(formData.get("product_id") || "").trim();
    const rating = parseInt(String(formData.get("rating") || "5"), 10);
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();

    if (!productId) throw new ValidationError("Product is required.");
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new ValidationError("Please choose a rating between 1 and 5 stars.");
    }
    if (!title || title.length < 2) throw new ValidationError("Please enter a short headline.");
    if (!body || body.length < 5) throw new ValidationError("Please write your review feedback.");

    const product = getProductById(productId);
    if (!product) throw new ValidationError("Product not found.");

    createReview({
      product_id: productId,
      customer_id: session.customerId,
      rating,
      title,
      body,
      published: true,
    });

    revalidatePath("/account/reviews");
    revalidatePath(`/product/${product.slug}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: toUserMessage(e) };
  }
}

export async function deleteReviewAction(id: string) {
  const session = await getSession();
  if (!session?.customerId) throw new ForbiddenError("Not authorized.");
  deleteReview(id, session.customerId);
  revalidatePath("/account/reviews");
}
