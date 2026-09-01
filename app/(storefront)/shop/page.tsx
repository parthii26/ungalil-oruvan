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
    <div className="container-page py-12">
      <p className="font-tamil text-terracotta">நமது உணவு</p>
      <h1 className="font-serif text-5xl mt-2 text-forest">Shop</h1>
      <p className="mt-3 text-ink-soft">{result.total} products</p>

      <form className="mt-8 grid gap-3 md:grid-cols-4" action="/shop">
        <input name="q" defaultValue={q} className="input" placeholder="Search name, notes, ingredients" />
        <select name="category" defaultValue={category} className="input">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="tag" defaultValue={tag} className="input">
          <option value="">Dietary</option>
          {tags.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="input">
          <option value="featured">Featured</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
          <option value="newest">Newest</option>
          <option value="rating">Best rated</option>
        </select>
        <button className="btn btn-primary md:col-span-4 w-fit">Apply</button>
      </form>

      {result.items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl">Nothing matches.</p>
          <p className="mt-2 text-ink-soft">Try a broader word, or clear filters.</p>
          <Link href="/shop" className="btn btn-ghost ink mt-6">
            Reset
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
          {result.items.map((c) => (
            <ProductCard key={c.product.id} card={c} />
          ))}
        </div>
      )}

      {result.pages > 1 && (
        <div className="mt-12 flex gap-2">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={href({ page: String(n) })}
              className={`px-3 py-2 border border-line ${n === result.page ? "bg-ink text-paper" : ""}`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
