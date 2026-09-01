"use client";

import { useReducedMotion } from "framer-motion";

export function NaturalLightOverlay() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light opacity-30 motion-safe:animate-[sunDrift_12s_ease-in-out_infinite_alternate]"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,220,160,0.45), transparent 70%)",
      }}
    />
  );
}
