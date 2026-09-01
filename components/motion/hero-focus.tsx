"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function HeroFocus({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion();
  const img = useRef<HTMLImageElement>(null);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={img}
      src={src}
      alt={alt}
      data-cursor="explore"
      className="absolute inset-0 h-full w-full object-cover scale-[1.04] will-change-transform"
      onPointerMove={(e) => {
        if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        e.currentTarget.style.transform = `scale(1.05) translate(${px * -10}px, ${py * -8}px)`;
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
      }}
    />
  );
}
