import { expect, test } from "@playwright/test";

test.describe("About Page Editor & Dynamic Storefront", () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to clean seed state before each test run
    const res = await request.post("http://localhost:3000/api/dev/reset-nav");
    expect(res.ok()).toBeTruthy();
  });

  test("unauthenticated access redirects to admin login", async ({ page }) => {
    await page.goto("/admin/about");
    await page.waitForURL(/\/admin\/login/, { timeout: 15_000 });
    expect(page.url()).toContain("/admin/login");
  });

  test("full admin workflow: view defaults, edit content & photos, save, and verify live on /about", async ({
    page,
  }) => {
    // 1. Sign in as admin
    await page.goto("/admin/login");
    await page.locator("input[name='email']").fill("admin@varizel.dev");
    await page.locator("input[name='password']").fill("Admin123!Dev");
    await page.locator("button:has-text('Sign in')").click();
    await page.waitForURL(/\/admin/, { timeout: 15_000 });

    // 2. Navigate to /admin/about
    await page.goto("/admin/about");
    await expect(page.locator("h1:has-text('About Page Editor')")).toBeVisible();

    // Verify initial values
    const badgeInput = page.locator("[data-testid='about-tamil-badge-input']");
    const titleInput = page.locator("[data-testid='about-title-input']");
    const introInput = page.locator("[data-testid='about-intro-input']");
    const img1Input = page.locator("[data-testid='about-img1-input']");
    const img2Input = page.locator("[data-testid='about-img2-input']");
    const storyTamilInput = page.locator("[data-testid='story-tamil-input']");
    const storyTitleInput = page.locator("[data-testid='story-title-input']");
    const storyBodyInput = page.locator("[data-testid='story-body-input']");

    await expect(badgeInput).toHaveValue("உங்களில் ஒருவர்");
    await expect(titleInput).toHaveValue("Ungalil Oruvar");
    await expect(introInput).toBeVisible();
    await expect(img1Input).toHaveValue("/images/farm-dawn.jpg");
    await expect(img2Input).toHaveValue("/images/soil-hands.jpg");
    await expect(storyTamilInput).toHaveValue("நமது மண்ணில் வேரூன்றியது");
    await expect(storyTitleInput).toHaveValue("Rooted in Our Soil");

    // 3. Edit fields
    await badgeInput.fill("நம் பாரம்பர்யம்");
    await titleInput.fill("Ungalil Oruvar Organic Farm");
    await introInput.fill(
      "Handcrafted raw forest honey, cold-pressed wood ghani oils, and heirloom native grains.",
    );
    await img1Input.fill("/images/honey.jpg");
    await page.locator("[data-testid='about-img1-alt-input']").fill("Pure raw forest honey");
    await img2Input.fill("/images/turmeric.jpg");
    await page.locator("[data-testid='about-img2-alt-input']").fill("Single-origin turmeric");
    await storyTamilInput.fill("விவசாயிகளின் உழைப்பு");
    await storyTitleInput.fill("Rooted in Tamil Soil");
    await storyBodyInput.fill(
      "Four generations of ethical farming without synthetic pesticides or chemicals.",
    );

    // Verify unsaved changes badge appears
    await expect(page.locator("text=Unsaved changes")).toBeVisible();

    // 4. Save Changes
    const saveBtn = page.locator("[data-testid='save-about-btn']");
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    await expect(page.locator("text=About page updated successfully.")).toBeVisible();

    // 5. Navigate to public /about and assert changes
    await page.goto("/about");

    await expect(page.locator("[data-testid='about-tamil-badge']")).toHaveText("நம் பாரம்பர்யம்");
    await expect(page.locator("[data-testid='about-title']")).toHaveText(
      "Ungalil Oruvar Organic Farm",
    );
    await expect(page.locator("[data-testid='about-intro']")).toContainText(
      "Handcrafted raw forest honey, cold-pressed wood ghani oils, and heirloom native grains.",
    );

    const img1 = page.locator("[data-testid='about-image-1']");
    await expect(img1).toBeVisible();
    await expect(img1).toHaveAttribute("src", "/images/honey.jpg");
    await expect(img1).toHaveAttribute("alt", "Pure raw forest honey");

    const img2 = page.locator("[data-testid='about-image-2']");
    await expect(img2).toBeVisible();
    await expect(img2).toHaveAttribute("src", "/images/turmeric.jpg");
    await expect(img2).toHaveAttribute("alt", "Single-origin turmeric");

    await expect(page.locator("[data-testid='story-tamil']")).toHaveText("விவசாயிகளின் உழைப்பு");
    await expect(page.locator("[data-testid='story-title']")).toHaveText("Rooted in Tamil Soil");
    await expect(page.locator("[data-testid='story-body']")).toContainText(
      "Four generations of ethical farming without synthetic pesticides or chemicals.",
    );
  });
});
