import { getOrderByNumber, listOrderEvents } from "@/lib/repositories/orders";
import { formatDateTime } from "@/lib/formatters";
import type { OrderStatus } from "@/lib/db/types";

export const metadata = { title: "Track Order" };

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending_payment", label: "Order Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending_payment":
      return 0;
    case "confirmed":
      return 1;
    case "processing":
      return 2;
    case "packed":
      return 3;
    case "shipped":
    case "out_for_delivery":
      return 4;
    case "delivered":
      return 5;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ token?: string[] }>;
  searchParams?: Promise<{ order?: string }>;
}) {
  const { token } = await params;
  const sParams = searchParams ? await searchParams : {};
  const queryOrder = (token?.[0] || sParams.order || "").trim();

  const order = queryOrder ? getOrderByNumber(queryOrder.toUpperCase()) : null;
  const events = order ? listOrderEvents(order.id) : [];
  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="container-page py-10 md:py-16 max-w-2xl">
      <p className="label">Live Updates</p>
      <h1 className="font-serif text-4xl md:text-5xl mt-1">Track Order</h1>
      <p className="mt-2 text-ink-soft">
        Enter your order number (e.g. <code>UO-2026-000001</code>) to see real-time delivery status.
      </p>

      {/* Lookup Form */}
      <form method="GET" action="/order/track" className="mt-8 flex gap-3">
        <input
          name="order"
          defaultValue={queryOrder}
          className="input flex-1 font-mono uppercase"
          placeholder="UO-2026-000001"
          required
        />
        <button className="btn btn-primary whitespace-nowrap">Track</button>
      </form>

      {queryOrder && !order && (
        <div className="mt-8 border border-red-200 bg-red-50/50 p-5 rounded">
          <p className="font-medium text-red-900">Order not found</p>
          <p className="text-sm text-red-700 mt-1">
            We couldn’t find an order matching <span className="font-mono">{queryOrder}</span>. Please verify the order number from your confirmation email.
          </p>
        </div>
      )}

      {order && (
        <div className="mt-10 border border-line bg-warmwhite p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
            <div>
              <span className="label">Order Number</span>
              <p className="font-serif text-2xl md:text-3xl font-medium mt-1">{order.order_number}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded uppercase tracking-wider font-medium ${
                order.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : order.status === "delivered"
                  ? "bg-green-100 text-green-900"
                  : "bg-[#203123] text-white"
              }`}
            >
              {order.status.replaceAll("_", " ")}
            </span>
          </div>

          {/* Progress Tracker */}
          {order.status !== "cancelled" ? (
            <div>
              <p className="label mb-3">Fulfillment Progress</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                {STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div
                      key={step.status}
                      className={`p-2 border rounded ${
                        isCurrent
                          ? "border-[#C59A3D] bg-[#C59A3D]/10 font-bold text-ink"
                          : isDone
                          ? "border-[#203123] bg-[#203123]/5 text-[#203123]"
                          : "border-line text-ink-soft"
                      }`}
                    >
                      <div className="text-base mb-1">{isDone ? "✓" : "○"}</div>
                      <div>{step.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-700">This order was cancelled.</p>
          )}

          {/* Destination */}
          <div className="text-sm border-t border-line pt-4 flex justify-between">
            <span className="text-ink-soft">Delivery Destination</span>
            <span className="font-medium">
              {order.shipping_address.city}, {order.shipping_address.state} ({order.shipping_address.postal_code})
            </span>
          </div>

          {/* Event Timeline */}
          {events.length > 0 && (
            <div className="border-t border-line pt-4">
              <p className="label mb-3">Activity Timeline</p>
              <ol className="space-y-3 text-sm">
                {events.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <span className="text-xs text-ink-soft min-w-[130px]">
                      {formatDateTime(e.created_at)}
                    </span>
                    <span>{e.message}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
