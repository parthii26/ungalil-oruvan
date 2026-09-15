import { loadDb, mutate } from "@/lib/db/store";
import type { ProductBatch } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function listAllBatches(): ProductBatch[] {
  return loadDb()
    .batches.slice()
    .sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));
}

export function getBatchById(id: string): ProductBatch | null {
  return loadDb().batches.find((b) => b.id === id) ?? null;
}

export function createBatch(
  input: Omit<ProductBatch, "id" | "created_at" | "updated_at">,
): ProductBatch {
  return mutate((db) => {
    const now = nowIso();
    const row: ProductBatch = {
      ...input,
      id: uid(),
      created_at: now,
      updated_at: now,
    };
    db.batches.push(row);
    return row;
  });
}

export function updateBatch(
  id: string,
  patch: Partial<Omit<ProductBatch, "id" | "created_at" | "updated_at">>,
): ProductBatch | null {
  return mutate((db) => {
    const row = db.batches.find((b) => b.id === id);
    if (!row) return null;
    Object.assign(row, patch, { updated_at: nowIso() });
    return row;
  });
}

export function deleteBatch(id: string): boolean {
  return mutate((db) => {
    const idx = db.batches.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    db.batches.splice(idx, 1);
    return true;
  });
}
