import Link from "next/link";
import { listAllOrders } from "@/lib/repositories/orders";
import { formatDate, formatPrice } from "@/lib/formatters";

export const metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  const orders = listAllOrders();
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Orders</h1>
      <div className="admin-table-scroll mt-6 md:mt-8">
        <table className="w-full text-sm text-left">
          <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
            <tr>
              <th className="py-2 whitespace-nowrap">Order</th>
              <th className="whitespace-nowrap">Customer</th>
              <th className="whitespace-nowrap">Amount</th>
              <th className="whitespace-nowrap">Status</th>
              <th className="whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="py-2">
                  <Link href={`/admin/orders/${o.id}`} className="underline underline-offset-4">
                    {o.order_number}
                  </Link>
                </td>
                <td className="py-2">{o.email}</td>
                <td className="py-2 whitespace-nowrap">{formatPrice(o.grand_total_paise)}</td>
                <td className="py-2 whitespace-nowrap">{o.status.replaceAll("_", " ")}</td>
                <td className="py-2 whitespace-nowrap">{formatDate(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
