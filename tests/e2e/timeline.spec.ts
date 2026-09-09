import { expect, test } from "@playwright/test";

test.describe("growth timeline", () => {
  test("desktop: all 7 stage photos load with zero failed requests", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop sticky timeline only");

    const failed: string[] = [];
    page.on("response", (res) => {
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });

    await page.goto("/", { waitUntil: "networkidle" });
    const section = page.locator("#seed-stage");
    await expect(section).toBeVisible();

    // Walk the full 300vh journey so every stage activates and primes photos.
    const box = await section.evaluate((el) => {
      const target = el as HTMLElement;
      const rect = target.getBoundingClientRect();
      return { top: rect.top + window.scrollY, travel: target.offsetHeight - window.innerHeight };
    });
    for (let step = 0; step <= 10; step += 1) {
      await page.evaluate(([top, travel, s]) => window.scrollTo(0, top + (travel * s) / 10), [
        box.top,
        box.travel,
        step,
      ]);
      await page.waitForTimeout(400);
    }

    const plates = section.locator("[data-plate] img");
    await expect(plates).toHaveCount(7);
    for (let i = 0; i < 7; i += 1) {
      const img = plates.nth(i);
      await expect(img).toHaveAttribute("src", /rice-0[1-7][a-z-]*\.webp/);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth, `plate ${i + 1} decoded`).toBeGreaterThan(0);
    }
    await expect(section.locator("[data-count]")).toHaveText("07 / 07");
    await expect(section.locator("[data-product]")).toBeVisible();
    expect(failed, "no 4xx/5xx responses").toEqual([]);
  });

  test("mobile: swipeable story cards render with photos", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile compact hero only");

    await page.goto("/", { waitUntil: "networkidle" });
    const strip = page.locator('section[aria-label="A crop, in order"]');
    await expect(strip).toBeVisible();
    const cards = strip.locator("article");
    await expect(cards).toHaveCount(7);
    for (let i = 0; i < 7; i += 1) {
      const img = cards.nth(i).locator("img");
      await expect(img).toHaveAttribute("src", /rice-0[1-7][a-z-]*\.webp/);
    }
  });
});
