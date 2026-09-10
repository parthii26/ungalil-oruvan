import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/repositories/categories";
import { searchCatalog } from "@/lib/services/catalog";
import { ProductCard } from "@/components/product/product-card";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat || !cat.is_active) notFound();
  const result = searchCatalog({ category: slug, pageSize: 24 });

  return (
    <div>
      <div className="relative h-60 md:h-[28rem] bg-paper-deep overflow-hidden">
        {cat.image_path && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cat.image_path} alt="" fetchPriority="high" decoding="async" className="h-full w-full object-cover scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0">
          <div className="container-page text-cream">
            <p className="text-[0.68rem] tracking-[0.2em] uppercase text-turmeric">Pantry</p>
            <h1 className="font-serif text-4xl md:text-5xl text-balance">{cat.name}</h1>
            <p className="mt-2 max-w-xl text-cream/85">{cat.description}</p>
            <p className="mt-2 text-sm opacity-80">{result.total} products</p>
          </div>
        </div>
      </div>
      <div className="container-page py-10 md:py-14">
        {result.items.length === 0 ? (
          <p className="text-ink-soft">No published products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {result.items.map((c) => (
              <ProductCard key={c.product.id} card={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
