import { loadDb, mutate } from "@/lib/db/store";
import type { SiteSettings } from "@/lib/db/types";
import { withSettingsDefaults } from "@/lib/brand/defaults";

export function getSettings(): SiteSettings {
  return withSettingsDefaults(loadDb().site_settings);
}

export function updateSettings(patch: Partial<SiteSettings>) {
  return mutate((db) => {
    db.site_settings = { ...db.site_settings, ...patch };
    return db.site_settings;
  });
}
