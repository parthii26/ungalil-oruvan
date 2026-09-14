import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "../../lib/db/store";
import * as navRepo from "../../lib/repositories/navigation";
import { listPublicNavigation } from "../../lib/services/navigation";

beforeEach(() => resetDb());
afterAll(() => resetDb());

describe("navigation repository & service", () => {
  it("loads seeded navigation items in ascending display_order", () => {
    const all = navRepo.listAllNavigationItems();
    expect(all.length).toBeGreaterThanOrEqual(6);
    expect(all[0].label).toBe("SHOP");
    expect(all[0].display_order).toBe(1);

    // Verify ordering is strictly ascending
    for (let i = 1; i < all.length; i++) {
      expect(all[i].display_order).toBeGreaterThanOrEqual(all[i - 1].display_order);
    }
  });

  it("filters out inactive items from public navigation", () => {
    const all = navRepo.listAllNavigationItems();
    const target = all[0];

    // Deactivate item
    navRepo.updateNavigationItem(target.id, { is_active: false });

    const publicNav = listPublicNavigation();
    expect(publicNav.find((n) => n.id === target.id)).toBeUndefined();

    // Verify listAllNavigationItems still contains it
    const updatedAll = navRepo.listAllNavigationItems();
    expect(updatedAll.find((n) => n.id === target.id)?.is_active).toBe(false);
  });

  it("updates navigation item label and url", () => {
    const all = navRepo.listAllNavigationItems();
    const storyItem = all.find((n) => n.label === "OUR STORY");
    expect(storyItem).toBeDefined();

    navRepo.updateNavigationItem(storyItem!.id, {
      label: "OUR FARM",
      url: "/our-farm",
    });

    const updated = navRepo.getNavigationItemById(storyItem!.id);
    expect(updated?.label).toBe("OUR FARM");
    expect(updated?.url).toBe("/our-farm");

    const publicNav = listPublicNavigation();
    expect(publicNav.find((n) => n.label === "OUR FARM")?.url).toBe("/our-farm");
  });

  it("inserts and deletes a navigation item", () => {
    const created = navRepo.insertNavigationItem({
      label: "RECIPES",
      url: "/recipes",
      is_active: true,
      display_order: 99,
    });

    expect(created.id).toBeDefined();
    expect(created.label).toBe("RECIPES");

    const publicNav = listPublicNavigation();
    expect(publicNav.find((n) => n.id === created.id)).toBeDefined();

    // Delete
    const deleted = navRepo.deleteNavigationItem(created.id);
    expect(deleted).toBe(true);

    const publicNavAfter = listPublicNavigation();
    expect(publicNavAfter.find((n) => n.id === created.id)).toBeUndefined();
  });

  it("batch updates and reorders navigation items", () => {
    const all = navRepo.listAllNavigationItems();
    // Swap first two items
    const reordered = [
      { ...all[1], display_order: 1 },
      { ...all[0], display_order: 2 },
      ...all.slice(2),
    ];

    navRepo.saveAllNavigationItems(reordered);

    const publicNav = listPublicNavigation();
    expect(publicNav[0].id).toBe(all[1].id);
    expect(publicNav[1].id).toBe(all[0].id);
  });
});
