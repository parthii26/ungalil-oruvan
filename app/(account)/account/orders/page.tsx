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
      <h1 className="font-serif text-3xl md:text-4xl">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-ink-soft">You have no orders yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-b border-line">
          {orders.map((o) => (
            <li key={o.id} className="py-4 flex flex-col gap-1 sm:flex-row flex-wrap sm:justify-between sm:items-center">
              <div>
                <Link href={`/account/orders/${o.id}`} className="font-serif text-xl md:text-2xl underline-offset-4 hover:underline">
                  {o.order_number}
                </Link>
                <p className="text-sm text-ink-soft">{formatDate(o.created_at)}</p>
              </div>
              <p className="text-sm sm:text-base">
                {o.status === "pending_payment" ? "Payment pending" : o.status} · {formatPrice(o.grand_total_paise)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
