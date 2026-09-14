"use client";

import { useActionState } from "react";
import { updateStockAction } from "@/lib/actions/admin";
import type { ProductVariant, Product } from "@/lib/db/types";

function StockRow({ variant, product }: { variant: ProductVariant; product: Product | undefined }) {
  const [state, action, pending] = useActionState(updateStockAction, null);
  const ok = state && "ok" in state && (state as { ok: boolean }).ok;
  return (
    <tr className="border-t border-line">
      <td className="py-2 pr-4 text-sm font-medium">{product?.name ?? "—"}</td>
      <td className="py-2 pr-4 text-sm">{variant.title}</td>
      <td className="py-2 pr-4 font-mono text-xs text-ink-soft">{variant.sku}</td>
      <td className="py-2 pr-4 text-sm capitalize">{variant.status}</td>
      <td className="py-2">
        <form action={action} className="flex items-center gap-2">
          <input type="hidden" name="variant_id" value={variant.id} />
          <input
            name="qty"
            type="number"
            min="0"
            defaultValue={variant.stock_qty}
            className="input w-24 py-1 text-sm"
          />
          <button className="btn btn-ghost text-xs py-1 px-3" disabled={pending}>
            {pending ? "…" : "Save"}
          </button>
          {ok && <span className="text-xs text-green-700">✓ Saved</span>}
        </form>
      </td>
    </tr>
  );
}

export function InventoryTable({
  rows,
}: {
  rows: { variant: ProductVariant; product: Product | undefined }[];
}) {
  return (
    <div className="admin-table-scroll mt-6 md:mt-8">
      <table className="w-full text-sm text-left">
        <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
          <tr>
            <th className="py-2 whitespace-nowrap">Product</th>
            <th className="whitespace-nowrap">Variant</th>
            <th className="whitespace-nowrap">SKU</th>
            <th className="whitespace-nowrap">Status</th>
            <th className="whitespace-nowrap">Stock Qty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ variant, product }) => (
            <StockRow key={variant.id} variant={variant} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
