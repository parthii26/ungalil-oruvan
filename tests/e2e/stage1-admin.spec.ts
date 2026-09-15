import { expect, test } from "@playwright/test";

test.describe("Stage 1 Admin Features & Contact Flow", () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to clean seed state before each test run
    const res = await request.post("http://127.0.0.1:3000/api/dev/reset-nav");
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

    await page.locator("main input[name='name']").fill("Sundar Organic Farmer");
    await page.locator("main input[name='email']").fill("sundar@example.com");
    await page.locator("main textarea[name='message']").fill("Interested in supplying organic kodo millet to your store.");
    await page.locator("main button:has-text('Send message')").click();

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

  test("guest can look up order status on /order/track", async ({ page }) => {
    await page.goto("/order/track");
    await expect(page.locator("h1:has-text('Track Order')")).toBeVisible();

    // Fill in seeded order
    await page.locator("input[name='order']").fill("UO-2026-000001");
    await page.locator("button:has-text('Track')").click();

    await page.waitForURL(/\/order\/track/);
    await expect(page.locator("p.font-serif:has-text('UO-2026-000001')")).toBeVisible();
    await expect(page.locator("text=Fulfillment Progress")).toBeVisible();
    await expect(page.locator("text=Activity Timeline")).toBeVisible();
  });

  test("customer can view invoice list and printable invoice receipt", async ({ page }) => {
    // Login as customer
    await page.goto("/login");
    await page.locator("input[name='email']").fill("ananya@varizel.dev");
    await page.locator("input[name='password']").fill("Customer123!");
    await page.locator("button:has-text('Login')").click();
    await page.waitForURL(/\/account/, { timeout: 15_000 });

    // Navigate to invoices
    await page.goto("/account/invoices");
    await expect(page.locator("h1:has-text('Invoices')")).toBeVisible();
    await expect(page.locator("td:has-text('INV-UO-2026-000001')")).toBeVisible();

    // Click View Invoice
    await page.locator("a:has-text('View Invoice ↗')").first().click();
    await page.waitForURL(/\/account\/invoices\//);

    await expect(page.locator("span:has-text('TAX INVOICE')")).toBeVisible();
    await expect(page.locator("button:has-text('Print / Save as PDF')")).toBeVisible();
  });

  test("customer can write a product review", async ({ page }) => {
    // Login as customer
    await page.goto("/login");
    await page.locator("input[name='email']").fill("ananya@varizel.dev");
    await page.locator("input[name='password']").fill("Customer123!");
    await page.locator("button:has-text('Login')").click();
    await page.waitForURL(/\/account/, { timeout: 15_000 });

    // Navigate to reviews
    await page.goto("/account/reviews");
    await expect(page.locator("h1:has-text('Product Reviews')")).toBeVisible();

    // Click write review button
    await page.locator("button:has-text('+ Write a Product Review')").click();

    // Fill form
    await page.locator("select[name='product_id']").selectOption({ index: 1 });
    await page.locator("input[name='title']").fill("Superb natural aroma and freshness");
    await page.locator("textarea[name='body']").fill("Authentic traditional grain, cooked easily and tasted great.");
    await page.locator("button:has-text('Post Review')").click();

    await expect(page.locator("text=✓ Review submitted!")).toBeVisible();
  });

  test("admin can manage batches and track expiry dates", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/batches");
    await expect(page.locator("h1:has-text('Batches & Expiry')")).toBeVisible();
    await expect(page.locator("text=Total Batches")).toBeVisible();

    // Click Record New Batch
    await page.locator("button:has-text('+ Record New Batch')").click();

    await page.locator("input[name='batch_number']").fill("HON-2026-TEST");
    await page.locator("select[name='product_id']").selectOption({ index: 1 });
    await page.locator("input[name='packaging_date']").fill("2026-02-01");
    await page.locator("input[name='expiry_date']").fill("2027-02-01");
    await page.locator("input[name='initial_quantity']").fill("75");
    await page.locator("button:has-text('Save Batch')").click();

    await expect(page.locator("text=✓ New batch lot created!")).toBeVisible();
  });

  test("admin can save GSTIN and FSSAI settings", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/settings");
    await expect(page.locator("h1:has-text('Settings')")).toBeVisible();

    await page.locator("input[name='gstin']").fill("33AAAUO9999P1Z1");
    await page.locator("input[name='fssai']").fill("12426999000999");
    await page.locator("button:has-text('Save')").first().click();

    await expect(page.locator("text=Saved.")).toBeVisible();
    await expect(page.locator("input[name='gstin']")).toHaveValue("33AAAUO9999P1Z1");
    await expect(page.locator("input[name='fssai']")).toHaveValue("12426999000999");
  });

  test("visitor can subscribe to newsletter in footer", async ({ page }) => {
    await page.goto("/");
    const emailInput = page.locator("footer input[name='email']");
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill("harvest-lover@example.com");
    await page.locator("footer button:has-text('Join')").click();
    await expect(page.locator("text=✓ Subscribed")).toBeVisible();
  });
});
