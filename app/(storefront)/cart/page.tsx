import Link from "next/link";
import { getCartSessionId, getSession } from "@/lib/auth/session";
import { viewCart } from "@/lib/services/cart";
import { formatPrice } from "@/lib/formatters";
import { CartControls } from "@/components/cart/cart-controls";
import { getSiteSettings } from "@/lib/services/settings";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const session = await getSession();
  const sessionId = await getCartSessionId();
  const cart = viewCart({ customerId: session?.customerId ?? null, sessionId });
  const settings = getSiteSettings();

  const freeShippingThreshold = settings.free_shipping_over_paise ?? 99900;
  const subtotal = cart.quote.subtotal_paise;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const neededForFreeShipping = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, Math.max(0, Math.round((subtotal / freeShippingThreshold) * 100)));

  return (
    <div className="container-page pt-8 pb-28 md:py-12">
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <div className="space-y-0.5">
          <h1 className="font-tamil text-2xl md:text-3xl font-semibold text-forest leading-tight">உங்கள் கூடை</h1>
          <p className="font-serif text-2xl md:text-3xl font-normal text-ink leading-tight">Shopping Basket</p>
        </div>
        {cart.items.length > 0 && (
          <p className="text-sm text-ink-soft">{cart.items.reduce((s, i) => s + i.quantity, 0)} items</p>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="py-12 md:py-16 max-w-xl mx-auto text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-cream flex items-center justify-center text-forest text-2xl font-serif">
            🧺
          </div>
          <h2 className="font-serif text-2xl md:text-3xl mt-4">Your basket is empty</h2>
          <p className="mt-2 text-ink-soft text-sm leading-relaxed">
            Explore our cold-pressed oils, raw wild forest honey, native heritage millets, and unpolished grains from verified farmer lots.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">
              Explore Pantry
            </Link>
            <Link href="/shop?category=organic-honey" className="btn btn-ghost text-xs">
              Honey
            </Link>
            <Link href="/shop?category=cold-pressed-oils" className="btn btn-ghost text-xs">
              Oils
            </Link>
            <Link href="/shop?category=millets" className="btn btn-ghost text-xs">
              Millets
            </Link>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-4 text-left border-t border-line pt-8">
            <div className="bg-warmwhite p-4 border border-line">
              <h3 className="label text-[0.7rem]">Shipping Policy</h3>
              <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                Free delivery on orders above {formatPrice(freeShippingThreshold)} across India. Hand-packed in eco-friendly packaging and dispatched within 1–2 business days.
              </p>
            </div>
            <div className="bg-warmwhite p-4 border border-line">
              <h3 className="label text-[0.7rem]">Customer Support</h3>
              <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                Questions or need assistance with your order? Reach our customer care team at{" "}
                <a href={`mailto:${settings.contact_email}`} className="underline font-medium text-forest">
                  {settings.contact_email}
                </a>{" "}
                or call {settings.contact_phone}.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 md:mt-8 grid lg:grid-cols-[1fr_340px] gap-8 md:gap-12">
          <div>
            {/* Free shipping progress bar */}
            <div className="mb-6 p-4 bg-warmwhite border border-line">
              <div className="flex justify-between text-xs font-medium mb-1.5">
                {qualifiesForFreeShipping ? (
                  <span className="text-forest font-semibold">🎉 You have unlocked FREE shipping across India!</span>
                ) : (
                  <span>
                    Add <strong className="text-forest font-semibold">{formatPrice(neededForFreeShipping)}</strong> more to unlock <strong className="text-forest">FREE shipping</strong>
                  </span>
                )}
                <span className="text-ink-soft">{progressPercent}%</span>
              </div>
              <div className="w-full bg-line/60 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-forest h-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <ul className="divide-y divide-line border-b border-line lg:border-b-0">
              {cart.items.map((item) => (
                <li key={item.item_id} className="py-4 md:py-6 flex gap-3 md:gap-4">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.product_name} loading="lazy" decoding="async" className="h-20 w-16 md:h-28 md:w-24 shrink-0 object-cover border border-line" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product_slug}`} className="font-serif text-xl md:text-2xl leading-snug hover:text-terracotta transition-colors">
                      {item.product_name}
                    </Link>
                    <p className="text-sm text-ink-soft">
                      {item.variant_title} · SKU: {item.sku}
                    </p>
                    <p className="mt-1 text-sm">{formatPrice(item.unit_price_paise)} each</p>
                    <CartControls itemId={item.item_id} quantity={item.quantity} />
                  </div>
                  <p className="whitespace-nowrap font-medium text-sm md:text-base">{formatPrice(item.unit_price_paise * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="border border-line p-5 md:p-6 h-fit bg-warmwhite/40">
            <h2 className="font-serif text-2xl text-forest">Order Summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium">{formatPrice(cart.quote.subtotal_paise)}</dd>
              </div>
              {cart.quote.discount_paise > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <dt>Discount</dt>
                  <dd>-{formatPrice(cart.quote.discount_paise)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="font-medium">
                  {cart.quote.shipping_paise === 0 ? (
                    <span className="text-forest font-medium">FREE</span>
                  ) : (
                    formatPrice(cart.quote.shipping_paise)
                  )}
                </dd>
              </div>
              <div className="flex justify-between text-xs text-ink-soft pt-1">
                <dt>GST / Taxes</dt>
                <dd>Included in price</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-forest">
                <dt>Estimated Total</dt>
                <dd>{formatPrice(cart.quote.grand_total_paise)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[0.72rem] text-ink-soft leading-relaxed">
              All prices inclusive of applicable taxes. Final address and coupon validation calculated at checkout.
            </p>
            <Link href="/checkout" className="btn btn-primary w-full mt-6 text-center text-sm py-3">
              Proceed to Checkout →
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
