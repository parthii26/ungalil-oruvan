"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { SearchDialog } from "./search-dialog";
import { BottomNav } from "./bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { easeOut } from "@/lib/motion";

export function HeaderClient({
  brand,
  tamilTagline,
  categories,
  signedIn,
  isAdmin,
  cartCount,
  cartItems = [],
  cartSubtotal = 0,
}: {
  brand: string;
  tamilTagline: string;
  categories: { name: string; slug: string }[];
  signedIn: boolean;
  isAdmin: boolean;
  cartCount: number;
  cartItems?: {
    item_id: string;
    product_name: string;
    variant_title: string;
    quantity: number;
    unit_price_paise: number;
    image: string | null;
  }[];
  cartSubtotal?: number;
}) {
  const path = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Close overlays on navigation (render-phase adjustment, not an effect).
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setOpen(false);
    setSearch(false);
    setCartOpen(false);
  }

  useEffect(() => {
    if (!open && !search && !cartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch(false);
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, search, cartOpen]);

  useEffect(() => {
    const measure = () => {
      const hero = document.getElementById("seed-stage");
      if (hero && path === "/" && hero.dataset.heroTone !== "light") {
        setOverHero(hero.getBoundingClientRect().bottom > 88);
        return;
      }
      setOverHero(false);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const onAdd = () => {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 400);
    };
    window.addEventListener("vz:cart-add", onAdd);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("vz:cart-add", onAdd);
    };
  }, [path]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-[background,color,border] duration-500 ${
          overHero
            ? "border-transparent bg-transparent text-cream"
            : "border-line bg-basil-deep/92 text-ink backdrop-blur-md"
        }`}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
            <button
              className="md:hidden -ml-2 grid min-h-11 min-w-11 place-items-center"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>

            <nav
              className={`hidden md:flex items-center gap-6 text-[0.72rem] tracking-[0.16em] uppercase ${
                overHero ? "text-cream/80" : "text-ink-soft"
              }`}
            >
              <Link href="/shop" className="hover:text-forest">
                Shop
              </Link>
              <div className="relative group">
                <Link href="/shop" className="hover:text-forest">
                  Categories
                </Link>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full pt-3 transition">
                  <div className="min-w-56 border border-line bg-basil-deep p-3 shadow-sm overflow-hidden [clip-path:inset(0_0_100%_0)] group-hover:[clip-path:inset(0)] transition-[clip-path] duration-500">
                    {categories.map((c) => (
                      <Link key={c.slug} href={`/category/${c.slug}`} className="block px-2 py-2 text-[0.7rem] text-ink hover:bg-paper-deep">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/about" className="hover:text-forest">
                About
              </Link>
              <Link href="/about#story" className="hover:text-forest">
                Our Story
              </Link>
              <Link href="/blog" className="hover:text-forest">
                Blog
              </Link>
              <Link href="/faq" className="hover:text-forest">
                FAQ
              </Link>
            </nav>

            <Link
              href="/"
              className="text-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 max-w-[calc(100%-6rem)] px-2"
            >
              <span className={`block font-serif text-[1.25rem] sm:text-[1.35rem] tracking-tight leading-none truncate md:text-[1.65rem] ${overHero ? "text-cream" : "text-forest"}`}>
                {brand}
              </span>
              <span className={`hidden md:block font-tamil text-[0.65rem] mt-0.5 ${overHero ? "text-turmeric" : "text-terracotta"}`}>
                {tamilTagline}
              </span>
            </Link>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                className="hidden md:grid min-h-11 min-w-11 place-items-center"
                aria-label="Search"
                onClick={() => setSearch(true)}
              >
                <Search size={19} />
              </button>
              <Link
                href={signedIn ? "/account" : "/login"}
                className="hidden sm:grid min-h-11 min-w-11 place-items-center"
                aria-label="Account"
              >
                <User size={19} />
              </Link>
              <Link
                href="/account/wishlist"
                className="hidden sm:grid min-h-11 min-w-11 place-items-center"
                aria-label="Wishlist"
              >
                <Heart size={19} />
              </Link>
              <button
                type="button"
                className={`relative grid min-h-11 min-w-11 place-items-center ${pulse ? "cart-pulse" : ""}`}
                aria-label={cartCount > 0 ? `Basket, ${cartCount} items` : "Basket"}
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-1 min-w-4 h-4 px-1 rounded-full bg-terracotta text-white text-[10px] leading-4 text-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
              <Link href="/shop" className="btn btn-primary !hidden lg:!inline-flex ml-2 !py-2">
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-basil-deep md:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <div className="container-page py-3 flex justify-between items-center border-b border-line">
              <span className="font-serif text-2xl text-forest">{brand}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid min-h-11 min-w-11 place-items-center -mr-2"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="container-page py-6 flex flex-col text-lg font-serif text-ink">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearch(true);
                }}
                className="flex min-h-12 items-center gap-3 border-b border-line/60 py-2 text-left"
              >
                <Search size={19} className="text-ink-soft" />
                Search the pantry
              </button>
              {["Shop", ...categories.map((c) => c.name), "About", "Blog", "FAQ"].map((label, i) => {
                const href =
                  label === "Shop"
                    ? "/shop"
                    : label === "About"
                      ? "/about"
                      : label === "Blog"
                        ? "/blog"
                        : label === "FAQ"
                          ? "/faq"
                          : `/category/${categories.find((c) => c.name === label)?.slug ?? ""}`;
                return (
                  <motion.div
                    key={label}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.06 * i, ease: easeOut }}
                    className="border-b border-line/60"
                  >
                    <Link href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center py-2">
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link
                href={signedIn ? "/account/orders" : "/login?next=/account/orders"}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line/60 py-2"
              >
                Orders
              </Link>
              <Link
                href="/account/wishlist"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line/60 py-2"
              >
                Wishlist
              </Link>
              <Link
                href={signedIn ? "/account" : "/login"}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line/60 py-2"
              >
                {signedIn ? "Account" : "Sign in"}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center py-2 text-earth"
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}

        {search && <SearchDialog onClose={() => setSearch(false)} />}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} subtotal={cartSubtotal} />
      <BottomNav signedIn={signedIn} cartCount={cartCount} onSearch={() => setSearch(true)} />
    </>
  );
}
