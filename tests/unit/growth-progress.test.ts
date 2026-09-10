import { describe, expect, it } from "vitest";
import { stageFromProgress, stageIndexAt } from "../../lib/story/growth-progress";
import { GROWTH_STAGES } from "../../lib/story/growth-stages";

describe("timeline stage mapping", () => {
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
