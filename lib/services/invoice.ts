import type { Order, OrderItem } from "@/lib/db/types";
import { formatPrice, formatDate } from "@/lib/formatters";

/**
 * Stage 2 — PDF Invoice generator.
 * Produces structured printable invoice data or HTML format suitable for print/PDF export.
 */

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customerEmail: string;
  shippingAddress: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }[];
  subtotal: string;
  discount: string;
  shipping: string;
  grandTotal: string;
}

export function generateInvoiceData(order: Order, items: OrderItem[]): InvoiceData {
  return {
    invoiceNumber: `INV-${order.order_number}`,
    orderNumber: order.order_number,
    date: formatDate(order.created_at),
    customerEmail: order.email,
    shippingAddress: `${order.shipping_address.name}, ${order.shipping_address.line1}, ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}`,
    items: items.map((i) => ({
      description: `${i.product_name} — ${i.variant_title}`,
      quantity: i.quantity,
      unitPrice: formatPrice(i.unit_price_paise),
      total: formatPrice(i.line_total_paise),
    })),
    subtotal: formatPrice(order.subtotal_paise),
    discount: formatPrice(order.discount_paise),
    shipping: formatPrice(order.shipping_paise),
    grandTotal: formatPrice(order.grand_total_paise),
  };
}
