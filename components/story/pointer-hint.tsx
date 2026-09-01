"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Contextual label beside the native pointer. Never replaces the cursor. */
export function PointerHint() {
  const reduce = useReducedMotion();
  const el = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const ok =
      !reduce &&
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(min-width: 768px)").matches;
    if (!ok) return;
    setOn(true);

    const node = el.current;
    if (!node) return;

    const onMove = (e: PointerEvent) => {
      const host = (e.target as HTMLElement | null)?.closest("[data-hint]") as HTMLElement | null;
      const label = host?.dataset.hint ?? "";
      if (!label) {
        node.dataset.show = "0";
        return;
      }
      node.dataset.show = "1";
      node.textContent = label;
      node.style.transform = `translate3d(${e.clientX + 14}px, ${e.clientY + 12}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  if (!on) return null;

  return (
    <div
      ref={el}
      data-show="0"
      className="pointer-events-none fixed left-0 top-0 z-[85] hidden md:block text-[0.58rem] tracking-[0.2em] uppercase text-earth bg-cream/90 px-2 py-1 opacity-0 data-[show='1']:opacity-100 transition-opacity duration-200"
      aria-hidden
    />
  );
}
