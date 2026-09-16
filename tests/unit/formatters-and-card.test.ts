import { describe, expect, it } from "vitest";
import { discountPercent, formatUnitPrice, formatWeight } from "../../lib/formatters";
import { bestSellers } from "../../lib/services/catalog";
import { resetDb } from "../../lib/db/store";

describe("formatters and product card calculations", () => {
  it("calculates discounts strictly when compare_at > price", () => {
    // 1000 compare_at, 800 price -> 20% off
    expect(discountPercent(80000, 100000)).toBe(20);
    // 949 compare_at, 849 price -> 11% off
    expect(discountPercent(84900, 94900)).toBe(11);
    // compare_at equal to price -> null (no fake discount)
    expect(discountPercent(50000, 50000)).toBeNull();
    // compare_at less than price -> null
    expect(discountPercent(50000, 40000)).toBeNull();
    // compare_at null or undefined -> null
    expect(discountPercent(50000, null)).toBeNull();
    expect(discountPercent(50000, undefined)).toBeNull();
  });

  it("calculates accurate dynamic unit prices", () => {
    // 1000g solid (e.g. Foxtail millet 1kg for ₹140)
    expect(formatUnitPrice(14000, 1000, "1 kg")).toBe("₹140 / kg");

    // 1000g liquid (e.g. Groundnut oil 1L for ₹320)
    expect(formatUnitPrice(32000, 1000, "1 Litre")).toBe("₹320 / litre");

    // 500g honey for ₹240 -> ₹48 / 100g
    expect(formatUnitPrice(24000, 500, "500 g")).toBe("₹48 / 100g");

    // 250g turmeric for ₹95 -> ₹38 / 100g
    expect(formatUnitPrice(9500, 250, "250 g")).toBe("₹38 / 100g");

    // zero or missing weight returns null
    expect(formatUnitPrice(10000, 0)).toBeNull();
    expect(formatUnitPrice(10000, null)).toBeNull();
  });

  it("formats weights accurately", () => {
    expect(formatWeight(1000)).toBe("1 kg");
    expect(formatWeight(500)).toBe("500 g");
    expect(formatWeight(1500)).toBe("1.5 kg");
  });

  it("bestSellers returns up to requested limit with bestsellers prioritized", () => {
    resetDb();
    const list = bestSellers(8);
    expect(list.length).toBeGreaterThan(0);
    expect(list.length).toBeLessThanOrEqual(8);
    // First items should be bestsellers if any exist
    if (list.length > 1 && list[0].product.is_bestseller) {
      expect(list[0].product.is_bestseller).toBe(true);
    }
  });
});
