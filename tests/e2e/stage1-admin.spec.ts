import { expect, test } from "@playwright/test";

test.describe("Stage 1 Admin Features & Contact Flow", () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to clean seed state before each test run
    const res = await request.post("http://localhost:3000/api/dev/reset-nav");
    expect(res.ok()).toBeTruthy();
  });

  async function loginAsAdmin(page: import("@playwright/test").Page) {
    await page.goto("/admin/login");
    await page.locator("input[name='email']").fill("admin@varizel.dev");
    await page.locator("input[name='password']").fill("Admin123!Dev");
    await page.locator("button:has-text('Sign in')").click();
    await page.waitForURL(/\/admin/, { timeout: 15_000 });
  }

  test("admin can view and update order status", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/orders");
    await expect(page.locator("h1:has-text('Orders')")).toBeVisible();

    // Click first order
    const orderLink = page.locator("tbody tr a").first();
    await orderLink.click();
    await page.waitForURL(/\/admin\/orders\//);

    await expect(page.locator("h2:has-text('Update Status')")).toBeVisible();

    // Select 'confirmed' status and submit
    await page.locator("select[name='status']").selectOption("confirmed");
    await page.locator("input[name='note']").fill("Auto-approved in test");
    await page.locator("button:has-text('Update')").click();

    // Should reflect confirmed status
    await expect(page.locator("span:has-text('confirmed')").first()).toBeVisible();
    await expect(page.locator("li:has-text('Auto-approved in test')")).toBeVisible();
  });

  test("admin can manage coupons", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/coupons");
    await expect(page.locator("h1:has-text('Coupons')")).toBeVisible();

    // Click new coupon
    await page.locator("a:has-text('New coupon')").click();
    await page.waitForURL(/\/admin\/coupons\/new/);

    // Fill form
    await page.locator("input[name='code']").fill("PONGAL25");
    await page.locator("input[name='value']").fill("25");
    await page.locator("input[name='min_subtotal']").fill("500");
    await page.locator("input[name='ends_at']").fill("2027-12-31T23:59");
    await page.locator("button:has-text('Create coupon')").click();

    await page.waitForURL(/\/admin\/coupons/);
    await expect(page.locator("td:has-text('PONGAL25')")).toBeVisible();
  });

  test("admin can view and update inventory stock", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/inventory");
    await expect(page.locator("h1:has-text('Inventory')")).toBeVisible();

    // Update stock quantity on first variant
    const firstRow = page.locator("tbody tr").first();
    const qtyInput = firstRow.locator("input[name='qty']");
    await qtyInput.fill("88");
    await firstRow.locator("button:has-text('Save')").click();

    await expect(firstRow.locator("text=✓ Saved")).toBeVisible();
  });

  test("admin can view live reports dashboard", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/reports");
    await expect(page.locator("h1:has-text('Reports')")).toBeVisible();
    await expect(page.locator("text=Total orders")).toBeVisible();
    await expect(page.locator("text=Orders by status")).toBeVisible();
  });

  test("customer submits contact message and admin views it", async ({ page }) => {
    // 1. Customer visits contact page and submits message
    await page.goto("/contact");
    await expect(page.locator("h1:has-text('Contact')")).toBeVisible();

    await page.locator("input[name='name']").fill("Sundar Organic Farmer");
    await page.locator("input[name='email']").fill("sundar@example.com");
    await page.locator("textarea[name='message']").fill("Interested in supplying organic kodo millet to your store.");
    await page.locator("button:has-text('Send message')").click();

    await expect(page.locator("text=Message sent!")).toBeVisible();

    // 2. Admin logs in and checks /admin/messages
    await loginAsAdmin(page);
    await page.goto("/admin/messages");
    await expect(page.locator("h1:has-text('Messages')")).toBeVisible();
    await expect(page.locator("text=Sundar Organic Farmer")).toBeVisible();
    await expect(page.locator("text=sundar@example.com")).toBeVisible();
  });

  test("policies render real content and can be edited in admin", async ({ page }) => {
    // 1. Check storefront policy page
    await page.goto("/policies/privacy");
    await expect(page.locator("h1:has-text('Privacy Policy')")).toBeVisible();
    const bodyText = await page.locator("[data-testid='policy-body']").innerText();
    expect(bodyText).not.toContain("Development placeholder");

    // 2. Admin edits policy page
    await loginAsAdmin(page);
    await page.goto("/admin/pages");
    await expect(page.locator("h1:has-text('Pages')")).toBeVisible();

    // Click Edit on Privacy Policy
    const privacyRow = page.locator("li:has-text('Privacy Policy')");
    await privacyRow.locator("a:has-text('Edit')").click();
    await page.waitForURL(/\/admin\/pages\//);

    await page.locator("input[name='title']").fill("Privacy Policy - Ungalil Oruvan");
    await page.locator("button:has-text('Save page')").click();
    await expect(page.locator("text=✓ Page saved successfully.")).toBeVisible();

    // Verify on storefront
    await page.goto("/policies/privacy");
    await expect(page.locator("h1:has-text('Privacy Policy - Ungalil Oruvan')")).toBeVisible();
  });
});
