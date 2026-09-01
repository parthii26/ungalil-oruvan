/** Stage 2 interface — batches / FEFO are not live. */
export class InventoryService {
  isConfigured() {
    return false;
  }

  reserve(_variantId: string, _qty: number) {
    return { reserved: false, reason: "Inventory reservation is a Stage 2 integration." };
  }

  commit(_orderId: string) {
    return { committed: false, reason: "Inventory commit is a Stage 2 integration." };
  }
}

export const inventoryService = new InventoryService();
