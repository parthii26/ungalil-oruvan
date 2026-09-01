"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function CursorFollower() {
  const reduce = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    if (!fine || !wide || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    let x = 0,
      y = 0,
      rx = 0,
      ry = 0;
    let label = "";
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest("[data-cursor]") as HTMLElement | null;
      if (tagged) label = tagged.dataset.cursor || "";
      else if (t?.closest("a,button")) label = "";
      else label = "";
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        ring.current.dataset.label = label ? "1" : "0";
      }
      if (labelEl.current) labelEl.current.textContent = label;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [reduce]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden>
      <div
        ref={dot}
        className="absolute top-0 left-0 h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-cream mix-blend-difference"
      />
      <div
        ref={ring}
        className="absolute top-0 left-0 -ml-6 -mt-6 h-12 w-12 rounded-full border border-forest/50 flex items-center justify-center transition-[width,height,margin] duration-200 data-[label='1']:h-16 data-[label='1']:w-16 data-[label='1']:-ml-8 data-[label='1']:-mt-8"
      >
        <span ref={labelEl} className="text-[0.55rem] tracking-[0.16em] uppercase text-forest" />
      </div>
    </div>
  );
}
