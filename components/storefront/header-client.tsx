"use client";

import Link from "next/link";
import Image from "next/image";
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
  navItems,
  signedIn,
  isAdmin,
  cartCount,
  cartItems = [],
  cartSubtotal = 0,
}: {
  brand: string;
  tamilTagline: string;
  categories: { name: string; slug: string }[];
  navItems?: { id: string; label: string; url: string }[];
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
  const activeNav = navItems && navItems.length > 0
    ? navItems
    : [
        { id: "1", label: "Shop", url: "/shop" },
        { id: "2", label: "Categories", url: "/shop" },
        { id: "3", label: "About", url: "/about" },
        { id: "4", label: "Our Story", url: "/about#story" },
        { id: "5", label: "Blog", url: "/blog" },
        { id: "6", label: "FAQ", url: "/faq" },
      ];
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
            : "border-line bg-cream/92 text-ink backdrop-blur-md"
        }`}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-3 md:gap-4 md:h-[4.5rem]">
            {/* Mobile Left: [Menu] [LOGO] */}
            <div className="flex md:hidden items-center gap-2 min-w-0">
              <button
                className="-ml-2 grid min-h-11 min-w-11 place-items-center shrink-0"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              >
                <Menu size={22} />
              </button>
              <Link
                href="/"
                aria-label="உங்களில் ஒருவர் — Home"
                className="flex items-center gap-2 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded"
              >
                <Image
                  src="/images/logo.png"
                  alt="உங்களில் ஒருவர் — Home"
                  width={36}
                  height={36}
                  priority
                  className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-black/5 shrink-0"
                />
                <div className="flex flex-col text-left min-w-0">
                  <span className={`font-tamil text-xs sm:text-sm font-bold leading-tight truncate ${overHero ? "text-cream" : "text-forest"}`}>
                    {tamilTagline}
                  </span>
                  <span className={`font-serif text-[0.6rem] sm:text-[0.65rem] tracking-[0.14em] uppercase font-medium leading-tight truncate ${overHero ? "text-turmeric" : "text-terracotta"}`}>
                    {brand}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Left: [LOGO] [Nav: Shop, Categories, About, Our Story, Blog, FAQ] */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/"
                aria-label="உங்களில் ஒருவர் — Home"
                className="group flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded py-1"
              >
                <Image
                  src="/images/logo.png"
                  alt="உங்களில் ஒருவர் — Home"
                  width={44}
                  height={44}
                  priority
                  className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 shrink-0"
                />
                <div className="flex flex-col text-left">
                  <span className={`font-tamil text-sm md:text-base font-bold leading-none tracking-tight ${overHero ? "text-cream" : "text-forest"}`}>
                    {tamilTagline}
                  </span>
                  <span className={`font-serif text-[0.65rem] md:text-[0.7rem] tracking-[0.18em] uppercase font-medium leading-none mt-1 ${overHero ? "text-turmeric" : "text-terracotta"}`}>
                    {brand}
                  </span>
                </div>
              </Link>

              <nav
                className={`flex items-center gap-5 lg:gap-6 text-[0.72rem] tracking-[0.16em] uppercase ${
                  overHero ? "text-cream/80" : "text-ink-soft"
                }`}
              >
                {activeNav.map((item) => {
                  const isCategories =
                    item.label.toUpperCase() === "CATEGORIES" || item.url === "/categories";
                  if (isCategories && categories.length > 0) {
                    return (
                      <div key={item.id} className="relative group">
                        <Link href={item.url} className="hover:text-forest">
                          {item.label}
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
                    );
                  }
                  return (
                    <Link key={item.id} href={item.url} className="hover:text-forest">
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side: Search, Account, Wishlist, Cart, Shop Now */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                className="hidden md:grid min-h-11 min-w-11 place-items-center"
                aria-label="Search"
                onClick={() => setSearch(true)}
              >
                <Search size={19} />
              </button>

              {/* Account Dropdown */}
              <div className="relative group">
                <Link
                  href={signedIn ? (isAdmin ? "/admin" : "/account") : "/login"}
                  className="grid min-h-11 min-w-11 place-items-center"
                  aria-label={signedIn ? (isAdmin ? "Admin Dashboard" : "Account") : "Sign in"}
                  title={signedIn ? (isAdmin ? "Admin Dashboard" : "Account") : "Sign in"}
                >
                  <User size={19} />
                </Link>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full pt-1 transition hidden sm:block z-50">
                  <div className="min-w-48 border border-line bg-cream p-2 shadow-md text-xs font-sans">
                    {signedIn ? (
                      isAdmin ? (
                        <>
                          <div className="px-3 py-1.5 text-[0.65rem] tracking-wider uppercase text-ink-soft border-b border-line">
                            Admin Session
                          </div>
                          <Link href="/admin" className="block px-3 py-2 text-ink hover:bg-paper-deep font-medium">
                            Admin Dashboard
                          </Link>
                          <Link href="/" className="block px-3 py-2 text-ink hover:bg-paper-deep">
                            Storefront
                          </Link>
                          <form action="/api/auth/logout" method="post" className="border-t border-line mt-1">
                            <button type="submit" className="w-full text-left px-3 py-2 text-terracotta hover:bg-paper-deep">
                              Sign out
                            </button>
                          </form>
                        </>
                      ) : (
                        <>
                          <div className="px-3 py-1.5 text-[0.65rem] tracking-wider uppercase text-ink-soft border-b border-line">
                            My Account
                          </div>
                          <Link href="/account" className="block px-3 py-2 text-ink hover:bg-paper-deep">
                            Overview
                          </Link>
                          <Link href="/account/orders" className="block px-3 py-2 text-ink hover:bg-paper-deep">
                            Orders
                          </Link>
                          <Link href="/account/wishlist" className="block px-3 py-2 text-ink hover:bg-paper-deep">
                            Wishlist
                          </Link>
                          <form action="/api/auth/logout" method="post" className="border-t border-line mt-1">
                            <button type="submit" className="w-full text-left px-3 py-2 text-terracotta hover:bg-paper-deep">
                              Sign out
                            </button>
                          </form>
                        </>
                      )
                    ) : (
                      <>
                        <Link href="/login" className="block px-3 py-2 text-ink hover:bg-paper-deep font-medium">
                          Sign in
                        </Link>
                        <Link href="/auth/register" className="block px-3 py-2 text-ink-soft hover:bg-paper-deep">
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

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
            className="fixed inset-0 z-50 bg-cream md:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <div className="container-page py-3 flex justify-between items-center border-b border-line">
              <Link href="/" onClick={() => setOpen(false)} aria-label="உங்களில் ஒருவர் — Home" className="flex items-center gap-2.5">
                <Image
                  src="/images/logo.png"
                  alt="உங்களில் ஒருவர் — Home"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-black/5"
                />
                <div className="flex flex-col text-left">
                  <span className="font-tamil text-sm font-bold text-forest leading-none">{tamilTagline}</span>
                  <span className="font-serif text-[0.62rem] tracking-[0.14em] uppercase font-medium text-terracotta leading-none mt-0.5">{brand}</span>
                </div>
              </Link>
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
              {activeNav.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 * i, ease: easeOut }}
                  className="border-b border-line/60"
                >
                  <Link href={item.url} onClick={() => setOpen(false)} className="flex min-h-12 items-center py-2">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {signedIn ? (
                isAdmin ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-line/60 py-2 text-earth font-medium"
                    >
                      Admin Dashboard
                    </Link>
                    <form action="/api/auth/logout" method="post" className="py-2 border-b border-line/60">
                      <button type="submit" className="flex min-h-12 items-center text-sm text-terracotta">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center border-b border-line/60 py-2"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
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
                    <form action="/api/auth/logout" method="post" className="py-2 border-b border-line/60">
                      <button type="submit" className="flex min-h-12 items-center text-sm text-terracotta">
                        Sign out
                      </button>
                    </form>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center border-b border-line/60 py-2"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center border-b border-line/60 py-2"
                  >
                    Create account
                  </Link>
                </>
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
