import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProduct, relatedProducts } from "@/lib/services/catalog";
import { reviewService } from "@/lib/services/reviews";
import { ProductCard } from "@/components/product/product-card";
import { ProductPurchase } from "@/components/product/product-purchase";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { formatPrice } from "@/lib/formatters";
import { getSession } from "@/lib/auth/session";
import { isWished } from "@/lib/repositories/wishlists";
import { loadDb } from "@/lib/db/store";
import { getSiteSettings } from "@/lib/services/settings";
import Image from "next/image";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { product } = getPublicProduct(slug);
    const settings = getSiteSettings();
    const title = product.seo_title || product.name;
    const description = product.seo_description || product.short_description;
    return {
      title,
      description,
      alternates: { canonical: `/product/${slug}` },
      openGraph: {
        title,
        description,
        url: `/product/${slug}`,
        siteName: settings.brand_name,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data;
  try {
    data = getPublicProduct(slug);
  } catch {
    notFound();
  }
  const { product, variants, images, nutrition, certifications, tags, category } = data;
  const related = relatedProducts(product.id, product.category_id);
  const reviews = reviewService.listPublished(product.id);
  const rating = reviewService.average(product.id);
  const session = await getSession();
  const wished = session?.customerId ? isWished(session.customerId, variants[0]?.id ?? "") : false;
  const faqs = loadDb().faqs.filter((f) => f.published).slice(0, 3);
  const settings = getSiteSettings();

  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/product/${slug}`;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: images.map((i) => `${siteUrl}${i.path}`),
    url: canonical,
    brand: { "@type": "Brand", name: settings.brand_name },
    offers: variants
      .filter((v) => v.status === "active")
      .map((v) => ({
        "@type": "Offer",
        url: canonical,
        sku: v.sku,
        priceCurrency: "INR",
        price: (v.price_paise / 100).toFixed(2),
        availability: "https://schema.org/InStock",
      })),
  };
  if (rating.count > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.average,
      reviewCount: rating.count,
    };
  }

  const defaultVariant = variants.find((v) => v.status === "active") ?? variants[0];

  return (
    <div className="container-page pt-8 pb-24 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-ink-soft">
        <Link href="/shop" className="inline-flex min-h-11 items-center">Shop</Link>
        {category && (
          <>
            {" / "}
            <Link href={`/category/${category.slug}`} className="inline-flex min-h-11 items-center">{category.name}</Link>
          </>
        )}
      </nav>

      <div className="mt-4 md:mt-6 grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-3">
          {images.length === 0 && <div className="aspect-square bg-paper-deep" />}
          {images.map((img, i) => (
            <div key={img.id} className="relative aspect-square w-full bg-paper-deep">
              <Image
                src={img.path}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div>
          {product.tamil_name ? (
            <>
              <h1 className="font-tamil text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-forest text-balance">{product.tamil_name}</h1>
              <p className="mt-1 font-serif text-xl md:text-2xl text-terracotta">{product.name}</p>
            </>
          ) : (
            <h1 className="font-serif text-[1.9rem] leading-tight md:text-5xl text-forest text-balance">{product.name}</h1>
          )}
          {rating.count > 0 && (
            <p className="mt-2 text-sm text-ink-soft">
              {rating.average} / 5 · {rating.count} review{rating.count === 1 ? "" : "s"}
            </p>
          )}
          <p className="mt-4 text-ink-soft leading-relaxed">{product.short_description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t.id} className="text-[0.65rem] tracking-widest uppercase border border-line px-2 py-1">
                {t.name}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <ProductPurchase variants={variants} wished={wished} />
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-20 grid md:grid-cols-2 gap-8 md:gap-12">
        <section>
          <h2 className="font-serif text-2xl md:text-3xl">Description</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>
          {product.ingredients && (
            <>
              <h3 className="mt-8 label">Ingredients</h3>
              <p>{product.ingredients}</p>
            </>
          )}
          {product.storage_instructions && (
            <>
              <h3 className="mt-6 label">Storage</h3>
              <p>{product.storage_instructions}</p>
              {product.shelf_life && <p className="text-sm text-ink-soft">Shelf life {product.shelf_life}</p>}
            </>
          )}
        </section>
        <section>
          {nutrition && (
            <div className="border border-line p-5 md:p-6">
              <h2 className="font-serif text-2xl md:text-3xl">Nutrition</h2>
              <p className="text-sm text-ink-soft mt-1">Per {nutrition.serving}</p>
              <dl className="mt-4 divide-y divide-line">
                {[
                  ["Energy", nutrition.energy_kcal != null ? `${nutrition.energy_kcal} kcal` : null],
                  ["Protein", nutrition.protein_g != null ? `${nutrition.protein_g} g` : null],
                  ["Carbohydrates", nutrition.carbohydrates_g != null ? `${nutrition.carbohydrates_g} g` : null],
                  ["Fat", nutrition.fat_g != null ? `${nutrition.fat_g} g` : null],
                  ["Fibre", nutrition.fiber_g != null ? `${nutrition.fiber_g} g` : null],
                  ["Sugar", nutrition.sugar_g != null ? `${nutrition.sugar_g} g` : null],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between py-2 text-sm">
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
          {certifications.length > 0 && (
            <div className="mt-8">
              <h3 className="label">Certification</h3>
              <ul className="mt-2 space-y-2">
                {certifications.map((c) => (
                  <li key={c.id}>
                    {c.name}
                    {c.number ? ` · ${c.number}` : ""}
                    {c.valid_until ? ` · until ${c.valid_until}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8">
            <h3 className="label">Shipping</h3>
            <p className="text-sm text-ink-soft">Courier booking is a Stage 2 integration. Stage 1 creates a pending-payment order only.</p>
          </div>
        </section>
      </div>

      <section className="mt-12 md:mt-16">
        <h2 className="font-serif text-2xl md:text-3xl">Questions</h2>
        <div className="mt-4 md:mt-6 divide-y divide-line border-b border-line">
          {faqs.map((f) => (
            <details key={f.id} className="py-2">
              <summary className="font-medium">{f.question}</summary>
              <p className="mt-1 pb-3 text-ink-soft">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="font-serif text-2xl md:text-3xl">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-ink-soft">No published reviews yet.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="border-t border-line pt-4">
                <p className="text-sm">{r.rating} / 5</p>
                <p className="font-serif text-2xl">{r.title}</p>
                <p className="mt-2 text-ink-soft">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-12 md:mt-20">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 md:mb-8">Related</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((c) => (
              <ProductCard key={c.product.id} card={c} />
            ))}
          </div>
        </section>
      )}
      {defaultVariant && (
        <StickyBuyBar price={formatPrice(defaultVariant.price_paise)} variantTitle={defaultVariant.title} />
      )}
    </div>
  );
}
