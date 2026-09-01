import { notFound } from "next/navigation";
import { adminGet } from "@/lib/services/orders";
import { formatDateTime, formatPrice } from "@/lib/formatters";
import { cancelOrderAction } from "@/lib/actions/admin";

export const metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data;
  try {
    data = adminGet(id);
  } catch {
    notFound();
  }
  const { order, items, events } = data;
  return (
    <div>
      <h1 className="font-serif text-4xl">{order.order_number}</h1>
      <p className="mt-2">
        {order.status.replaceAll("_", " ")} · {order.email}
      </p>
      <ul className="mt-8 divide-y divide-line">
        {items.map((i) => (
          <li key={i.id} className="py-3 flex justify-between text-sm">
            <span>
              {i.product_name} · {i.variant_title} × {i.quantity}
            </span>
            <span>{formatPrice(i.line_total_paise)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4">Total {formatPrice(order.grand_total_paise)}</p>
      <div className="mt-6 text-sm">
        {order.shipping_address.name}, {order.shipping_address.line1}, {order.shipping_address.city}
      </div>
      <ol className="mt-8 text-sm space-y-1">
        {events.map((e) => (
          <li key={e.id}>
            {formatDateTime(e.created_at)} — {e.message}
          </li>
        ))}
      </ol>
      {order.status === "pending_payment" && (
        <form action={cancelOrderAction.bind(null, order.id)} className="mt-8">
          <button className="btn btn-ghost">Cancel pending order</button>
        </form>
      )}
    </div>
  );
}
