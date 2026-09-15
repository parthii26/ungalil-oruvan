import { notFound } from "next/navigation";
import { adminGet } from "@/lib/services/orders";
import { formatDateTime, formatPrice } from "@/lib/formatters";
import { cancelOrderAction, updateOrderStatusAction } from "@/lib/actions/admin";
import type { OrderStatus } from "@/lib/db/types";

export const metadata = { title: "Order" };

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending_payment", label: "Payment Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">{order.order_number}</h1>
          <p className="mt-1 text-ink-soft">{order.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/account/invoices/${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs py-1 px-3"
          >
            Print Tax Invoice ↗
          </a>
          <span className="inline-block border border-line px-3 py-1 text-sm font-medium">
            {order.status.replaceAll("_", " ")}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul className="mt-8 divide-y divide-line border-b border-line">
        {items.map((i) => (
          <li key={i.id} className="py-3 flex justify-between gap-3 text-sm">
            <span className="min-w-0">
              {i.product_name} · {i.variant_title} × {i.quantity}
            </span>
            <span className="whitespace-nowrap">{formatPrice(i.line_total_paise)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 text-sm space-y-1">
        <div className="flex justify-between">
          <dt>Subtotal</dt><dd>{formatPrice(order.subtotal_paise)}</dd>
        </div>
        {order.discount_paise > 0 && (
          <div className="flex justify-between">
            <dt>Discount</dt><dd>-{formatPrice(order.discount_paise)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Shipping</dt><dd>{formatPrice(order.shipping_paise)}</dd>
        </div>
        <div className="flex justify-between font-medium border-t border-line pt-2">
          <dt>Total</dt><dd>{formatPrice(order.grand_total_paise)}</dd>
        </div>
      </dl>

      {/* Ship to */}
      <div className="mt-6 text-sm">
        <p className="label mb-1">Ship to</p>
        <p>
          {order.shipping_address.name}, {order.shipping_address.phone}<br />
          {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}<br />
          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
        </p>
      </div>

      {/* Status change */}
      <div className="mt-10 border border-line p-5">
        <h2 className="font-serif text-xl">Update Status</h2>
        <form
          action={async (formData: FormData) => {
            "use server";
            await updateOrderStatusAction(null, formData);
          }}
          className="mt-4 flex flex-wrap gap-3 items-end"
        >
          <input type="hidden" name="order_id" value={order.id} />
          <div>
            <label className="label" htmlFor="status">New status</label>
            <select id="status" name="status" className="input mt-1" defaultValue={order.status}>
              {ALL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="label" htmlFor="note">Note (optional)</label>
            <input id="note" name="note" className="input mt-1" placeholder="e.g. Shiprocket tracking #123" />
          </div>
          <button className="btn btn-primary">Update</button>
        </form>
      </div>

      {/* Timeline */}
      <ol className="mt-8 text-sm space-y-2">
        {events.map((e) => (
          <li key={e.id}>
            <span className="text-ink-soft">{formatDateTime(e.created_at)}</span> — {e.message}
          </li>
        ))}
      </ol>

      {/* Cancel legacy */}
      {order.status === "pending_payment" && (
        <form action={cancelOrderAction.bind(null, order.id)} className="mt-6">
          <button className="btn btn-ghost text-sm">Cancel this order</button>
        </form>
      )}
    </div>
  );
}
