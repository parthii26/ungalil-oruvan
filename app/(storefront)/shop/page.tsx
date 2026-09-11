import Link from "next/link";
import { searchCatalog, listPublicCategories, type SortKey } from "@/lib/services/catalog";
import { listDietaryTags } from "@/lib/repositories/products";
import { ProductCard } from "@/components/product/product-card";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as SortKey;
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const page = Number(sp.page || 1);
  const min = sp.min ? Number(sp.min) : undefined;
  const max = sp.max ? Number(sp.max) : undefined;

  const result = searchCatalog({ q, category, sort, tag, page, min, max });
  const categories = listPublicCategories();
  const tags = listDietaryTags();

  const href = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, category, sort, tag, page: String(page), ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "featured" && !(k === "page" && v === "1")) p.set(k, v);
    });
    if (next.sort === "featured") p.delete("sort");
    const s = p.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="font-tamil text-4xl md:text-5xl font-bold text-forest">நமது உணவு</h1>
      <p className="font-serif text-xl text-terracotta mt-1">Shop</p>
      <p className="mt-3 text-ink-soft">{result.total} products</p>

      <form className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" action="/shop" role="search">
        <input
          name="q"
          defaultValue={q}
          className="input col-span-2 md:col-span-1"
          placeholder="Search name, notes, ingredients"
          aria-label="Search products"
          autoComplete="off"
          enterKeyHint="search"
        />
        <select name="category" defaultValue={category} className="input" aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="tag" defaultValue={tag} className="input" aria-label="Dietary">
          <option value="">Dietary</option>
          {tags.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="input" aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
          <option value="newest">Newest</option>
          <option value="rating">Best rated</option>
        </select>
        <button className="btn btn-primary col-span-2 md:col-span-1">Apply</button>
      </form>

      {result.items.length === 0 ? (
        <div className="py-16 md:py-24 text-center">
          <p className="font-serif text-3xl">Nothing matches.</p>
          <p className="mt-2 text-ink-soft">Try a broader word, or clear filters.</p>
          <Link href="/shop" className="btn btn-ghost ink mt-6">
            Reset
          </Link>
        </div>
      ) : (
        <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {result.items.map((c) => (
            <ProductCard key={c.product.id} card={c} />
          ))}
        </div>
      )}

      {result.pages > 1 && (
        <nav aria-label="Pages" className="mt-10 md:mt-12 flex flex-wrap gap-2">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={href({ page: String(n) })}
              aria-current={n === result.page ? "page" : undefined}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center border border-line px-3 ${
                n === result.page ? "bg-ink text-paper" : "bg-warmwhite"
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
