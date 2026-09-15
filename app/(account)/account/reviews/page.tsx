import { getSession } from "@/lib/auth/session";
import { listReviewsForCustomer } from "@/lib/repositories/reviews";
import { listPublishedProducts } from "@/lib/repositories/products";
import { formatDate } from "@/lib/formatters";
import { deleteReviewAction } from "@/lib/actions/reviews";
import { ReviewForm } from "./review-form";
import Link from "next/link";

export const metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const session = await getSession();
  const customerId = session?.customerId ?? "";

  const reviews = customerId ? listReviewsForCustomer(customerId) : [];
  const products = listPublishedProducts();

  // Create lookup for product names
  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Product Reviews</h1>
      <p className="mt-2 text-sm text-ink-soft mb-6">
        Share your experience on taste, quality, and traditional benefits with other customers.
      </p>

      {/* Review submission panel */}
      <ReviewForm products={products} />

      {/* Existing Reviews List */}
      <h2 className="font-serif text-2xl mt-10 mb-4">Your Reviews ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="text-ink-soft text-sm">You have not written any reviews yet.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {reviews.map((r) => {
            const product = productMap.get(r.product_id);
            return (
              <li key={r.id} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    {product ? (
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-medium text-base hover:underline"
                      >
                        {product.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-base">Product</span>
                    )}
                    <span className="ml-3 text-amber-600 font-serif">
                      {"★".repeat(r.rating)}
                      <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                    </span>
                  </div>
                  <span className="text-xs text-ink-soft">{formatDate(r.created_at)}</span>
                </div>

                <p className="font-medium text-sm mt-2">{r.title}</p>
                <p className="text-sm text-ink-soft mt-1 leading-relaxed">{r.body}</p>

                <div className="mt-3">
                  <form
                    action={async () => {
                      "use server";
                      await deleteReviewAction(r.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-ink-soft hover:text-red-700 underline underline-offset-4"
                    >
                      Delete review
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
