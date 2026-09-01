import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProduct, relatedProducts } from "@/lib/services/catalog";
import { reviewService } from "@/lib/services/reviews";
import { ProductCard } from "@/components/product/product-card";
import { ProductPurchase } from "@/components/product/product-purchase";
import { getSession } from "@/lib/auth/session";
import { isWished } from "@/lib/repositories/wishlists";
import { loadDb } from "@/lib/db/store";
import { getSiteSettings } from "@/lib/services/settings";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { product } = getPublicProduct(slug);
    return {
      title: product.seo_title || product.name,
      description: product.seo_description || product.short_description,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: images.map((i) => i.path),
    brand: { "@type": "Brand", name: settings.brand_name },
    offers: variants
      .filter((v) => v.status === "active")
      .map((v) => ({
        "@type": "Offer",
        sku: v.sku,
        priceCurrency: "INR",
        price: (v.price_paise / 100).toFixed(2),
        availability: "https://schema.org/InStock",
      })),
  };

  return (
    <div className="container-page py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-xs uppercase tracking-widest text-ink-soft">
        <Link href="/shop">Shop</Link>
        {category && (
          <>
            {" / "}
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </>
        )}
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-12">
        <div className="space-y-3">
          {images.length === 0 && <div className="aspect-square bg-paper-deep" />}
          {images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.path} alt={img.alt} className="w-full object-cover" />
          ))}
        </div>
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-forest">{product.name}</h1>
          {product.tamil_name && <p className="mt-2 font-tamil text-xl text-terracotta">{product.tamil_name}</p>}
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

      <div className="mt-20 grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="font-serif text-3xl">Description</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>
          {product.ingredients && (
            <>
              <h3 className="mt-8 label">Ingredients</h3>
              <p>{product.ingredients}</p>
            </>
          )}
          {product.origin && (
            <>
              <h3 className="mt-6 label">Origin</h3>
              <p>{product.origin}</p>
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
            <div className="border border-line p-6">
              <h2 className="font-serif text-3xl">Nutrition</h2>
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

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Questions</h2>
        <div className="mt-6 divide-y divide-line">
          {faqs.map((f) => (
            <details key={f.id} className="py-4">
              <summary className="cursor-pointer font-medium">{f.question}</summary>
              <p className="mt-2 text-ink-soft">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Reviews</h2>
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
        <section className="mt-20">
          <h2 className="font-serif text-3xl mb-8">Related</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((c) => (
              <ProductCard key={c.product.id} card={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
