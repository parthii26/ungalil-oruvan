/** Stage 2 interface — courier booking is not live. */
export class ShipmentService {
  isConfigured() {
    return false;
  }

  create(_orderId: string) {
    return { created: false, reason: "Shipping is a Stage 2 integration." };
  }
}

export const shipmentService = new ShipmentService();
