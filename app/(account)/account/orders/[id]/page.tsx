import { getSession } from "@/lib/auth/session";
import { getCustomerOrder } from "@/lib/services/orders";
import { formatDateTime, formatPrice } from "@/lib/formatters";
import { notFound } from "next/navigation";

export const metadata = { title: "Order" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.customerId) notFound();
  const { id } = await params;
  let data;
  try {
    data = getCustomerOrder(id, session.customerId);
  } catch {
    notFound();
  }
  const { order, items, events } = data;

  return (
    <div>
      <h1 className="font-serif text-4xl">{order.order_number}</h1>
      <p className="mt-2">
        {order.status === "pending_payment" ? "Payment pending" : order.status.replaceAll("_", " ")} ·{" "}
        {formatDateTime(order.created_at)}
      </p>
      <ul className="mt-8 divide-y divide-line">
        {items.map((i) => (
          <li key={i.id} className="py-3 flex justify-between">
            <span>
              {i.product_name} · {i.variant_title} × {i.quantity}
            </span>
            <span>{formatPrice(i.line_total_paise)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-6 text-sm space-y-1">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(order.subtotal_paise)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount</dt>
          <dd>{formatPrice(order.discount_paise)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatPrice(order.shipping_paise)}</dd>
        </div>
        <div className="flex justify-between font-medium">
          <dt>Total</dt>
          <dd>{formatPrice(order.grand_total_paise)}</dd>
        </div>
      </dl>
      <div className="mt-8">
        <h2 className="label">Ship to</h2>
        <p>
          {order.shipping_address.name}
          <br />
          {order.shipping_address.line1}, {order.shipping_address.city} {order.shipping_address.postal_code}
        </p>
      </div>
      <ol className="mt-10 space-y-2 text-sm">
        {events.map((e) => (
          <li key={e.id}>
            {formatDateTime(e.created_at)} — {e.message}
          </li>
        ))}
        {["Confirmed", "Processing", "Packed", "Shipped", "Out for delivery", "Delivered"].map((s) => (
          <li key={s} className="text-ink-soft">
            {s} — not started
          </li>
        ))}
      </ol>
    </div>
  );
}
