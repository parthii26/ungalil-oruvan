import Link from "next/link";
import { listAllOrders } from "@/lib/repositories/orders";
import { formatDate, formatPrice } from "@/lib/formatters";

export const metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  const orders = listAllOrders();
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <table className="mt-8 w-full text-sm text-left">
        <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
          <tr>
            <th className="py-2">Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-line">
              <td className="py-3">
                <Link href={`/admin/orders/${o.id}`} className="underline">
                  {o.order_number}
                </Link>
              </td>
              <td>{o.email}</td>
              <td>{formatPrice(o.grand_total_paise)}</td>
              <td>{o.status.replaceAll("_", " ")}</td>
              <td>{formatDate(o.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
