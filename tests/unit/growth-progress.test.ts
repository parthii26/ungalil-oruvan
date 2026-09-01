import { describe, expect, it } from "vitest";
import { computeGrowth, stageFromProgress, stageIndexAt } from "../../lib/story/growth-progress";
import { GROWTH_STAGES } from "../../lib/story/growth-stages";

describe("continuous rice growth", () => {
  it("keeps seven named timeline stages", () => {
    expect(GROWTH_STAGES.map((s) => s.id)).toEqual([
      "seed",
      "germination",
      "sprout",
      "young",
      "growth",
      "paddy",
      "harvest",
    ]);
  });

  it("starts as soil and a closed seed only", () => {
    const g = computeGrowth(0);
    expect(g.seedSplit).toBe(0);
    expect(g.rootMain).toBe(0);
    expect(g.coleoptile).toBe(0);
    expect(g.stem).toBe(0);
    expect(g.leaf.every((n) => n === 0)).toBe(true);
    expect(g.grains).toBe(0);
    expect(g.gold).toBe(0);
    expect(g.product).toBe(0);
    expect(g.zoom).toBeGreaterThan(2);
  });

  it("germinates without replacing the seed or showing grain", () => {
    const g = computeGrowth(0.16);
    expect(g.seedSplit).toBeGreaterThan(0.4);
    expect(g.rootMain).toBeGreaterThan(0);
    expect(g.leaf[0]).toBe(0);
    expect(g.grains).toBe(0);
    expect(g.gold).toBe(0);
  });

  it("grows a shoot before the first leaf", () => {
    const g = computeGrowth(0.3);
    expect(g.coleoptile).toBeGreaterThan(0.5);
    expect(g.stem).toBeGreaterThan(0);
    expect(g.leaf[0]).toBe(0);
    expect(g.rachis).toBe(0);
  });

  it("unfolds leaves in order from the stem", () => {
    const early = computeGrowth(0.44);
    expect(early.leaf[0]).toBeGreaterThan(early.leaf[1]);
    expect(early.leaf[1]).toBeGreaterThan(early.leaf[2]);
    expect(early.leaf[5]).toBe(0);

    const mid = computeGrowth(0.66);
    expect(mid.leaf[0]).toBeGreaterThan(0.9);
    expect(mid.leaf[3]).toBeGreaterThan(0.4);
    expect(mid.grains).toBe(0);
  });

  it("forms a panicle before the plant turns gold", () => {
    const g = computeGrowth(0.83);
    expect(g.stem).toBeGreaterThan(0.95);
    expect(g.rachis).toBeGreaterThan(0.5);
    expect(g.gold).toBeLessThan(0.2);
    expect(g.product).toBe(0);
  });

  it("matures grain and only then offers the product", () => {
    const ripe = computeGrowth(0.94);
    expect(ripe.grains).toBeGreaterThan(0.7);
    expect(ripe.gold).toBeGreaterThan(0.4);
    expect(ripe.product).toBe(0);

    const harvest = computeGrowth(1);
    expect(harvest.gold).toBeGreaterThan(0.95);
    expect(harvest.product).toBeGreaterThan(0.95);
    expect(harvest.zoom).toBeLessThan(1.1);
  });

  it("maps progress to timeline stages with hysteresis", () => {
    expect(stageIndexAt(0)).toBe(0);
    expect(stageIndexAt(0.21)).toBe(1);
    expect(stageIndexAt(0.5)).toBe(4);
    expect(stageIndexAt(0.9)).toBe(6);
    expect(stageFromProgress(0.11, 0)).toBe(0);
    expect(stageFromProgress(0.13, 0)).toBe(1);
    expect(stageFromProgress(0.09, 1)).toBe(1);
    expect(stageFromProgress(0.07, 1)).toBe(0);
  });
});
