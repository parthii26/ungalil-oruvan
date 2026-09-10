"use client";

import { useEffect, useState } from "react";

/**
 * Mobile-only bar pinned above the bottom nav. Appears once the main buy
 * box scrolls out of view; tapping it returns to the size/qty picker so the
 * customer always adds the variant they chose.
 */
export function StickyBuyBar({ price, variantTitle }: { price: string; variantTitle: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("buy-box");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta-bar md:hidden">
      <div className="border-t border-line bg-basil-deep/95 backdrop-blur">
        <div className="container-page flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl leading-none">{price}</p>
            <p className="mt-1 truncate text-xs text-ink-soft">{variantTitle}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary shrink-0"
            onClick={() => document.getElementById("buy-box")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
