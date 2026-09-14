import { loadDb, mutate } from "@/lib/db/store";
import type { Page } from "@/lib/db/types";

export function listAllPages() {
  return loadDb().pages;
}

export function getPageById(id: string) {
  return loadDb().pages.find((p) => p.id === id) ?? null;
}

export function updatePage(
  id: string,
  patch: Partial<Pick<Page, "title" | "body" | "published">>,
) {
  return mutate((db) => {
    const row = db.pages.find((p) => p.id === id);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  });
}
