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
            className="absolute right-0 top-0 h-full w-[min(380px,100%)] bg-cream border-l border-line p-6 overflow-y-auto"
            initial={reduce ? false : { x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? undefined : { x: 16, opacity: 0 }}
            transition={{ duration: duration.standard, ease: easeNatural }}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl">Basket</h2>
              <button onClick={onClose} className="text-xs uppercase tracking-widest">
                Close
              </button>
            </div>
            {items.length === 0 ? (
              <p className="mt-8 text-ink-soft">Empty.</p>
            ) : (
              <ul className="mt-6 divide-y divide-line">
                {items.map((i, idx) => (
                  <motion.li
                    key={i.item_id}
                    className="py-3 flex gap-3 text-sm"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.2), duration: 0.28, ease: easeNatural }}
                  >
                    {i.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.image} alt="" className="h-16 w-12 object-cover" />
                    )}
                    <div className="flex-1">
                      <p>{i.product_name}</p>
                      <p className="text-ink-soft">
                        {i.variant_title} × {i.quantity}
                      </p>
                    </div>
                    <p>{formatPrice(i.unit_price_paise * i.quantity)}</p>
                  </motion.li>
                ))}
              </ul>
            )}
            <p className="mt-6 text-sm">Estimated subtotal {formatPrice(subtotal)}</p>
            <p className="mt-1 text-xs text-ink-soft">Final totals are calculated on the server at checkout.</p>
            <Link href="/cart" className="btn btn-ghost ink w-full mt-4" onClick={onClose}>
              Cart page
            </Link>
            <Link href="/checkout" className="btn btn-primary w-full mt-2" onClick={onClose}>
              Checkout
            </Link>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
