import Link from "next/link";
import { formatPrice } from "@/lib/formatters";
import type { ProductCard as Card } from "@/lib/services/catalog";
import { CardAddToCart } from "./card-add-to-cart";
import { ProductVisual } from "@/components/story/product-visual";

const FEATURED_TAG_SLUGS = new Set([
  "organic",
  "cold-pressed",
  "traditional",
  "farmer-sourced",
  "no-added-preservatives",
]);

export function ProductCard({ card }: { card: Card }) {
  const displayTags = card.tags.filter((t) => FEATURED_TAG_SLUGS.has(t.slug)).slice(0, 2);
  return (
    <article className="group">
      <Link href={`/product/${card.product.slug}`} className="block" data-hint="View product">
        <ProductVisual src={card.image} alt={card.product.name} origin={card.product.origin} />
        <div className="mt-3 space-y-1 transition-transform duration-300 ease-out group-hover:translate-x-[3px]">
          <p className="text-[0.65rem] tracking-[0.16em] uppercase text-ink-soft">{card.categoryName}</p>
          <h3 className="font-serif text-xl leading-snug">{card.product.name}</h3>
          {card.product.tamil_name && <p className="font-tamil text-sm text-terracotta">{card.product.tamil_name}</p>}
          <p className="text-sm text-ink-soft">{card.variant.title}</p>
          <p className="text-sm">
            {formatPrice(card.variant.price_paise)}
            {card.variant.compare_at_paise && card.variant.compare_at_paise > card.variant.price_paise && (
              <span className="ml-2 text-ink-soft line-through">{formatPrice(card.variant.compare_at_paise)}</span>
            )}
          </p>
          {displayTags.length > 0 && (
            <p className="flex flex-wrap gap-1 pt-1">
              {displayTags.map((t) => (
                <span key={t.slug} className="text-[0.6rem] tracking-widest uppercase border border-line px-1.5 py-0.5">
                  {t.name}
                </span>
              ))}
            </p>
          )}
        </div>
      </Link>
      <CardAddToCart variantId={card.variant.id} />
    </article>
  );
}
