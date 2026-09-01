"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";

const WORDS = ["FIELD", "GOLD", "GRAIN", "PACK", "TABLE"] as const;

/** Green field → golden harvest → grain → product. Color and mask, not a cartoon scene. */
export function HarvestMorph() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const gold = useTransform(scrollYProgress, [0.05, 0.38], [0, 0.72]);
  const grain = useTransform(scrollYProgress, [0.32, 0.58], [0, 0.85]);
  const pack = useTransform(scrollYProgress, [0.52, 0.78], [48, 0]);
  const product = useTransform(scrollYProgress, [0.7, 0.92], [0, 1]);
  const wordIndex = useTransform(scrollYProgress, [0, 0.28, 0.5, 0.72, 1], [0, 1, 2, 3, 4]);
  const clip = useMotionTemplate`inset(0 ${pack}% 0 ${pack}%)`;
  const goldWash = useMotionTemplate`rgba(196,154,58,${gold})`;
  const [word, setWord] = useState<(typeof WORDS)[number]>(WORDS[0]);

  useEffect(() => {
    const unsub = wordIndex.on("change", (v) => {
      const next = WORDS[Math.min(WORDS.length - 1, Math.max(0, Math.round(v)))];
      setWord(next);
    });
    return () => unsub();
  }, [wordIndex]);

  if (reduce) {
    return (
      <section className="relative min-h-[80vh] overflow-hidden bg-earth">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/table-spread.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="relative z-10 flex min-h-[80vh] items-end px-8 py-16 md:px-20">
          <div>
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-turmeric">Harvest</p>
            <h2 className="mt-2 font-serif text-5xl text-cream">From green to the table</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[220vh] bg-[#243c2a]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/farm-dawn.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <motion.div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: goldWash }} />
        <motion.div className="absolute inset-0" style={{ opacity: grain }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/harvest-grain.jpg" alt="" className="h-full w-full object-cover mix-blend-soft-light" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/process-wood.jpg" alt="" className="h-full w-full object-cover" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ opacity: product }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/table-spread.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/35" />
        </motion.div>
        <div className="relative z-10 flex h-full items-end px-8 pb-16 md:px-20">
          <div>
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-turmeric">Harvest · material</p>
            <h2 className="mt-2 font-serif text-5xl text-cream md:text-6xl">{word}</h2>
            <p className="mt-4 max-w-md text-cream/75">
              Colour, grain, and packing — one continuous change. No staged harvest scene.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
