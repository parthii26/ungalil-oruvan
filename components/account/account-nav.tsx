"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/invoices", label: "Invoices" },
  { href: "/account/reviews", label: "Reviews" },
];

export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname();
  return (
    <nav
      aria-label="Account"
      className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0"
    >
      {links.map((l) => {
        const active = l.href === "/account" ? path === "/account" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border px-4 text-sm md:border-0 md:px-0 md:min-h-0 md:py-1",
              active
                ? "border-forest bg-forest text-cream md:bg-transparent md:text-forest md:font-semibold"
                : "border-line bg-warmwhite md:bg-transparent md:text-ink-soft md:hover:text-accent",
            )}
          >
            {l.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border border-line bg-warmwhite px-4 text-sm text-earth md:border-0 md:bg-transparent md:px-0 md:min-h-0 md:py-1"
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
