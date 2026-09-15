import { listAllProducts } from "@/lib/repositories/products";
import { listAllCategories } from "@/lib/repositories/categories";
import { listCustomers } from "@/lib/repositories/customers";
import { listAllOrders } from "@/lib/repositories/orders";
import { loadDb } from "@/lib/db/store";
import { formatPrice } from "@/lib/formatters";
import Link from "next/link";

export const metadata = { title: "Admin" };

export default function AdminHome() {
  const products = listAllProducts();
  const published = products.filter((p) => p.status === "published").length;
  const drafts = products.filter((p) => p.status === "draft").length;
  const categories = listAllCategories();
  const customers = listCustomers();
  const orders = listAllOrders();
  const db = loadDb();
  const variants = db.product_variants ?? [];
  const batches = db.batches ?? [];
  const pending = orders.filter((o) => o.status === "pending_payment");
  const confirmedOrders = orders.filter((o) => o.status !== "pending_payment" && o.status !== "cancelled");
  const confirmedRevenuePaise = confirmedOrders.reduce((s, o) => s + o.grand_total_paise, 0);
  const totalStockUnits = variants.reduce((s, v) => s + (v.stock_qty ?? 0), 0);
  const lowStockCount = variants.filter((v) => v.status === "active" && (v.stock_qty ?? 0) < 10).length;
  const expiringBatchesCount = batches.filter((b) => {
    const diffDays = (new Date(b.expiry_date).getTime() - Date.now()) / (1000 * 86400);
    return diffDays <= 60;
  }).length;
  const subscribersCount = (db.newsletter_subscribers ?? []).length;

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Dashboard</h1>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Published" value={String(published)} />
        <Stat label="Drafts" value={String(drafts)} />
        <Stat label="Categories" value={String(categories.length)} />
        <Stat label="Customers" value={String(customers.length)} />
        <Stat label="Pending orders" value={String(pending.length)} />
        <Stat label="All orders" value={String(orders.length)} />
        <Stat label="Subscribers" value={String(subscribersCount)} />
      </div>
      <h2 className="font-serif text-2xl mt-12">Store Performance & Operations</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Confirmed Revenue" value={formatPrice(confirmedRevenuePaise)} />
        <Stat label="Total Stock Units" value={String(totalStockUnits)} />
        <Stat label="Low Stock Variants" value={String(lowStockCount)} />
        <Stat label="Expiring Batches" value={String(expiringBatchesCount)} />
      </div>
      <h2 className="font-serif text-2xl mt-10 md:mt-12">Recent orders</h2>
      <ul className="mt-4 divide-y divide-line border-b border-line">
        {orders.slice(0, 8).map((o) => (
          <li key={o.id} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <Link href={`/admin/orders/${o.id}`} className="underline underline-offset-4">{o.order_number}</Link>
            <span className="text-sm">
              {o.status.replaceAll("_", " ")} · {formatPrice(o.grand_total_paise)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`border border-line p-5 ${muted ? "opacity-60" : ""}`}>
      <p className="label">{label}</p>
      <p className="font-serif text-4xl mt-1">{value}</p>
    </div>
  );
}
