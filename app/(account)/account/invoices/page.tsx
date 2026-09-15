import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { listMine } from "@/lib/services/orders";
import { formatDate, formatPrice } from "@/lib/formatters";

export const metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  const session = await getSession();
  const orders = session?.customerId ? listMine(session.customerId) : [];

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">Invoices</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Download or print official tax receipts and order invoices.
      </p>

      {orders.length === 0 ? (
        <p className="mt-6 text-ink-soft">No invoices available. Place an order to receive an invoice.</p>
      ) : (
        <div className="admin-table-scroll mt-6 md:mt-8">
          <table className="w-full text-sm text-left">
            <thead className="text-[0.65rem] tracking-widest uppercase text-ink-soft">
              <tr>
                <th className="py-2 whitespace-nowrap">Invoice #</th>
                <th className="whitespace-nowrap">Order #</th>
                <th className="whitespace-nowrap">Date</th>
                <th className="whitespace-nowrap">Total</th>
                <th className="whitespace-nowrap">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="py-3 font-mono font-medium">INV-{o.order_number}</td>
                  <td className="py-3">
                    <Link href={`/account/orders/${o.id}`} className="underline underline-offset-4">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="py-3 whitespace-nowrap">{formatDate(o.created_at)}</td>
                  <td className="py-3 whitespace-nowrap">{formatPrice(o.grand_total_paise)}</td>
                  <td className="py-3 capitalize whitespace-nowrap">
                    {o.status.replaceAll("_", " ")}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/account/invoices/${o.id}`}
                      className="btn btn-ghost text-xs py-1 px-3"
                    >
                      View Invoice ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
