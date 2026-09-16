"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/lib/actions/cart";
import { ShoppingBag, Check } from "lucide-react";

export function CardAddToCart({
  variantId,
  isOutOfStock = false,
}: {
  variantId: string;
  isOutOfStock?: boolean;
}) {
  const [pending, start] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  if (isOutOfStock) {
    return (
      <div className="w-full" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full min-h-[46px] py-3 px-5 rounded-xl border border-line bg-paper-deep text-ink-soft text-sm font-semibold tracking-wider uppercase cursor-not-allowed opacity-80 select-none"
        >
          Sold Out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (pending) return;
          start(async () => {
            const res = await addToCartAction(variantId, 1);
            if (res.ok) {
              setAdded(true);
              window.dispatchEvent(new Event("vz:cart-add"));
              router.refresh();
              setTimeout(() => setAdded(false), 1400);
            }
          });
        }}
        className={`w-full min-h-[46px] py-3 px-5 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-xs select-none ${
          added
            ? "bg-forest-light text-white"
            : "bg-forest text-cream hover:bg-forest-light active:scale-[0.98]"
        }`}
      >
        {pending ? (
          <span>Adding…</span>
        ) : added ? (
          <>
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Added</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}
