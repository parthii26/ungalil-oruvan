"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Search, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({
  signedIn,
  onSearch,
}: {
  signedIn: boolean;
  onSearch: () => void;
}) {
  const path = usePathname();
  const items = [
    { href: "/", label: "Home", icon: Home, active: path === "/" },
    { href: "/shop", label: "Shop", icon: Store, active: path.startsWith("/shop") || path.startsWith("/category") || path.startsWith("/product") },
    { href: signedIn ? "/account/orders" : "/login?next=/account/orders", label: "Orders", icon: Package, active: path.startsWith("/account/orders") },
    { href: signedIn ? "/account" : "/login", label: "Account", icon: User, active: path.startsWith("/account") && !path.startsWith("/account/orders") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-cream/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {items.slice(0, 2).map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[0.62rem] tracking-wide", item.active ? "text-forest" : "text-ink-soft")}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={onSearch}
            className="flex w-full flex-col items-center gap-1 py-2.5 text-[0.62rem] tracking-wide text-ink-soft"
          >
            <Search size={18} />
            Search
          </button>
        </li>
        {items.slice(2).map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[0.62rem] tracking-wide", item.active ? "text-forest" : "text-ink-soft")}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
