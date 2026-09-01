"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCartItemAction, updateCartQtyAction } from "@/lib/actions/cart";

export function CartControls({ itemId, quantity }: { itemId: string; quantity: number }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        className="border border-line w-8 h-8"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await updateCartQtyAction(itemId, quantity - 1);
            router.refresh();
          })
        }
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-6 text-center">{quantity}</span>
      <button
        className="border border-line w-8 h-8"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await updateCartQtyAction(itemId, quantity + 1);
            router.refresh();
          })
        }
        aria-label="Increase"
      >
        +
      </button>
      <button
        className="ml-4 text-xs uppercase tracking-widest"
        onClick={() =>
          start(async () => {
            await removeCartItemAction(itemId);
            router.refresh();
          })
        }
      >
        Remove
      </button>
    </div>
  );
}
