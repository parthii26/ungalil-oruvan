import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getCartSessionId } from "@/lib/auth/session";
import { listMine } from "@/lib/services/orders";
import { listAddresses } from "@/lib/repositories/addresses";
import { listWishlistItems } from "@/lib/repositories/wishlists";
import { viewCart } from "@/lib/services/cart";
import { featuredProducts } from "@/lib/services/catalog";
import { formatPrice } from "@/lib/formatters";
import { ProductCard } from "@/components/product/product-card";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await getSession();
  const sessionId = await getCartSessionId();
  const orders = session?.customerId ? listMine(session.customerId) : [];
  const addresses = session?.customerId ? listAddresses(session.customerId) : [];
  const wishes = session?.customerId ? listWishlistItems(session.customerId) : [];
  const cart = viewCart({ customerId: session?.customerId ?? null, sessionId });
  const recent = featuredProducts(4);

  return (
    <div>
      <p className="font-tamil text-terracotta">வணக்கம்</p>
      <h1 className="font-serif text-3xl md:text-4xl text-forest text-balance">Welcome, {session?.name}</h1>
      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        <Link href="/shop" className="btn btn-primary w-full sm:w-auto">
          Continue shopping
        </Link>
        <Link href="/account/orders" className="btn btn-ghost w-full sm:w-auto">
          View orders
        </Link>
        <Link href="/account/wishlist" className="btn btn-ghost w-full sm:w-auto">
          View wishlist
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="border border-line bg-warmwhite p-4 md:p-5">
          <p className="label">Orders</p>
          <p className="font-serif text-3xl md:text-4xl">{orders.length}</p>
        </div>
        <div className="border border-line bg-warmwhite p-4 md:p-5">
          <p className="label">Active cart</p>
          <p className="font-serif text-3xl md:text-4xl">{cart.items.reduce((s, i) => s + i.quantity, 0)}</p>
          <Link href="/cart" className="inline-flex min-h-11 items-center text-xs uppercase tracking-widest underline underline-offset-4">
            Open cart
          </Link>
        </div>
        <div className="border border-line bg-warmwhite p-4 md:p-5">
          <p className="label">Wishlist</p>
          <p className="font-serif text-3xl md:text-4xl">{wishes.length}</p>
        </div>
        <div className="border border-line bg-warmwhite p-4 md:p-5">
          <p className="label">Addresses</p>
          <p className="font-serif text-3xl md:text-4xl">{addresses.length}</p>
        </div>
      </div>
      <h2 className="font-serif text-2xl mt-10">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-ink-soft">No orders yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-b border-line">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="py-3 flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
              <Link href={`/account/orders/${o.id}`} className="inline-flex min-h-11 items-center underline underline-offset-4 sm:min-h-0">
                {o.order_number}
              </Link>
              <span className="text-sm">
                {o.status === "pending_payment" ? "Payment pending" : o.status.replaceAll("_", " ")} ·{" "}
                {formatPrice(o.grand_total_paise)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <h2 className="font-serif text-2xl mt-10 md:mt-12">From the pantry</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6">
        {recent.map((c) => (
          <ProductCard key={c.product.id} card={c} />
        ))}
      </div>
    </div>
  );
}
