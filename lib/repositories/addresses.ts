import { loadDb, mutate } from "@/lib/db/store";
import type { Address } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function listAddresses(customerId: string) {
  return loadDb().addresses.filter((a) => a.customer_id === customerId);
}

export function getAddress(id: string) {
  return loadDb().addresses.find((a) => a.id === id) ?? null;
}

export function insertAddress(input: Omit<Address, "id" | "created_at" | "updated_at">) {
  return mutate((db) => {
    const now = nowIso();
    if (input.is_default) {
      db.addresses
        .filter((a) => a.customer_id === input.customer_id)
        .forEach((a) => {
          a.is_default = false;
        });
    }
    const row: Address = { ...input, id: uid(), created_at: now, updated_at: now };
    db.addresses.push(row);
    return row;
  });
}

export function updateAddress(id: string, customerId: string, patch: Partial<Address>) {
  return mutate((db) => {
    const row = db.addresses.find((a) => a.id === id && a.customer_id === customerId);
    if (!row) return null;
    if (patch.is_default) {
      db.addresses
        .filter((a) => a.customer_id === customerId)
        .forEach((a) => {
          a.is_default = false;
        });
    }
    Object.assign(row, patch, { updated_at: nowIso() });
    return row;
  });
}

export function deleteAddress(id: string, customerId: string) {
  mutate((db) => {
    db.addresses = db.addresses.filter((a) => !(a.id === id && a.customer_id === customerId));
  });
}
