import { loadDb, mutate } from "@/lib/db/store";
import type { NavigationItem } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";
import type { NavigationItemInput } from "@/lib/validations/navigation";

export function listActiveNavigationItems(): NavigationItem[] {
  const db = loadDb();
  const items = db.navigation_items || [];
  return [...items]
    .filter((item) => item.is_active)
    .sort((a, b) => a.display_order - b.display_order);
}

export function listAllNavigationItems(): NavigationItem[] {
  const db = loadDb();
  const items = db.navigation_items || [];
  return [...items].sort((a, b) => a.display_order - b.display_order);
}

export function getNavigationItemById(id: string): NavigationItem | null {
  const db = loadDb();
  const items = db.navigation_items || [];
  return items.find((item) => item.id === id) ?? null;
}

export function insertNavigationItem(input: NavigationItemInput): NavigationItem {
  return mutate((db) => {
    if (!db.navigation_items) db.navigation_items = [];
    const now = nowIso();
    const maxOrder = db.navigation_items.reduce((max, item) => Math.max(max, item.display_order), 0);
    const row: NavigationItem = {
      id: input.id && input.id.trim() !== "" ? input.id : uid(),
      label: input.label.trim(),
      url: input.url.trim(),
      is_active: input.is_active ?? true,
      display_order: input.display_order && input.display_order > 0 ? input.display_order : maxOrder + 1,
      created_at: now,
      updated_at: now,
    };
    db.navigation_items.push(row);
    return row;
  });
}

export function updateNavigationItem(id: string, patch: Partial<NavigationItemInput>): NavigationItem | null {
  return mutate((db) => {
    if (!db.navigation_items) db.navigation_items = [];
    const row = db.navigation_items.find((item) => item.id === id);
    if (!row) return null;
    if (patch.label !== undefined) row.label = patch.label.trim();
    if (patch.url !== undefined) row.url = patch.url.trim();
    if (patch.is_active !== undefined) row.is_active = patch.is_active;
    if (patch.display_order !== undefined) row.display_order = patch.display_order;
    row.updated_at = nowIso();
    return row;
  });
}

export function deleteNavigationItem(id: string): boolean {
  return mutate((db) => {
    if (!db.navigation_items) return false;
    const initialLen = db.navigation_items.length;
    db.navigation_items = db.navigation_items.filter((item) => item.id !== id);
    return db.navigation_items.length < initialLen;
  });
}

export function saveAllNavigationItems(items: NavigationItemInput[]): NavigationItem[] {
  return mutate((db) => {
    const now = nowIso();
    const existingMap = new Map((db.navigation_items || []).map((it) => [it.id, it]));

    const updated: NavigationItem[] = items.map((item, index) => {
      const existing = item.id ? existingMap.get(item.id) : undefined;
      const order = index + 1;
      return {
        id: existing?.id || item.id || uid(),
        label: item.label.trim(),
        url: item.url.trim(),
        is_active: item.is_active ?? true,
        display_order: order,
        created_at: existing?.created_at || now,
        updated_at: now,
      };
    });

    db.navigation_items = updated;
    return updated;
  });
}
