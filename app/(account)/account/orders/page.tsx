import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { listMine } from "@/lib/services/orders";
import { formatDate, formatPrice } from "@/lib/formatters";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const session = await getSession();
  const orders = session?.customerId ? listMine(session.customerId) : [];
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-ink-soft">You have no orders yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {orders.map((o) => (
            <li key={o.id} className="py-4 flex flex-wrap justify-between gap-2">
              <div>
                <Link href={`/account/orders/${o.id}`} className="font-serif text-2xl">
                  {o.order_number}
                </Link>
                <p className="text-sm text-ink-soft">{formatDate(o.created_at)}</p>
              </div>
              <p>
                {o.status === "pending_payment" ? "Payment pending" : o.status} · {formatPrice(o.grand_total_paise)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
