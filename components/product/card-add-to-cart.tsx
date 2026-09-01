"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/lib/actions/cart";

export function CardAddToCart({ variantId }: { variantId: string }) {
  const [pending, start] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();
  return (
    <div className="mt-3 opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition duration-300">
      <button
        type="button"
        className="btn btn-ghost ink !py-2 w-full"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await addToCartAction(variantId, 1);
            if (res.ok) {
              setAdded(true);
              window.dispatchEvent(new Event("vz:cart-add"));
              router.refresh();
              window.setTimeout(() => setAdded(false), 1200);
            }
          })
        }
      >
        {pending ? "Adding…" : added ? "In the basket" : "Add to cart"}
      </button>
    </div>
  );
}
