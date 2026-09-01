"use client";

import { usePathname } from "next/navigation";
import { PointerHint } from "@/components/story/pointer-hint";

export function MotionRoot() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return <PointerHint />;
}
