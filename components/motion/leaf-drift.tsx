"use client";

import { useReducedMotion } from "framer-motion";

function Leaf({ className, delay }: { className: string; delay: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path
        d="M12 3c4 3 8 8 8 12a8 8 0 1 1-16 0c0-4 4-9 8-12z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

export function LeafDrift() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-paddy/40" aria-hidden>
      <Leaf className="absolute left-[8%] top-[18%] h-6 w-6 motion-safe:animate-[leaf1_7s_ease-in-out_infinite]" delay="0s" />
      <Leaf className="absolute right-[12%] top-[28%] h-5 w-5 motion-safe:animate-[leaf2_9s_ease-in-out_infinite]" delay="1.4s" />
    </div>
  );
}
