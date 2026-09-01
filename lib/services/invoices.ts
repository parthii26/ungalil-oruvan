/** Stage 2 interface — PDF invoices are not generated. */
export class InvoiceService {
  isConfigured() {
    return false;
  }

  issue(_orderId: string) {
    return { issued: false, reason: "Invoice generation is a Stage 2 integration." };
  }
}

export const invoiceService = new InvoiceService();
