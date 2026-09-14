import { expect, test } from "@playwright/test";

test.describe("Navigation Editor & Dynamic Public Header", () => {
  test.beforeEach(async ({ request }) => {
    // Reset navigation to clean seed state before test run
    const res = await request.post("http://localhost:3000/api/dev/reset-nav");
    expect(res.ok()).toBeTruthy();
  });

  test("unauthenticated access redirects to admin login", async ({ page }) => {
    await page.goto("/admin/navigation");
    await page.waitForURL(/\/admin\/login/, { timeout: 15_000 });
    expect(page.url()).toContain("/admin/login");
  });

  test("full admin workflow: view, edit, add, disable, reorder, and delete live on header", async ({ page }) => {
    // 1. Sign in as admin
    await page.goto("/admin/login");
    await page.locator("input[name='email']").fill("admin@varizel.dev");
    await page.locator("input[name='password']").fill("Admin123!Dev");
    await page.locator("button:has-text('Sign in')").click();
    await page.waitForURL(/\/admin/, { timeout: 15_000 });

    // 2. Navigate to /admin/navigation
    await page.goto("/admin/navigation");
    await expect(page.locator("h1:has-text('Header Navigation')")).toBeVisible();

    // Verify initial seeded items exist in order
    const labelInputs = page.locator("[data-testid='nav-label-input']");
    const urlInputs = page.locator("[data-testid='nav-url-input']");
    await expect(labelInputs).toHaveCount(6);
    await expect(labelInputs.nth(0)).toHaveValue("SHOP");
    await expect(labelInputs.nth(1)).toHaveValue("CATEGORIES");
    await expect(labelInputs.nth(2)).toHaveValue("ABOUT");
    await expect(labelInputs.nth(3)).toHaveValue("OUR STORY");
    await expect(labelInputs.nth(4)).toHaveValue("BLOG");
    await expect(labelInputs.nth(5)).toHaveValue("FAQ");

    // 3. Edit "OUR STORY" -> "OUR FARM" and url -> "/our-farm"
    await labelInputs.nth(3).fill("OUR FARM");
    await urlInputs.nth(3).fill("/our-farm");

    // 4. Add a new navigation item "SPECIAL HARVEST"
    await page.locator("[data-testid='add-navigation-btn']").click();
    await expect(labelInputs).toHaveCount(7);
    await labelInputs.last().fill("SPECIAL HARVEST");
    await urlInputs.last().fill("/special-harvest");

    // 5. Disable "FAQ"
    const faqRow = page.locator("[data-nav-id='nav-6']");
    await faqRow.locator("[data-testid='nav-active-checkbox']").click();

    // 6. Reorder: Move "ABOUT" down
    const aboutRow = page.locator("[data-nav-id='nav-3']");
    await aboutRow.locator("[data-testid='move-down-btn']").click();

    // 7. Save Changes
    const saveBtn = page.locator("[data-testid='save-navigation-btn']");
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await expect(page.locator("text=Navigation updated successfully")).toBeVisible();

    // 8. Visit Public Website and verify updates
    await page.goto("/");

    const isMobile = await page.locator("button[aria-label='Open menu']").isVisible();
    if (isMobile) {
      await page.locator("button[aria-label='Open menu']").click();
      const drawer = page.locator("div[role='dialog']");
      // Verify "OUR FARM" is present and links to /our-farm
      const farmLink = drawer.locator("a:has-text('OUR FARM')").first();
      await expect(farmLink).toBeVisible();
      await expect(farmLink).toHaveAttribute("href", "/our-farm");

      // Verify "SPECIAL HARVEST" is present and links to /special-harvest
      const harvestLink = drawer.locator("a:has-text('SPECIAL HARVEST')").first();
      await expect(harvestLink).toBeVisible();
      await expect(harvestLink).toHaveAttribute("href", "/special-harvest");

      // Verify "OUR STORY" and "FAQ" are hidden
      await expect(drawer.locator("a:has-text('OUR STORY')")).toHaveCount(0);
      await expect(drawer.locator("a:has-text('FAQ')")).toHaveCount(0);
    } else {
      const headerNav = page.locator("header nav");
      // Verify "OUR FARM" is present and links to /our-farm
      const farmLink = headerNav.locator("a:has-text('OUR FARM')").first();
      await expect(farmLink).toBeVisible();
      await expect(farmLink).toHaveAttribute("href", "/our-farm");

      // Verify "SPECIAL HARVEST" is present and links to /special-harvest
      const harvestLink = headerNav.locator("a:has-text('SPECIAL HARVEST')").first();
      await expect(harvestLink).toBeVisible();
      await expect(harvestLink).toHaveAttribute("href", "/special-harvest");

      // Verify "OUR STORY" and "FAQ" are hidden
      await expect(headerNav.locator("a:has-text('OUR STORY')")).toHaveCount(0);
      await expect(headerNav.locator("a:has-text('FAQ')")).toHaveCount(0);
    }

    // 9. Return to /admin/navigation and delete "SPECIAL HARVEST"
    await page.goto("/admin/navigation");
    const updatedLabels = page.locator("[data-testid='nav-label-input']");
    const deleteButtons = page.locator("[data-testid='delete-btn']");
    const countBeforeDelete = await updatedLabels.count();

    // Click delete on the last item (SPECIAL HARVEST)
    await deleteButtons.last().click();
    await expect(page.locator("[data-testid='nav-label-input']")).toHaveCount(countBeforeDelete - 1);

    // Save
    await page.locator("[data-testid='save-navigation-btn']").click();
    await expect(page.locator("text=Navigation updated successfully")).toBeVisible();

    // 10. Visit public homepage and verify SPECIAL HARVEST is gone
    await page.goto("/");
    if (isMobile) {
      await page.locator("button[aria-label='Open menu']").click();
      await expect(page.locator("div[role='dialog'] a:has-text('SPECIAL HARVEST')")).toHaveCount(0);
    } else {
      await expect(page.locator("header nav a:has-text('SPECIAL HARVEST')")).toHaveCount(0);
    }
  });
});
