import { loadDb, mutate } from "@/lib/db/store";
import type { Profile } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function findProfileByEmail(email: string) {
  return loadDb().profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function findProfileById(id: string) {
  return loadDb().profiles.find((p) => p.id === id) ?? null;
}

export function getCustomerByProfileId(profileId: string) {
  return loadDb().customers.find((c) => c.profile_id === profileId) ?? null;
}

export function getCustomerById(id: string) {
  return loadDb().customers.find((c) => c.id === id) ?? null;
}

export function listCustomers() {
  const db = loadDb();
  return db.customers.map((c) => {
    const profile = db.profiles.find((p) => p.id === c.profile_id)!;
    const orders = db.orders.filter((o) => o.customer_id === c.id).length;
    return { customer: c, profile, orders };
  });
}

export function createCustomerAccount(input: {
  email: string;
  full_name: string;
  phone?: string | null;
  password_hash: string;
}) {
  return mutate((db) => {
    const now = nowIso();
    const profile: Profile = {
      id: uid(),
      email: input.email.toLowerCase(),
      full_name: input.full_name,
      phone: input.phone || null,
      role: "customer",
      password_hash: input.password_hash,
      created_at: now,
      updated_at: now,
    };
    const customer = { id: uid(), profile_id: profile.id, notes: null, created_at: now };
    db.profiles.push(profile);
    db.customers.push(customer);
    db.wishlists.push({ id: uid(), customer_id: customer.id, created_at: now });
    return { profile, customer };
  });
}

export function updateProfile(id: string, patch: Partial<Profile>) {
  return mutate((db) => {
    const row = db.profiles.find((p) => p.id === id);
    if (!row) return null;
    if ("role" in patch) {
      delete (patch as { role?: unknown }).role;
    }
    Object.assign(row, patch, { updated_at: nowIso() });
    return row;
  });
}
