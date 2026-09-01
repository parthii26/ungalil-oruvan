"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProductVariant } from "@/lib/db/types";
import { formatPrice, formatWeight, discountPercent } from "@/lib/formatters";
import { addToCartAction } from "@/lib/actions/cart";
import { toggleWishlistAction } from "@/lib/actions/account";

export function ProductPurchase({
  variants,
  wished,
}: {
  variants: ProductVariant[];
  wished: boolean;
}) {
  const active = variants.filter((v) => v.status === "active");
  const [id, setId] = useState(active[0]?.id ?? variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const selected = useMemo(() => variants.find((v) => v.id === id), [variants, id]);

  if (!selected) return <p>This product has no options.</p>;

  const disc = discountPercent(selected.price_paise, selected.compare_at_paise);
  const available = selected.status === "active";

  return (
    <div>
      <p className="text-3xl transition-opacity duration-200" key={selected.id}>
        {formatPrice(selected.price_paise)}
        {selected.compare_at_paise && selected.compare_at_paise > selected.price_paise && (
          <span className="ml-3 text-lg text-ink-soft line-through">{formatPrice(selected.compare_at_paise)}</span>
        )}
        {disc != null && <span className="ml-3 text-sm text-accent">{disc}% off</span>}
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        SKU {selected.sku} · {formatWeight(selected.weight_grams)} · {available ? "In catalogue" : "Unavailable"}
      </p>

      <fieldset className="mt-6">
        <legend className="label">Size</legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setId(v.id)}
              className={`px-4 py-2 border text-sm ${v.id === id ? "border-ink bg-ink text-paper" : "border-line"}`}
            >
              {v.title}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center gap-3">
        <label className="label mb-0" htmlFor="qty">
          Qty
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={20}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="input w-20"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          disabled={!available || pending}
          onClick={() =>
            start(async () => {
              const res = await addToCartAction(selected.id, qty);
              setMsg(res.ok ? "Added" : res.error);
              if (res.ok) window.dispatchEvent(new Event("vz:cart-add"));
              router.refresh();
            })
          }
        >
          Add to cart
        </button>
        <button
          className="btn btn-accent"
          disabled={!available || pending}
          onClick={() =>
            start(async () => {
              const res = await addToCartAction(selected.id, qty);
              if (res.ok) router.push("/checkout");
              else setMsg(res.error);
            })
          }
        >
          Buy now
        </button>
        <button
          className="btn btn-ghost"
          onClick={() =>
            start(async () => {
              const res = await toggleWishlistAction(selected.id);
              setMsg(res.ok ? "Wishlist updated" : res.error);
              router.refresh();
            })
          }
        >
          {wished ? "Saved" : "Wishlist"}
        </button>
      </div>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
