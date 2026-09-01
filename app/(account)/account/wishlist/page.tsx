import { getSession } from "@/lib/auth/session";
import { listWishlistItems } from "@/lib/repositories/wishlists";
import { getVariantById, getProductById, getThumbnail } from "@/lib/repositories/products";
import { formatPrice } from "@/lib/formatters";
import { WishlistButtons } from "./ui";
import Link from "next/link";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await getSession();
  const items = session?.customerId ? listWishlistItems(session.customerId) : [];
  const rows = items
    .map((i) => {
      const variant = getVariantById(i.variant_id);
      const product = variant ? getProductById(variant.product_id) : null;
      if (!variant || !product) return null;
      return { item: i, variant, product, image: getThumbnail(product.id)?.path ?? null };
    })
    .filter(Boolean);

  return (
    <div>
      <h1 className="font-serif text-4xl">Wishlist</h1>
      {rows.length === 0 ? (
        <p className="mt-6 text-ink-soft">Nothing saved yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {rows.map((row) =>
            row ? (
              <li key={row.item.id} className="py-4 flex gap-4 items-center">
                {row.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.image} alt="" className="h-20 w-16 object-cover" />
                )}
                <div className="flex-1">
                  <Link href={`/product/${row.product.slug}`} className="font-serif text-2xl">
                    {row.product.name}
                  </Link>
                  <p className="text-sm">
                    {row.variant.title} · {formatPrice(row.variant.price_paise)}
                  </p>
                </div>
                <WishlistButtons variantId={row.variant.id} />
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
