import { describe, expect, it } from "vitest";
import { addPaise, formatPaise, mulQty, percentOf } from "../../lib/money";

describe("money", () => {
  it("adds integers", () => {
    expect(addPaise(19900, 100, 0)).toBe(20000);
  });
  it("multiplies qty", () => {
    expect(mulQty(34900, 2)).toBe(69800);
  });
  it("applies percent in bps with floor", () => {
    expect(percentOf(10000, 1000)).toBe(1000);
    expect(percentOf(333, 1000)).toBe(33);
  });
  it("formats rupees", () => {
    expect(formatPaise(34900)).toContain("349");
  });
  it("rejects floats", () => {
    expect(() => addPaise(1.5 as unknown as number)).toThrow();
  });
});
