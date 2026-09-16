"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductCard as CardType } from "@/lib/services/catalog";
import { ProductCard } from "./product-card";

export function ProductCarousel({
  items,
}: {
  items: CardType[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, items]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const scrollStep = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({
      left: direction === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {/* Navigation Arrow Controls (Visible on tablet & desktop) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          disabled={!canScrollLeft}
          aria-label="Previous products"
          className="w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-ink hover:border-forest hover:text-forest disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          disabled={!canScrollRight}
          aria-label="Next products"
          className="w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-ink hover:border-forest hover:text-forest disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Scroller */}
      <div
        ref={scrollerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-1 px-1 -mx-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        tabIndex={0}
        role="region"
        aria-label="Product carousel"
      >
        {items.map((card) => (
          <div
            key={card.product.id}
            data-carousel-item
            className="w-[84vw] max-w-[340px] sm:w-[280px] md:w-[290px] flex-shrink-0 snap-start flex flex-col"
          >
            <ProductCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
