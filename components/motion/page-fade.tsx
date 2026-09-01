"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, easeNatural } from "@/lib/motion";

export function PageFade({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.standard, ease: easeNatural }}
    >
      {children}
    </motion.div>
  );
}
