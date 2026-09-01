import Link from "next/link";
import { getCartSessionId, getSession } from "@/lib/auth/session";
import { viewCart } from "@/lib/services/cart";
import { formatPrice } from "@/lib/formatters";
import { CartControls } from "@/components/cart/cart-controls";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const session = await getSession();
  const sessionId = await getCartSessionId();
  const cart = viewCart({ customerId: session?.customerId ?? null, sessionId });

  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-5xl text-forest">Basket</h1>
      {cart.items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-3xl">Your basket is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-6">
            Shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-12">
          <ul className="divide-y divide-line">
            {cart.items.map((item) => (
              <li key={item.item_id} className="py-6 flex gap-4">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-28 w-24 object-cover" />
                )}
                <div className="flex-1">
                  <Link href={`/product/${item.product_slug}`} className="font-serif text-2xl">
                    {item.product_name}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {item.variant_title} · {item.sku}
                  </p>
                  <p className="mt-1">{formatPrice(item.unit_price_paise)}</p>
                  <CartControls itemId={item.item_id} quantity={item.quantity} />
                </div>
                <p>{formatPrice(item.unit_price_paise * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <aside className="border border-line p-6 h-fit">
            <h2 className="font-serif text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(cart.quote.subtotal_paise)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd>{formatPrice(cart.quote.discount_paise)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Est. shipping</dt>
                <dd>{formatPrice(cart.quote.shipping_paise)}</dd>
              </div>
              <div className="flex justify-between text-ink-soft">
                <dt>Tax</dt>
                <dd>Not configured</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt>Estimated total</dt>
                <dd>{formatPrice(cart.quote.grand_total_paise)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-soft">Informational only. Final totals are computed on the server at checkout.</p>
            <Link href="/checkout" className="btn btn-primary w-full mt-6">
              Continue checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
