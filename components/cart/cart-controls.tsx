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
        className="grid size-11 place-items-center border border-line bg-warmwhite text-lg leading-none active:bg-paper-deep disabled:opacity-50"
        disabled={pending || quantity <= 1}
        onClick={() =>
          start(async () => {
            await updateCartQtyAction(itemId, quantity - 1);
            router.refresh();
          })
        }
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-8 text-center tabular-nums" aria-live="polite">{quantity}</span>
      <button
        className="grid size-11 place-items-center border border-line bg-warmwhite text-lg leading-none active:bg-paper-deep disabled:opacity-50"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await updateCartQtyAction(itemId, quantity + 1);
            router.refresh();
          })
        }
        aria-label="Increase quantity"
      >
        +
      </button>
      <button
        className="ml-3 inline-flex min-h-11 items-center px-1 text-xs uppercase tracking-widest underline underline-offset-4"
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
