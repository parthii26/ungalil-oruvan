import Link from "next/link";
import { listAdminProducts } from "@/lib/services/admin-catalog";
import { listAllCategories } from "@/lib/repositories/categories";
import { formatDate, formatPrice } from "@/lib/formatters";
import { duplicateProductAction, setProductStatusAction } from "@/lib/actions/admin";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const status = typeof sp.status === "string" ? sp.status : "all";
  const sort = typeof sp.sort === "string" ? sp.sort : "updated";
  const page = Number(sp.page || 1);
  const result = listAdminProducts({ q, category, status, sort, page });
  const categories = listAllCategories();

  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>
      <form className="mt-6 grid md:grid-cols-5 gap-2" action="/admin/products">
        <input name="q" defaultValue={q} className="input" placeholder="Search name or SKU" />
        <select name="category" defaultValue={category} className="input">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="input">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select name="sort" defaultValue={sort} className="input">
          <option value="updated">Updated</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
        </select>
        <button className="btn btn-primary">Filter</button>
      </form>
      <p className="mt-3 text-xs text-ink-soft">{result.total} products</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
            <tr>
              <th className="py-2">Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Variants</th>
              <th>Price</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((row) => (
              <tr key={row.product.id} className="border-t border-line align-top">
                <td className="py-3">
                  <Link href={`/admin/products/${row.product.id}`} className="underline">
                    {row.product.name}
                  </Link>
                </td>
                <td>{row.sku}</td>
                <td>{row.categoryName}</td>
                <td>{row.variantCount}</td>
                <td>{row.price_paise != null ? formatPrice(row.price_paise) : "—"}</td>
                <td>
                  <span className="text-[0.65rem] uppercase tracking-widest">{row.product.status}</span>
                </td>
                <td>{formatDate(row.product.updated_at)}</td>
                <td className="space-y-1 text-xs uppercase tracking-widest">
                  <Link href={`/admin/products/${row.product.id}`} className="block">
                    Edit
                  </Link>
                  <form action={duplicateProductAction.bind(null, row.product.id)}>
                    <button>Duplicate</button>
                  </form>
                  {row.product.status !== "published" && (
                    <ConfirmSubmit
                      action={setProductStatusAction.bind(null, row.product.id, "published")}
                      label="Publish"
                      message="Publish this product to the storefront?"
                    />
                  )}
                  {row.product.status === "published" && (
                    <ConfirmSubmit
                      action={setProductStatusAction.bind(null, row.product.id, "draft")}
                      label="Unpublish"
                      message="Unpublish? It will disappear from the shop."
                    />
                  )}
                  {row.product.status !== "archived" && (
                    <ConfirmSubmit
                      action={setProductStatusAction.bind(null, row.product.id, "archived")}
                      label="Archive"
                      message="Archive this product? It will not appear in the shop."
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.pages > 1 && (
        <div className="mt-6 flex gap-2">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => {
            const p = new URLSearchParams();
            if (q) p.set("q", q);
            if (category) p.set("category", category);
            if (status !== "all") p.set("status", status);
            if (sort !== "updated") p.set("sort", sort);
            if (n > 1) p.set("page", String(n));
            const href = p.toString() ? `/admin/products?${p}` : "/admin/products";
            return (
              <Link key={n} href={href} className={`px-3 py-1 border border-line ${n === result.page ? "bg-forest text-cream" : ""}`}>
                {n}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
