import * as ordersRepo from "@/lib/repositories/orders";
import { generateInvoiceData, type InvoiceData } from "./invoice";

/** Stage 2 Tax Invoice Service */
export class InvoiceService {
  isConfigured(): boolean {
    return true;
  }

  issue(orderId: string): { issued: boolean; invoice?: InvoiceData; reason?: string } {
    const order = ordersRepo.getOrderById(orderId);
    if (!order) {
      return { issued: false, reason: "Order not found." };
    }

    const items = ordersRepo.listOrderItems(order.id);
    const invoice = generateInvoiceData(order, items);
    return { issued: true, invoice };
  }
}

export const invoiceService = new InvoiceService();

