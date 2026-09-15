"use client";

import Image from "next/image";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { easeOut } from "@/lib/motion";

export function StoryHeading({
  kicker,
  tamil,
  children,
  light = false,
}: {
  kicker?: string;
  tamil?: string;
  children: ReactNode;
  light?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      {tamil && (
        <p className={`font-tamil text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-1 ${light ? "text-turmeric" : "text-forest"}`}>
          {tamil}
        </p>
      )}
      {kicker && (
        <p className={`text-[0.65rem] tracking-[0.2em] uppercase mb-1 ${light ? "text-turmeric/80" : "text-earth"}`}>
          {kicker}
        </p>
      )}
      <motion.h2
        className={`font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight ${light ? "text-cream" : "text-ink"} ${kicker ? "mt-1" : "mt-0.5"}`}
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0.2 }}
        whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: easeOut }}
      >
        {children}
      </motion.h2>
    </div>
  );
}

/** Vertical slit opens into the photograph. Used only on major story images. */
export function MaskImage({
  src,
  alt,
  className = "",
  hint,
}: {
  src: string;
  alt: string;
  className?: string;
  hint?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] });
  const open = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [48, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1]);
  const clipPath = useTransform(open, (v) => `inset(0 ${v}% 0 ${v}%)`);

  return (
    <div ref={ref} className={`overflow-hidden bg-paper-deep ${className}`}>
      <motion.div className="relative h-full w-full" style={{ clipPath, scale }}>
        <Image src={src} alt={alt} data-hint={hint} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

/** 1–2% focus shift on a major editorial image. Farmer body is not deformed. */
export function EditorialImage({
  src,
  alt,
  className = "",
  hint,
}: {
  src: string;
  alt: string;
  className?: string;
  hint?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative overflow-hidden bg-paper-deep ${className}`}>
      <Image
        src={src}
        alt={alt}
        data-hint={hint}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover will-change-transform transition-transform duration-500 ease-out"
        onPointerMove={(e) => {
          if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          e.currentTarget.style.transform = `scale(1.03) translate(${px * -1.4}%, ${py * -1.1}%)`;
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
    </div>
  );
}

/** One major headline — letters shift 1–3px with the pointer. */
export function ReactiveHeadline({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const lines = children.split("\n");

  return (
    <h1 className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split("").map((ch, i) => (
            <span
              key={`${li}-${i}`}
              className="inline-block will-change-transform"
              onPointerMove={(e) => {
                if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
                const r = e.currentTarget.getBoundingClientRect();
                const dx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 3;
                const dy = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
                e.currentTarget.style.transform = `translate(${dx}px, ${dy}px)`;
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/** Grain photograph becomes the words OUR SOIL. */
export function SoilType({ src = "/images/harvest-grain.jpg" }: { src?: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="bg-charcoal py-20 md:py-28 overflow-hidden">
      <p className="mb-4 text-center font-tamil text-turmeric font-bold text-3xl sm:text-4xl md:text-5xl">நமது மண்</p>
      <motion.p
        className="container-page text-center font-serif leading-none text-transparent bg-clip-text bg-cover bg-center select-none"
        style={{
          backgroundImage: `url(${src})`,
          fontSize: "clamp(3.4rem, 16vw, 11rem)",
          WebkitBackgroundClip: "text",
        }}
        initial={reduce ? false : { clipPath: "inset(0 40% 0 40%)", opacity: 0.4 }}
        whileInView={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: easeOut }}
      >
        OUR SOIL
      </motion.p>
    </section>
  );
}

export function CountUp({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <p className="font-serif text-3xl md:text-5xl text-forest tabular-nums">
        <Ticker to={value} reduce={Boolean(reduce)} />
      </p>
      <p className="mt-1 text-[0.68rem] tracking-[0.18em] uppercase text-earth">{label}</p>
    </div>
  );
}

function Ticker({ to, reduce }: { to: number; reduce: boolean }) {
  const [display, setDisplay] = useState(to);

  useEffect(() => {
    if (reduce || to === 0) {
      setDisplay(to);
      return;
    }
    let start: number | null = null;
    const dur = 800;
    let frameId: number;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(to * eased));
      if (t < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [to, reduce]);

  return <span>{display}</span>;
}
