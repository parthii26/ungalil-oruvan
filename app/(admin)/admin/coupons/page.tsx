import Link from "next/link";
import { listAllCoupons } from "@/lib/repositories/coupons";
import { formatDate, formatPrice } from "@/lib/formatters";

export const metadata = { title: "Coupons" };

export default function AdminCouponsPage() {
  const coupons = listAllCoupons();
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl md:text-4xl">Coupons</h1>
        <Link href="/admin/coupons/new" className="btn btn-primary">New coupon</Link>
      </div>
      <div className="admin-table-scroll mt-6 md:mt-8">
        <table className="w-full text-sm text-left">
          <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
            <tr>
              <th className="py-2 whitespace-nowrap">Code</th>
              <th className="whitespace-nowrap">Type</th>
              <th className="whitespace-nowrap">Value</th>
              <th className="whitespace-nowrap">Min order</th>
              <th className="whitespace-nowrap">Active</th>
              <th className="whitespace-nowrap">Expires</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-ink-soft">No coupons yet.</td></tr>
            )}
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="py-2 font-mono font-medium">{c.code}</td>
                <td className="py-2">{c.type}</td>
                <td className="py-2">
                  {c.type === "percentage" ? `${c.value}%` : formatPrice(c.value)}
                </td>
                <td className="py-2">{formatPrice(c.min_subtotal_paise)}</td>
                <td className="py-2">{c.is_active ? "Yes" : "No"}</td>
                <td className="py-2 whitespace-nowrap">{formatDate(c.ends_at)}</td>
                <td className="py-2">
                  <Link href={`/admin/coupons/${c.id}`} className="underline underline-offset-4 text-xs">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
