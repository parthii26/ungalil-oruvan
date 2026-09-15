import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getOrderById, listOrderItems } from "@/lib/repositories/orders";
import { getSiteSettings } from "@/lib/services/settings";
import { formatPrice, formatDate } from "@/lib/formatters";
import Link from "next/link";
import { PrintButton } from "./print-button";

export const metadata = { title: "Tax Invoice" };

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;

  const order = getOrderById(id);
  if (!order) notFound();

  // Ensure security: only order owner or admin can view
  const isOwner = session?.customerId && order.customer_id === session.customerId;
  const isAdmin = session?.role === "admin";
  if (!isOwner && !isAdmin) notFound();

  const items = listOrderItems(order.id);
  const settings = getSiteSettings();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 print:p-0">
      {/* Navigation and print action (hidden in print) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/account/invoices" className="text-sm underline underline-offset-4 text-ink-soft hover:text-ink">
          ← Back to Invoices
        </Link>
        <PrintButton />
      </div>

      {/* Invoice Card */}
      <div className="border border-line bg-white p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-line pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest">{settings.brand_name}</h1>
            <p className="text-xs text-ink-soft mt-1">{settings.tamil_tagline}</p>
            {settings.address && <p className="text-xs text-ink-soft mt-1 max-w-xs">{settings.address}</p>}
            <p className="text-xs text-ink-soft">Email: {settings.contact_email} | Tel: {settings.contact_phone}</p>
            {settings.gstin && <p className="text-xs font-mono font-medium mt-1">GSTIN: {settings.gstin}</p>}
            {settings.fssai && <p className="text-xs font-mono font-medium">FSSAI Lic: {settings.fssai}</p>}
          </div>
          <div className="text-right">
            <span className="label">TAX INVOICE</span>
            <p className="font-mono text-lg font-bold mt-1">INV-{order.order_number}</p>
            <p className="text-xs text-ink-soft mt-1">Date: {formatDate(order.created_at)}</p>
            <p className="text-xs text-ink-soft">Order: {order.order_number}</p>
          </div>
        </div>

        {/* Bill & Ship To */}
        <div className="grid sm:grid-cols-2 gap-6 my-6 text-xs">
          <div>
            <p className="label text-[0.65rem] mb-1">Billed & Shipped To</p>
            <p className="font-semibold text-sm">{order.shipping_address.name}</p>
            <p>{order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}</p>
            <p className="mt-1">Phone: {order.shipping_address.phone}</p>
            <p>Email: {order.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="label text-[0.65rem] mb-1">Order Details</p>
            <p>Payment Status: <span className="font-semibold capitalize">{order.status.replaceAll("_", " ")}</span></p>
            <p>Currency: INR (₹)</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs text-left my-6">
          <thead className="border-y border-line uppercase tracking-wider text-[0.65rem] text-ink-soft bg-warmwhite/50">
            <tr>
              <th className="py-2.5 px-2">Item Description</th>
              <th className="py-2.5 px-2 text-center">Qty</th>
              <th className="py-2.5 px-2 text-right">Unit Price</th>
              <th className="py-2.5 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="py-2.5 px-2">
                  <p className="font-medium text-ink">{i.product_name}</p>
                  <p className="text-ink-soft text-[0.7rem]">{i.variant_title} · SKU: {i.sku}</p>
                </td>
                <td className="py-2.5 px-2 text-center">{i.quantity}</td>
                <td className="py-2.5 px-2 text-right">{formatPrice(i.unit_price_paise)}</td>
                <td className="py-2.5 px-2 text-right font-medium">{formatPrice(i.line_total_paise)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculations */}
        <div className="border-t border-line pt-4 flex justify-end text-xs">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span>{formatPrice(order.subtotal_paise)}</span>
            </div>
            {order.discount_paise > 0 && (
              <div className="flex justify-between text-forest font-medium">
                <span>Discount</span>
                <span>-{formatPrice(order.discount_paise)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-soft">Shipping</span>
              <span>{formatPrice(order.shipping_paise)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-line pt-2 text-ink">
              <span>Grand Total</span>
              <span>{formatPrice(order.grand_total_paise)}</span>
            </div>
          </div>
        </div>

        {/* Footer notes */}
        <div className="border-t border-line mt-8 pt-4 text-[0.7rem] text-ink-soft text-center space-y-1">
          <p>Thank you for supporting natural farming and authentic traditional food.</p>
          <p>This is a computer-generated tax invoice and does not require a physical signature.</p>
        </div>
      </div>
    </div>
  );
}
