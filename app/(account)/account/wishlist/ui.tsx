"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { moveWishlistToCartAction, toggleWishlistAction } from "@/lib/actions/account";

export function WishlistButtons({ variantId }: { variantId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <button
        className="btn btn-primary !py-2"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await moveWishlistToCartAction(variantId);
            router.refresh();
          })
        }
      >
        Move to cart
      </button>
      <button
        className="btn btn-ghost !py-2"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await toggleWishlistAction(variantId);
            router.refresh();
          })
        }
      >
        Remove
      </button>
    </div>
  );
}
