"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/formatters";
import { duration, easeNatural } from "@/lib/motion";

export function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
}: {
  open: boolean;
  onClose: () => void;
  items: { item_id: string; product_name: string; variant_title: string; quantity: number; unit_price_paise: number; image: string | null }[];
  subtotal: number;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.button
            className="absolute inset-0 bg-charcoal/40"
            aria-label="Close cart"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-[min(400px,100%)] flex-col bg-cream border-l border-line"
            role="dialog"
            aria-modal="true"
            aria-label="Basket"
            initial={reduce ? false : { x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? undefined : { x: 16, opacity: 0 }}
            transition={{ duration: duration.standard, ease: easeNatural }}
          >
            <div className="flex justify-between items-center p-5 md:p-6 pb-4 border-b border-line">
              <h2 className="font-serif text-2xl">Basket</h2>
              <button
                onClick={onClose}
                className="grid min-h-11 min-w-11 place-items-center -mr-2 text-xs uppercase tracking-widest"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 md:px-6 overscroll-contain">
              {items.length === 0 ? (
                <p className="mt-8 text-ink-soft">Empty.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((i, idx) => (
                    <motion.li
                      key={i.item_id}
                      className="py-4 flex gap-3 text-sm"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.2), duration: 0.28, ease: easeNatural }}
                    >
                      {i.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={i.image} alt="" loading="lazy" decoding="async" className="h-16 w-12 shrink-0 object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="leading-snug">{i.product_name}</p>
                        <p className="text-ink-soft">
                          {i.variant_title} × {i.quantity}
                        </p>
                      </div>
                      <p className="whitespace-nowrap">{formatPrice(i.unit_price_paise * i.quantity)}</p>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            <div
              className="border-t border-line bg-cream p-5 md:p-6 pt-4"
              style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
            >
              <p className="text-sm flex justify-between gap-2">
                <span>Estimated subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </p>
              <p className="mt-1 text-xs text-ink-soft">Final totals are calculated on the server at checkout.</p>
              <Link href="/cart" className="btn btn-ghost ink w-full mt-4" onClick={onClose}>
                Cart page
              </Link>
              <Link href="/checkout" className="btn btn-primary w-full mt-2" onClick={onClose}>
                Checkout
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
