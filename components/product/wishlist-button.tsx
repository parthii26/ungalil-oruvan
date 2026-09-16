"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/lib/actions/account";
import { useRouter } from "next/navigation";

export function WishlistButton({
  variantId,
  initialWished = false,
}: {
  variantId: string;
  initialWished?: boolean;
}) {
  const [wished, setWished] = useState(initialWished);
  const [pending, start] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const nextState = !wished;
    setWished(nextState);

    start(async () => {
      try {
        const res = await toggleWishlistAction(variantId);
        if (!res.ok) {
          setWished(!nextState);
          setNotice(res.error ?? "Sign in to save items");
          setTimeout(() => setNotice(null), 2800);
        } else {
          router.refresh();
        }
      } catch {
        setWished(!nextState);
        setNotice("Could not update wishlist");
        setTimeout(() => setNotice(null), 2800);
      }
    });
  };

  return (
    <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className="flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-full text-ink-soft hover:text-terracotta hover:bg-paper/70 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
      >
        <Heart
          className={`w-5 h-5 transition-transform duration-200 active:scale-125 ${
            wished
              ? "fill-terracotta stroke-terracotta text-terracotta"
              : "stroke-current"
          }`}
        />
      </button>
      {notice && (
        <div
          role="status"
          className="absolute right-0 top-9 z-30 whitespace-nowrap rounded-md bg-charcoal text-cream px-2.5 py-1 text-xs shadow-md"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
