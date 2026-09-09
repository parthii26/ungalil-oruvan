import Link from "next/link";
import { getOrderByNumber } from "@/lib/repositories/orders";
import { formatPrice } from "@/lib/formatters";

export const metadata = { title: "Order received" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: num } = await searchParams;
  const order = num ? getOrderByNumber(num) : null;

  return (
    <div className="container-page py-12 md:py-20 max-w-2xl">
      <p className="label">Confirmation</p>
      <h1 className="font-serif text-3xl md:text-5xl mt-2 text-balance">Order received — payment pending</h1>
      <p className="mt-4 text-ink-soft">
        Payment was not captured. This is not a paid order. Stage 2 will connect Razorpay.
      </p>
      {order ? (
        <div className="mt-8 border border-line bg-warmwhite p-5 md:p-6">
          <p className="font-serif text-2xl md:text-3xl">{order.order_number}</p>
          <p className="mt-2">Status: Payment pending</p>
          <p className="mt-1">Total {formatPrice(order.grand_total_paise)}</p>
          <div className="mt-6 grid gap-3 sm:flex">
            <Link href={`/account/orders/${order.id}`} className="btn btn-primary w-full sm:w-auto">
              View order
            </Link>
            <Link href="/shop" className="btn btn-ghost w-full sm:w-auto">
              Continue shopping
            </Link>
          </div>
        </div>
      ) : (
        <p className="mt-8">If you just placed an order, find it under Account → Orders after signing in.</p>
      )}
    </div>
  );
}
