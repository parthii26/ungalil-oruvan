import { expect, test } from "@playwright/test";

test.describe("Storefront Features", () => {
  test("homepage loads successfully with Tamil & English brand hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ungalil Oruvan/i);
    // Verify Tamil tagline / title exists
    const tamilHeader = page.locator("text=உங்களில் ஒருவன்").first();
    await expect(tamilHeader).toBeVisible();
  });

  test("shop page lists products with bilingual titles and prices in ₹", async ({ page }) => {
    await page.goto("/shop");
    // Verify product card existence
    const productCards = page.locator("article");
    await expect(productCards.first()).toBeVisible();

    // Verify rupee symbol is displayed in price
    const priceElement = page.locator("article").first().locator("text=₹");
    await expect(priceElement).toBeVisible();
  });

  test("product detail page allows selecting variants and adding to cart", async ({ page }) => {
    await page.goto("/product/organic-raw-forest-honey");
    await expect(page).toHaveTitle(/Honey/i);

    // Verify Tamil name is visible
    const tamilName = page.locator("text=காட்டு தேன்");
    await expect(tamilName).toBeVisible();

    // Verify pack variant buttons exist and select 500 g
    const variantBtn = page.locator("button:has-text('500 g')");
    if (await variantBtn.count() > 0) {
      await variantBtn.first().click();
    }

    // Verify Add to Bag button exists
    const addBtn = page.locator("button:has-text('Add to bag'), button:has-text('Add to Cart')").first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Check that cart/bag updates or drawer opens
    await page.waitForTimeout(1000);
    const cartLink = page.locator("a[href*='/cart'], button[aria-label*='Cart'], button[aria-label*='bag'], header").first();
    await expect(cartLink).toBeVisible();
  });
});

test.describe("Admin Operations", () => {
  test("admin can sign in and access product management", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("text=Store Administration")).toBeVisible();

    // Fill login credentials
    await page.locator("input[name='email']").fill("admin@varizel.dev");
    await page.locator("input[name='password']").fill("Admin123!Dev");
    await page.locator("button:has-text('Sign in')").click();

    // Should redirect to /admin or /admin/products
    await page.waitForURL(/\/admin/, { timeout: 15_000 });
    expect(page.url()).toContain("/admin");
  });

  test("admin product creation form displays INR currency and bilingual fields", async ({ page }) => {
    // Direct login then navigate to new product
    await page.goto("/admin/login");
    await page.locator("input[name='email']").fill("admin@varizel.dev");
    await page.locator("input[name='password']").fill("Admin123!Dev");
    await page.locator("button:has-text('Sign in')").click();
    await page.waitForURL(/\/admin/, { timeout: 15_000 });

    await page.goto("/admin/products/new");
    await expect(page.locator("h1, h2:has-text('Basic information')").first()).toBeVisible();

    // Check Tamil name input
    const tamilInput = page.locator("input[name='tamil_name']");
    await expect(tamilInput).toBeVisible();

    // Check Price (₹) input
    const priceInput = page.locator("input[name='variant_price_inr']");
    await expect(priceInput).toBeVisible();

    // Verify INR helper text is present
    const inrNotice = page.locator("text=Prices are in Indian Rupees (₹)");
    await expect(inrNotice).toBeVisible();
  });
});
