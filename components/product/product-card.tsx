import Link from "next/link";
import Image from "next/image";
import { formatPrice, discountPercent, formatUnitPrice } from "@/lib/formatters";
import type { ProductCard as Card } from "@/lib/services/catalog";
import { CardAddToCart } from "./card-add-to-cart";
import { WishlistButton } from "./wishlist-button";
import { Sprout } from "lucide-react";

export function ProductCard({ card }: { card: Card }) {
  const isOutOfStock =
    card.variant.status !== "active" ||
    (typeof card.variant.stock_qty === "number" && card.variant.stock_qty <= 0);

  const discount = discountPercent(card.variant.price_paise, card.variant.compare_at_paise);

  // Derive status badge
  let badgeText: string | null = null;
  if (card.product.is_bestseller) {
    badgeText = "Bestseller";
  } else if (card.tags.length > 0) {
    badgeText = card.tags[0].name;
  } else if (card.product.is_featured) {
    badgeText = "Featured";
  }

  // Derive unit price
  const unitPrice = formatUnitPrice(
    card.variant.price_paise,
    card.variant.weight_grams,
    card.variant.title
  );

  const productUrl = `/product/${card.product.slug}`;

  return (
    <article className="group relative flex flex-col justify-between h-full bg-white rounded-2xl border border-line/70 hover:border-forest/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#faf7f2] overflow-hidden">
        {/* Top Badges */}
        <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between pointer-events-none">
          {badgeText ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold tracking-wider uppercase bg-forest text-cream shadow-xs">
              {badgeText}
            </span>
          ) : (
            <span />
          )}

          {discount != null && discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-bold tracking-wider uppercase bg-terracotta text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Clickable Image */}
        <Link
          href={productUrl}
          className="relative block w-full h-full p-4 flex items-center justify-center cursor-pointer"
          aria-label={`${card.product.tamil_name ? `${card.product.tamil_name} ` : ""}${card.product.name}`}
        >
          {card.image ? (
            <Image
              src={card.image}
              alt={card.product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-ink-soft/60 py-6 select-none">
              <Sprout className="w-8 h-8 text-forest/40 stroke-1 mb-1" />
              <span className="font-serif text-sm">உங்களில் ஒருவர்</span>
              <span className="text-[0.65rem] uppercase tracking-wider text-earth/80 mt-0.5">Ungalil Oruvar</span>
            </div>
          )}

          {/* Sold Out Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-paper-deep/75 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="px-3 py-1 rounded-full bg-charcoal text-cream text-[0.7rem] font-semibold tracking-widest uppercase shadow-sm">
                Sold Out
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Internal Divider */}
      <div className="border-b border-line/60" />

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Wishlist Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[0.68rem] font-medium tracking-[0.12em] uppercase text-earth truncate">
              உங்களில் ஒருவர் · {card.categoryName || "Ungalil Oruvar"}
            </span>
            <WishlistButton variantId={card.variant.id} />
          </div>

          {/* Bilingual Product Title */}
          <Link href={productUrl} className="block group-hover:text-forest transition-colors">
            {card.product.tamil_name ? (
              <div className="space-y-0.5">
                <h3 className="font-tamil font-semibold text-base md:text-lg text-forest leading-snug line-clamp-1">
                  {card.product.tamil_name}
                </h3>
                <p className="font-serif font-normal text-base md:text-lg text-ink leading-snug line-clamp-1">
                  {card.product.name}
                </p>
              </div>
            ) : (
              <h3 className="font-serif font-normal text-base md:text-lg text-ink leading-snug line-clamp-1">
                {card.product.name}
              </h3>
            )}
          </Link>

          {/* Variant Pack Size */}
          {card.variant.title && (
            <p className="text-xs text-ink-soft mt-1">{card.variant.title}</p>
          )}
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-2 border-t border-line/50 space-y-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              {card.variant.compare_at_paise && card.variant.compare_at_paise > card.variant.price_paise ? (
                <p className="text-xs text-ink-soft leading-none mb-1">
                  <span>MRP: </span>
                  <span className="line-through">{formatPrice(card.variant.compare_at_paise)}</span>
                </p>
              ) : null}
              <p className="text-lg sm:text-xl font-bold text-forest tracking-tight leading-none">
                {formatPrice(card.variant.price_paise)}
              </p>
            </div>

            {unitPrice && (
              <span className="text-xs text-ink-soft font-medium pb-0.5 whitespace-nowrap">
                {unitPrice}
              </span>
            )}
          </div>

          {/* Full-width Add to Cart CTA */}
          <CardAddToCart variantId={card.variant.id} isOutOfStock={isOutOfStock} />
        </div>
      </div>
    </article>
  );
}
