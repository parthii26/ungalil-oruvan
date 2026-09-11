import { expect, test } from "@playwright/test";

test("product page ships SEO metadata, structured data, and a share image", async ({ page }) => {
  await page.goto("/product/organic-ponni-rice");
  await expect(page).toHaveTitle(/Ponni/);

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveCount(1);
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toContain("/product/organic-ponni-rice/opengraph-image");

  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = scripts.map((s) => {
    try {
      return JSON.parse(s);
    } catch {
      return {};
    }
  }).find((d) => d["@type"] === "Product") ?? {};

  expect(data["@type"]).toBe("Product");
  expect(String(data.image[0])).toMatch(/^https?:\/\//);
  expect(String(data.offers[0].priceCurrency)).toBe("INR");

  const img = await page.request.get(ogImage!);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/");
});
