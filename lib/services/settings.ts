import * as settingsRepo from "@/lib/repositories/settings";
import type { SiteSettings } from "@/lib/db/types";

export function getSiteSettings() {
  return settingsRepo.getSettings();
}

export function saveSiteSettings(patch: Partial<SiteSettings>) {
  return settingsRepo.updateSettings(patch);
}
