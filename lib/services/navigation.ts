import {
  listActiveNavigationItems,
  listAllNavigationItems,
} from "@/lib/repositories/navigation";
import type { NavigationItem } from "@/lib/db/types";

export function listPublicNavigation(): NavigationItem[] {
  return listActiveNavigationItems();
}

export function listAdminNavigation(): NavigationItem[] {
  return listAllNavigationItems();
}
