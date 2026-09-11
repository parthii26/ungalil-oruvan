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
    <div className="container-page pt-8 pb-28 md:py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-forest">Basket</h1>
      {cart.items.length === 0 ? (
        <div className="py-16 md:py-20 text-center">
          <p className="font-serif text-3xl">Your basket is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-6">
            Shop
          </Link>
        </div>
      ) : (
        <div className="mt-6 md:mt-10 grid lg:grid-cols-[1fr_320px] gap-8 md:gap-12">
          <ul className="divide-y divide-line border-b border-line lg:border-b-0">
            {cart.items.map((item) => (
              <li key={item.item_id} className="py-4 md:py-6 flex gap-3 md:gap-4">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" loading="lazy" decoding="async" className="h-20 w-16 md:h-28 md:w-24 shrink-0 object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product_slug}`} className="font-serif text-xl md:text-2xl leading-snug">
                    {item.product_name}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {item.variant_title} · {item.sku}
                  </p>
                  <p className="mt-1 text-sm">{formatPrice(item.unit_price_paise)} each</p>
                  <CartControls itemId={item.item_id} quantity={item.quantity} />
                </div>
                <p className="whitespace-nowrap text-sm md:text-base">{formatPrice(item.unit_price_paise * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <aside className="border border-line p-5 md:p-6 h-fit">
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
      {cart.items.length > 0 && (
        <div className="sticky-cta-bar md:hidden">
          <div className="border-t border-line bg-cream/95 backdrop-blur">
            <div className="container-page flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xl leading-none">{formatPrice(cart.quote.grand_total_paise)}</p>
                <p className="mt-1 truncate text-xs text-ink-soft">Estimated total · {cart.items.reduce((s, i) => s + i.quantity, 0)} items</p>
              </div>
              <Link href="/checkout" className="btn btn-primary shrink-0">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
