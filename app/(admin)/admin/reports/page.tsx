import { listAllOrders } from "@/lib/repositories/orders";
import { listAllProducts } from "@/lib/repositories/products";
import { formatPrice } from "@/lib/formatters";
import { loadDb } from "@/lib/db/store";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  const orders = listAllOrders();
  const products = listAllProducts();

  // Revenue stats
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter(
    (o) => o.status !== "pending_payment" && o.status !== "cancelled",
  );
  const pendingOrders = orders.filter((o) => o.status === "pending_payment");
  const totalRevenuePaise = confirmedOrders.reduce((s, o) => s + o.grand_total_paise, 0);
  const pendingRevenuePaise = pendingOrders.reduce((s, o) => s + o.grand_total_paise, 0);
  const avgOrderPaise =
    confirmedOrders.length > 0 ? Math.round(totalRevenuePaise / confirmedOrders.length) : 0;

  // Top products by units sold (from order items)
  const db = loadDb();
  const productSales: Record<string, { name: string; qty: number; revenuePaise: number }> = {};
  for (const item of db.order_items) {
    if (!productSales[item.product_name]) {
      productSales[item.product_name] = { name: item.product_name, qty: 0, revenuePaise: 0 };
    }
    productSales[item.product_name].qty += item.quantity;
    productSales[item.product_name].revenuePaise += item.line_total_paise;
  }
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);

  // Orders by status
  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Reports</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Live performance metrics calculated from your order database.
      </p>

      {/* Revenue cards */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={String(totalOrders)} />
        <StatCard label="Confirmed revenue" value={formatPrice(totalRevenuePaise)} />
        <StatCard label="Pending revenue" value={formatPrice(pendingRevenuePaise)} muted />
        <StatCard
          label="Avg order value"
          value={confirmedOrders.length > 0 ? formatPrice(avgOrderPaise) : "—"}
        />
      </div>

      {/* Order breakdown */}
      <h2 className="font-serif text-2xl mt-10">Orders by status</h2>
      <div className="mt-4 grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="border border-line p-4">
            <p className="label">{status.replaceAll("_", " ")}</p>
            <p className="font-serif text-3xl mt-1">{count}</p>
          </div>
        ))}
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <>
          <h2 className="font-serif text-2xl mt-10">Top products (by units sold)</h2>
          <div className="admin-table-scroll mt-4">
            <table className="w-full text-sm text-left">
              <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
                <tr>
                  <th className="py-2">#</th>
                  <th className="whitespace-nowrap">Product</th>
                  <th className="whitespace-nowrap">Units sold</th>
                  <th className="whitespace-nowrap">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.name} className="border-t border-line">
                    <td className="py-2 pr-4 text-ink-soft">{i + 1}</td>
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4">{p.qty}</td>
                    <td className="py-2">{formatPrice(p.revenuePaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Products published */}
      <h2 className="font-serif text-2xl mt-10">Catalogue</h2>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <StatCard label="Total products" value={String(products.length)} />
        <StatCard
          label="Published"
          value={String(products.filter((p) => p.status === "published").length)}
        />
        <StatCard
          label="Drafts"
          value={String(products.filter((p) => p.status === "draft").length)}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`border border-line p-5 ${muted ? "opacity-60" : ""}`}>
      <p className="label">{label}</p>
      <p className="font-serif text-3xl mt-1">{value}</p>
    </div>
  );
}
