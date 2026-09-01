import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  asChild,
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "ghost" | "accent" | "danger"; asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "btn disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "btn-primary",
        variant === "ghost" && "btn-ghost",
        variant === "accent" && "btn-accent",
        variant === "danger" && "bg-danger text-white",
        className,
      )}
      {...props}
    />
  );
}
