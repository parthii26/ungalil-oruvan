import { getCartSessionId, getSession } from "@/lib/auth/session";
import { viewCart } from "@/lib/services/cart";
import { listAddresses } from "@/lib/repositories/addresses";
import { formatPrice } from "@/lib/formatters";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import Link from "next/link";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await getSession();
  const sessionId = await getCartSessionId();
  const cart = viewCart({ customerId: session?.customerId ?? null, sessionId });
  const addresses = session?.customerId ? listAddresses(session.customerId) : [];

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-4xl">Nothing to check out</h1>
        <Link href="/shop" className="btn btn-primary mt-6">
          Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12 grid lg:grid-cols-[1fr_340px] gap-12">
      <div>
        <p className="label">Stage 1</p>
        <h1 className="font-serif text-5xl text-forest">Checkout</h1>
        <p className="mt-3 text-ink-soft max-w-xl">
          Payment is not captured. Completing this form creates a pending-payment order. Razorpay is a Stage 2 integration.
        </p>
        {!session && (
          <p className="mt-4 text-sm">
            <Link href="/login?next=/checkout" className="underline">
              Sign in
            </Link>{" "}
            to use saved addresses, or continue as a guest.
          </p>
        )}
        <CheckoutForm
          email={session?.email ?? ""}
          addresses={addresses}
          couponCode={cart.quote.coupon_code}
        />
      </div>
      <aside className="border border-line p-6 h-fit">
        <h2 className="font-serif text-2xl">Review</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {cart.items.map((i) => (
            <li key={i.item_id} className="flex justify-between gap-3">
              <span>
                {i.product_name} · {i.variant_title} × {i.quantity}
              </span>
              <span>{formatPrice(i.unit_price_paise * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(cart.quote.subtotal_paise)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Discount</dt>
            <dd>{formatPrice(cart.quote.discount_paise)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping (est.)</dt>
            <dd>{formatPrice(cart.quote.shipping_paise)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <dt>Server total</dt>
            <dd>{formatPrice(cart.quote.grand_total_paise)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink-soft">{cart.quote.shipping_note}</p>
        <p className="mt-1 text-xs text-ink-soft">{cart.quote.tax_note}</p>
      </aside>
    </div>
  );
}
