"use client";

import { useReducedMotion } from "framer-motion";

function originLabel(origin: string | null): string | null {
  if (!origin) return null;
  if (/tamil nadu/i.test(origin)) return "Tamil Nadu";
  const short = origin.split(",")[0]?.trim();
  return short || "Farm sourced";
}

export function ProductVisual({
  src,
  alt,
  origin,
}: {
  src: string | null;
  alt: string;
  origin: string | null;
}) {
  const reduce = useReducedMotion();
  const label = originLabel(origin);

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep shadow-[0_10px_30px_-24px_rgba(41,39,34,0.7)] transition-colors duration-300 group-hover:bg-[#e6dcc8]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-[1.5%] group-hover:scale-[1.03]"
          onPointerMove={(e) => {
            if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
            const r = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            e.currentTarget.style.transform = `scale(1.03) translateX(${px * 1.6}%)`;
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-sm text-ink-soft">No image</div>
      )}
      {label && (
        <span className="pointer-events-none absolute left-3 bottom-3 text-[0.58rem] tracking-[0.18em] uppercase text-cream opacity-0 translate-y-1 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {label}
        </span>
      )}
    </div>
  );
}
