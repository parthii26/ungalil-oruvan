"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const BEATS = [
  {
    k: "SEED",
    ta: "விதை",
    e: "A closed beginning. Nothing claimed yet.",
    img: "/images/soil-hands.jpg",
    tone: "#1a2118",
  },
  {
    k: "FIELD",
    ta: "வயல்",
    e: "Rows hold the morning. The photograph begins here.",
    img: "/images/farm-dawn.jpg",
    tone: "#243c2a",
  },
  {
    k: "HARVEST",
    ta: "அறுவடை",
    e: "Green gives way to gold when the grain is ready.",
    img: "/images/harvest-grain.jpg",
    tone: "#3a3018",
  },
  {
    k: "GRAIN",
    ta: "தானியம்",
    e: "Still warm from the sun. Named, not blended.",
    img: "/images/millet-foxtail.jpg",
    tone: "#4a3a22",
  },
  {
    k: "PRODUCT",
    ta: "பொருள்",
    e: "A small lot. A short list. A jar that remembers the season.",
    img: "/images/honey.jpg",
    tone: "#2a2118",
  },
  {
    k: "TABLE",
    ta: "மேசை",
    e: "The last mile is the kitchen.",
    img: "/images/table-spread.jpg",
    tone: "#1c1814",
  },
];

function Panel({
  beat,
  index,
}: {
  beat: (typeof BEATS)[number];
  index: number;
}) {
  return (
    <article className="relative min-h-[88svh] w-full shrink-0 overflow-hidden md:h-[100svh] md:min-h-0 md:w-screen">
      <div className="absolute inset-0" style={{ background: beat.tone }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={beat.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-16 md:px-20 md:pb-20">
        <p className="text-[0.62rem] tracking-[0.28em] uppercase text-turmeric/80">
          {String(index + 1).padStart(2, "0")} / {String(BEATS.length).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-serif text-[clamp(3rem,8vw,7rem)] leading-none text-cream">{beat.k}</h3>
        <p className="mt-2 font-tamil text-lg text-turmeric">{beat.ta}</p>
        <p className="mt-4 max-w-md text-cream/80">{beat.e}</p>
      </div>
      <svg className="pointer-events-none absolute inset-x-0 top-1/2 h-px w-full" aria-hidden>
        <line x1="0" y1="1" x2="100%" y2="1" stroke="#C49A3A" strokeOpacity="0.35" />
      </svg>
    </article>
  );
}

export function StickyJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(BEATS.length - 1) * 100}vw`]);

  if (reduce) {
    return (
      <section className="bg-charcoal" data-hint="Explore">
        {BEATS.map((beat, i) => (
          <Panel key={beat.k} beat={beat} index={i} />
        ))}
      </section>
    );
  }

  return (
    <>
      <section
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${BEATS.length * 100}vh` }}
        data-hint="Scroll"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div className="flex h-full" style={{ x, width: `${BEATS.length * 100}vw` }}>
            {BEATS.map((beat, i) => (
              <Panel key={beat.k} beat={beat} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
      <section className="md:hidden bg-charcoal">
        {BEATS.map((beat, i) => (
          <Panel key={beat.k} beat={beat} index={i} />
        ))}
      </section>
    </>
  );
}
