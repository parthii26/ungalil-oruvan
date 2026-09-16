import { test, expect } from "@playwright/test";

const MOBILE_WIDTHS = [320, 360, 375, 390, 414, 430];

for (const width of MOBILE_WIDTHS) {
  test.describe(`Mobile Product Card at ${width}px viewport`, () => {
    test.use({ viewport: { width, height: 844 } });

    test(`category and shop pages display single card per row with full unclipped details`, async ({ page }) => {
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      const cards = page.locator("article");
      await expect(cards.first()).toBeVisible();

      // Check card count >= 2 to test layout
      const count = await cards.count();
      expect(count).toBeGreaterThan(1);

      // Verify single card per row: card 0 and card 1 must NOT be on the same horizontal row (top of card 1 >= bottom of card 0)
      const box0 = await cards.nth(0).boundingBox();
      const box1 = await cards.nth(1).boundingBox();
      expect(box0).not.toBeNull();
      expect(box1).not.toBeNull();

      if (box0 && box1) {
        // In a single-column layout, card 1 is stacked below card 0
        expect(box1.y).toBeGreaterThanOrEqual(box0.y + box0.height - 10);
        // Card width should use almost full content width (>= 80% of viewport width)
        expect(box0.width).toBeGreaterThanOrEqual(width * 0.75);
      }

      // Check the first card's details:
      const firstCard = cards.first();

      // 1. Tamil Product Name visible
      const tamilHeading = firstCard.locator("h3.font-tamil");
      if ((await tamilHeading.count()) > 0) {
        await expect(tamilHeading).toBeVisible();
        const text = await tamilHeading.textContent();
        expect(text?.trim().length).toBeGreaterThan(1);
      }

      // 2. English Product Name visible
      const englishName = firstCard.locator("p.font-serif, h3.font-serif").first();
      await expect(englishName).toBeVisible();

      // 3. Price visible with rupee symbol
      const priceText = firstCard.locator("text=₹").first();
      await expect(priceText).toBeVisible();

      // 4. CTA button is full width and visible
      const ctaBtn = firstCard.locator("button:has-text('Add to Cart'), button:has-text('Sold Out')");
      await expect(ctaBtn).toBeVisible();
      const ctaBox = await ctaBtn.boundingBox();
      expect(ctaBox).not.toBeNull();
      if (ctaBox && box0) {
        // Button should be comfortably wide
        expect(ctaBox.width).toBeGreaterThanOrEqual(box0.width * 0.8);
        // Minimum touch target 44px
        expect(ctaBox.height).toBeGreaterThanOrEqual(44);
      }

      // 5. Wishlist button accessible
      const wishBtn = firstCard.locator("button[aria-label*='wishlist']");
      await expect(wishBtn).toBeVisible();

      // 6. No horizontal page overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });
}
