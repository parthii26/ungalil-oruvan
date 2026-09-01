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
      <h1 className="font-serif text-4xl text-forest">Welcome, {session?.name}</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
        <Link href="/account/orders" className="btn btn-ghost">
          View orders
        </Link>
        <Link href="/account/wishlist" className="btn btn-ghost">
          View wishlist
        </Link>
      </div>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-line p-5">
          <p className="label">Orders</p>
          <p className="font-serif text-4xl">{orders.length}</p>
        </div>
        <div className="border border-line p-5">
          <p className="label">Active cart</p>
          <p className="font-serif text-4xl">{cart.items.reduce((s, i) => s + i.quantity, 0)}</p>
          <Link href="/cart" className="text-xs uppercase tracking-widest">
            Open cart
          </Link>
        </div>
        <div className="border border-line p-5">
          <p className="label">Wishlist</p>
          <p className="font-serif text-4xl">{wishes.length}</p>
        </div>
        <div className="border border-line p-5">
          <p className="label">Addresses</p>
          <p className="font-serif text-4xl">{addresses.length}</p>
        </div>
      </div>
      <h2 className="font-serif text-2xl mt-10">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-ink-soft">No orders yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="py-3 flex justify-between">
              <Link href={`/account/orders/${o.id}`} className="underline">
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
      <h2 className="font-serif text-2xl mt-12">From the pantry</h2>
      <div className="mt-6 grid grid-cols-2 gap-6">
        {recent.map((c) => (
          <ProductCard key={c.product.id} card={c} />
        ))}
      </div>
    </div>
  );
}
