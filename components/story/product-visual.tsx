"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

export function ProductVisual({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep shadow-[0_10px_30px_-24px_rgba(41,39,34,0.7)] transition-colors duration-300 group-hover:bg-[#3d7237]">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-[1.5%] group-hover:scale-[1.03]"
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
    </div>
  );
}
