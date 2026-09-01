import { loadDb, mutate } from "@/lib/db/store";
import type { Category } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function listActiveCategories() {
  return loadDb()
    .categories.filter((c) => c.is_active)
    .sort((a, b) => a.position - b.position);
}

export function listAllCategories() {
  return loadDb().categories.sort((a, b) => a.position - b.position);
}

export function getCategoryBySlug(slug: string) {
  return loadDb().categories.find((c) => c.slug === slug) ?? null;
}

export function getCategoryById(id: string) {
  return loadDb().categories.find((c) => c.id === id) ?? null;
}

export function insertCategory(input: Omit<Category, "id" | "created_at" | "updated_at"> & { id?: string }) {
  return mutate((db) => {
    const now = nowIso();
    const row: Category = { ...input, id: input.id ?? uid(), created_at: now, updated_at: now };
    db.categories.push(row);
    return row;
  });
}

export function updateCategory(id: string, patch: Partial<Category>) {
  return mutate((db) => {
    const row = db.categories.find((c) => c.id === id);
    if (!row) return null;
    Object.assign(row, patch, { updated_at: nowIso() });
    return row;
  });
}

export function deleteCategory(id: string) {
  mutate((db) => {
    db.categories = db.categories.filter((c) => c.id !== id);
  });
}

export function getCategoryBySlugExcept(slug: string, exceptId?: string) {
  return loadDb().categories.find((c) => c.slug === slug && c.id !== exceptId) ?? null;
}
