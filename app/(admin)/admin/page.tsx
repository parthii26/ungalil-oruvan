import { listAllProducts } from "@/lib/repositories/products";
import { listAllCategories } from "@/lib/repositories/categories";
import { listCustomers } from "@/lib/repositories/customers";
import { listAllOrders } from "@/lib/repositories/orders";
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
  const pending = orders.filter((o) => o.status === "pending_payment");

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Published" value={String(published)} />
        <Stat label="Drafts" value={String(drafts)} />
        <Stat label="Categories" value={String(categories.length)} />
        <Stat label="Customers" value={String(customers.length)} />
        <Stat label="Pending orders" value={String(pending.length)} />
        <Stat label="All orders" value={String(orders.length)} />
      </div>
      <h2 className="font-serif text-2xl mt-12">Stage 2 metrics — not configured</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Revenue" value="—" muted />
        <Stat label="Inventory" value="—" muted />
        <Stat label="Low stock" value="—" muted />
        <Stat label="Expiry" value="—" muted />
        <Stat label="Payments" value="—" muted />
      </div>
      <h2 className="font-serif text-2xl mt-12">Recent orders</h2>
      <ul className="mt-4 divide-y divide-line">
        {orders.slice(0, 8).map((o) => (
          <li key={o.id} className="py-3 flex justify-between">
            <Link href={`/admin/orders/${o.id}`}>{o.order_number}</Link>
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
