import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { Suspense } from "react";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/invoices", label: "Invoices" },
  { href: "/account/reviews", label: "Reviews" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  return (
    <>
      <Suspense>
        <StorefrontHeader />
      </Suspense>
      <div className="container-page py-12 grid md:grid-cols-[200px_1fr] gap-10 flex-1 has-bottom-nav">
        <aside>
          <p className="font-serif text-2xl">{session.name}</p>
          <p className="text-xs text-ink-soft">{session.email}</p>
          <nav className="mt-6 flex flex-col gap-2 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent">
                {l.label}
              </Link>
            ))}
            {session.role === "admin" && (
              <Link href="/admin" className="hover:text-accent">
                Admin
              </Link>
            )}
          </nav>
          <form action="/api/auth/logout" method="post" className="mt-8">
            <button className="text-xs uppercase tracking-widest">Sign out</button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
      <StorefrontFooter />
    </>
  );
}
