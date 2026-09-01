import { describe, expect, it } from "vitest";
import { STORY_RULES } from "../../lib/story/config";
import { productFitsStory } from "../../lib/services/story";

describe("growth story matching", () => {
  const crop = STORY_RULES.CROP_GROWTH;

  it("accepts rice as the crop story", () => {
    expect(
      productFitsStory(crop, {
        name: "Organic Ponni Rice",
        slug: "organic-ponni-rice",
        origin: "Cauvery delta, Thanjavur, Tamil Nadu",
        categorySlug: "organic-grains",
      }),
    ).toBe(true);
  });

  it("accepts millet as the crop story", () => {
    expect(
      productFitsStory(crop, {
        name: "Organic Foxtail Millet",
        slug: "organic-foxtail-millet",
        origin: "Anantapur, Andhra Pradesh",
        categorySlug: "millets",
      }),
    ).toBe(true);
  });

  it("never puts honey on a crop-growth story", () => {
    expect(
      productFitsStory(crop, {
        name: "Organic Raw Forest Honey",
        slug: "organic-raw-forest-honey",
        origin: "Western Ghats apiaries, Karnataka",
        categorySlug: "organic-honey",
      }),
    ).toBe(false);
  });

  it("does not treat oil as a grain harvest", () => {
    expect(
      productFitsStory(crop, {
        name: "Cold Pressed Groundnut Oil",
        slug: "cold-pressed-groundnut-oil",
        origin: "Saurashtra, Gujarat",
        categorySlug: "cold-pressed-oils",
      }),
    ).toBe(false);
  });
});
