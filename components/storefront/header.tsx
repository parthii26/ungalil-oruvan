import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/services/settings";
import { listPublicCategories } from "@/lib/services/catalog";
import { viewCart } from "@/lib/services/cart";
import { getCartSessionId } from "@/lib/auth/session";
import { HeaderClient } from "./header-client";

export async function StorefrontHeader() {
  const settings = getSiteSettings();
  const session = await getSession();
  const categories = listPublicCategories();
  const sessionId = await getCartSessionId();
  const cart = viewCart({ customerId: session?.customerId ?? null, sessionId });
  const count = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <HeaderClient
      brand={settings.brand_name}
      tamilTagline={settings.tamil_tagline}
      categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
      signedIn={Boolean(session)}
      isAdmin={session?.role === "admin"}
      cartCount={count}
      cartItems={cart.items.map((i) => ({
        item_id: i.item_id,
        product_name: i.product_name,
        variant_title: i.variant_title,
        quantity: i.quantity,
        unit_price_paise: i.unit_price_paise,
        image: i.image,
      }))}
      cartSubtotal={cart.quote.subtotal_paise}
    />
  );
}

export function StorefrontHeaderFallback() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl">
          Ungalil Oruvan
        </Link>
      </div>
    </header>
  );
}
