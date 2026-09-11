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
      <form className="mt-6 grid sm:grid-cols-2 md:grid-cols-5 gap-2" action="/admin/products">
        <input name="q" defaultValue={q} className="input sm:col-span-2 md:col-span-1" placeholder="Search name or SKU" aria-label="Search products" />
        <select name="category" defaultValue={category} className="input" aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="input" aria-label="Status">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select name="sort" defaultValue={sort} className="input" aria-label="Sort">
          <option value="updated">Updated</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
        </select>
        <button className="btn btn-primary sm:col-span-2 md:col-span-1">Filter</button>
      </form>
      <p className="mt-3 text-xs text-ink-soft">{result.total} products</p>
      <div className="admin-table-scroll mt-4">
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
                <td className="py-2">
                  <Link href={`/admin/products/${row.product.id}`} className="underline underline-offset-4">
                    {row.product.name}
                  </Link>
                </td>
                <td className="py-2 whitespace-nowrap">{row.sku}</td>
                <td className="py-2 whitespace-nowrap">{row.categoryName}</td>
                <td className="py-2">{row.variantCount}</td>
                <td className="py-2 whitespace-nowrap">{row.price_paise != null ? formatPrice(row.price_paise) : "—"}</td>
                <td className="py-2">
                  <span className="text-[0.65rem] uppercase tracking-widest">{row.product.status}</span>
                </td>
                <td className="py-2 whitespace-nowrap">{formatDate(row.product.updated_at)}</td>
                <td className="space-y-1 py-2 text-xs uppercase tracking-widest">
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
        <nav aria-label="Pages" className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => {
            const p = new URLSearchParams();
            if (q) p.set("q", q);
            if (category) p.set("category", category);
            if (status !== "all") p.set("status", status);
            if (sort !== "updated") p.set("sort", sort);
            if (n > 1) p.set("page", String(n));
            const href = p.toString() ? `/admin/products?${p}` : "/admin/products";
            return (
              <Link
                key={n}
                href={href}
                aria-current={n === result.page ? "page" : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center border border-line px-3 ${n === result.page ? "bg-forest text-cream" : "bg-white"}`}
              >
                {n}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
