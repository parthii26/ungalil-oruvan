"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, easeNatural } from "@/lib/motion";

export function ImageReveal({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={reduce ? false : { scale: 1.05, opacity: 0.6 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: duration.story, ease: easeNatural }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
