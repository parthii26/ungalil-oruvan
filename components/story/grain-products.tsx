"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";

const GRAINS = [
  { x: "18%", y: "22%", s: 10, d: 0 },
  { x: "38%", y: "40%", s: 8, d: 0.05 },
  { x: "58%", y: "18%", s: 12, d: 0.08 },
  { x: "74%", y: "46%", s: 9, d: 0.12 },
  { x: "28%", y: "62%", s: 11, d: 0.16 },
  { x: "50%", y: "58%", s: 7, d: 0.2 },
  { x: "66%", y: "72%", s: 10, d: 0.24 },
  { x: "84%", y: "28%", s: 8, d: 0.28 },
];

/** Grain appears, multiplies, then becomes the product grid. */
export function GrainProducts({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {!reduce && (
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-40 overflow-hidden" aria-hidden>
          {GRAINS.map((g, i) => (
            <motion.span
              key={i}
              className="absolute rounded-[40%_60%_55%_45%] bg-earth/70"
              style={{ left: g.x, top: g.y, width: g.s, height: g.s * 1.35 }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: [0, 0.85, 0], scale: [0.4, 1, 0.8] }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.4, delay: g.d, ease: easeOut, times: [0, 0.45, 1] }}
            />
          ))}
        </div>
      )}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: reduce ? 0 : 0.35, ease: easeOut }}
      >
        {children}
      </motion.div>
    </div>
  );
}
