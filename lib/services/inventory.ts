import { loadDb, mutate } from "@/lib/db/store";
import * as ordersRepo from "@/lib/repositories/orders";
import { nowIso } from "@/lib/utils";

/** Stage 2 Live Inventory & Batch FEFO Service */
export class InventoryService {
  isConfigured(): boolean {
    return true;
  }

  checkStock(variantId: string, requiredQty: number = 1): { available: boolean; currentStock: number } {
    const db = loadDb();
    const variant = db.product_variants.find((v) => v.id === variantId);
    if (!variant) return { available: false, currentStock: 0 };
    const stock = variant.stock_qty ?? 0;
    return { available: stock >= requiredQty, currentStock: stock };
  }

  reserve(variantId: string, qty: number): { reserved: boolean; reason?: string } {
    const { available, currentStock } = this.checkStock(variantId, qty);
    if (!available) {
      return { reserved: false, reason: `Insufficient stock. Requested ${qty}, available ${currentStock}.` };
    }
    return { reserved: true };
  }

  allocateBatchFefo(productId: string, requestedQty: number): { batchId: string; batchNumber: string; allocated: number }[] {
    const db = loadDb();
    // Sort batches by expiry_date ascending (First Expired First Out)
    const batches = (db.batches ?? [])
      .filter((b) => b.product_id === productId && b.remaining_quantity > 0)
      .sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));

    let remainingNeeded = requestedQty;
    const allocations: { batchId: string; batchNumber: string; allocated: number }[] = [];

    for (const b of batches) {
      if (remainingNeeded <= 0) break;
      const take = Math.min(b.remaining_quantity, remainingNeeded);
      allocations.push({
        batchId: b.id,
        batchNumber: b.batch_number,
        allocated: take,
      });
      remainingNeeded -= take;
    }

    return allocations;
  }

  deductStockForOrder(orderId: string): {
    success: boolean;
    deductions: { variantId: string; sku: string; deducted: number; remaining: number }[];
    batchAllocations: { batchNumber: string; allocated: number }[];
  } {
    const items = ordersRepo.listOrderItems(orderId);
    if (!items || items.length === 0) {
      return { success: false, deductions: [], batchAllocations: [] };
    }

    return mutate((db) => {
      const deductions: { variantId: string; sku: string; deducted: number; remaining: number }[] = [];
      const batchAllocations: { batchNumber: string; allocated: number }[] = [];

      for (const item of items) {
        const variant = db.product_variants.find((v) => v.id === item.variant_id);
        if (variant) {
          const current = variant.stock_qty ?? 0;
          const next = Math.max(0, current - item.quantity);
          variant.stock_qty = next;
          variant.updated_at = nowIso();
          deductions.push({
            variantId: variant.id,
            sku: variant.sku,
            deducted: item.quantity,
            remaining: next,
          });

          // FEFO Batch deduction
          const fefoBatches = (db.batches ?? [])
            .filter((b) => b.product_id === variant.product_id && b.remaining_quantity > 0)
            .sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));

          let needed = item.quantity;
          for (const b of fefoBatches) {
            if (needed <= 0) break;
            const take = Math.min(b.remaining_quantity, needed);
            b.remaining_quantity -= take;
            b.updated_at = nowIso();
            batchAllocations.push({ batchNumber: b.batch_number, allocated: take });
            needed -= take;
          }
        }
      }

      return { success: true, deductions, batchAllocations };
    });
  }

  commit(orderId: string) {
    const res = this.deductStockForOrder(orderId);
    return { committed: res.success, deductions: res.deductions, batchAllocations: res.batchAllocations };
  }
}

export const inventoryService = new InventoryService();

