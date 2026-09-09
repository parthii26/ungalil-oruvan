"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({
  signedIn,
  cartCount,
  onSearch,
}: {
  signedIn: boolean;
  cartCount: number;
  onSearch: () => void;
}) {
  const path = usePathname();
  const items: { href: string; label: string; icon: typeof Home; active: boolean; badge?: number }[] = [
    { href: "/", label: "Home", icon: Home, active: path === "/" },
    {
      href: "/shop",
      label: "Shop",
      icon: Store,
      active: path.startsWith("/shop") || path.startsWith("/category") || path.startsWith("/product"),
    },
    { href: "/cart", label: "Basket", icon: ShoppingBag, active: path.startsWith("/cart") || path.startsWith("/checkout"), badge: cartCount },
    {
      href: signedIn ? "/account" : "/login",
      label: "Account",
      icon: User,
      active: path.startsWith("/account"),
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-cream/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-5 h-[var(--bnav-h)]">
        {items.slice(0, 2).map((item) => (
          <li key={item.label} className="min-w-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-1 text-[0.62rem] tracking-wide",
                item.active ? "text-forest font-semibold" : "text-ink-soft",
              )}
            >
              {item.active && <span className="absolute top-0 h-0.5 w-8 bg-forest" aria-hidden />}
              <item.icon size={20} strokeWidth={item.active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          </li>
        ))}
        <li className="min-w-0">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search products"
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-[0.62rem] tracking-wide text-ink-soft"
          >
            <Search size={20} strokeWidth={1.75} />
            Search
          </button>
        </li>
        {items.slice(2).map((item) => (
          <li key={item.label} className="min-w-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-1 text-[0.62rem] tracking-wide",
                item.active ? "text-forest font-semibold" : "text-ink-soft",
              )}
            >
              {item.active && <span className="absolute top-0 h-0.5 w-8 bg-forest" aria-hidden />}
              <span className="relative">
                <item.icon size={20} strokeWidth={item.active ? 2.25 : 1.75} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 min-w-4 h-4 px-1 rounded-full bg-terracotta text-white text-[10px] leading-4 text-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
