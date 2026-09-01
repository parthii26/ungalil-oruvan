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
            : "border-line bg-cream/92 text-ink backdrop-blur-md"
        }`}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
            <button className="md:hidden p-2 -ml-2" aria-label="Open menu" onClick={() => setOpen(true)}>
              <Menu size={20} />
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
                  <div className="min-w-56 border border-line bg-cream p-3 shadow-sm overflow-hidden [clip-path:inset(0_0_100%_0)] group-hover:[clip-path:inset(0)] transition-[clip-path] duration-500">
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

            <Link href="/" className="text-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <span className={`block font-serif text-[1.35rem] tracking-tight leading-none md:text-[1.65rem] ${overHero ? "text-cream" : "text-forest"}`}>
                {brand}
              </span>
              <span className={`hidden md:block font-tamil text-[0.65rem] mt-0.5 ${overHero ? "text-turmeric" : "text-terracotta"}`}>
                {tamilTagline}
              </span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 hidden md:inline-flex" aria-label="Search" onClick={() => setSearch(true)}>
                <Search size={18} />
              </button>
              <Link href={signedIn ? "/account" : "/login"} className="p-2 hidden sm:inline-flex" aria-label="Account">
                <User size={18} />
              </Link>
              <Link href="/account/wishlist" className="p-2 hidden sm:inline-flex" aria-label="Wishlist">
                <Heart size={18} />
              </Link>
              <button
                type="button"
                className={`p-2 relative ${pulse ? "cart-pulse" : ""}`}
                aria-label="Cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 min-w-4 h-4 px-1 rounded-full bg-terracotta text-white text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link href="/shop" className="btn btn-primary hidden lg:inline-flex ml-2 !py-2">
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-cream md:hidden overflow-y-auto"
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <div className="container-page py-4 flex justify-between items-center border-b border-line">
              <span className="font-serif text-2xl text-forest">{brand}</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <nav className="container-page py-8 flex flex-col gap-5 text-lg font-serif text-ink">
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
                  >
                    <Link href={href} onClick={() => setOpen(false)}>
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link href={signedIn ? "/account" : "/login"} onClick={() => setOpen(false)}>
                {signedIn ? "Account" : "Sign in"}
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}

        {search && <SearchDialog onClose={() => setSearch(false)} />}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} subtotal={cartSubtotal} />
      <BottomNav signedIn={signedIn} onSearch={() => setSearch(true)} />
    </>
  );
}
