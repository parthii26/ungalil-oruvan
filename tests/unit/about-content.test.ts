import { describe, it, expect, beforeEach } from "vitest";
import { withSettingsDefaults, DEFAULT_SITE_SETTINGS } from "@/lib/brand/defaults";
import { aboutContentSchema } from "@/lib/validations/about";
import { getSettings, updateSettings } from "@/lib/repositories/settings";
import { resetDb } from "@/lib/db/store";

describe("About Content Defaults, Schema & Settings Repository", () => {
  beforeEach(() => {
    resetDb();
  });

  it("DEFAULT_SITE_SETTINGS includes all required about page fields", () => {
    expect(DEFAULT_SITE_SETTINGS.about_tamil_badge).toBe("உங்களில் ஒருவர்");
    expect(DEFAULT_SITE_SETTINGS.about_title).toBe("Ungalil Oruvar");
    expect(DEFAULT_SITE_SETTINGS.about_intro).toContain("One among you");
    expect(DEFAULT_SITE_SETTINGS.about_image_1).toBe("/images/farm-dawn.jpg");
    expect(DEFAULT_SITE_SETTINGS.about_image_2).toBe("/images/soil-hands.jpg");
    expect(DEFAULT_SITE_SETTINGS.story_tamil).toBe("நமது மண்ணில் வேரூன்றியது");
    expect(DEFAULT_SITE_SETTINGS.story_title).toBe("Rooted in Our Soil");
    expect(DEFAULT_SITE_SETTINGS.story_body).toContain("Traditional roots, modern commerce");
  });

  it("withSettingsDefaults fills in missing about fields", () => {
    const partial = withSettingsDefaults({ brand_name: "Custom Farm" });
    expect(partial.brand_name).toBe("Custom Farm");
    expect(partial.about_title).toBe("Ungalil Oruvar");
    expect(partial.about_image_1).toBe("/images/farm-dawn.jpg");
  });

  it("aboutContentSchema validates valid about page inputs", () => {
    const valid = {
      about_tamil_badge: "உங்களில் ஒருவர்",
      about_title: "Ungalil Oruvar",
      about_intro: "We grow honest millets and cold-pressed oils.",
      about_image_1: "/images/farm-dawn.jpg",
      about_image_1_alt: "Dawn over the farm",
      about_image_2: "/images/soil-hands.jpg",
      about_image_2_alt: "Working hands with rich soil",
      story_tamil: "நமது மண்ணில் வேரூன்றியது",
      story_title: "Rooted in Our Soil",
      story_body: "Our journey started on four acres of family farmland.",
    };

    const parsed = aboutContentSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.about_title).toBe("Ungalil Oruvar");
      expect(parsed.data.story_title).toBe("Rooted in Our Soil");
    }
  });

  it("aboutContentSchema rejects empty required fields", () => {
    const invalid = {
      about_tamil_badge: "",
      about_title: "", // empty title
      about_intro: "", // empty intro
      about_image_1: "",
      about_image_1_alt: "",
      about_image_2: "",
      about_image_2_alt: "",
      story_tamil: "",
      story_title: "",
      story_body: "",
    };

    const parsed = aboutContentSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("settings repository updates and persists about page fields", () => {
    updateSettings({
      about_title: "Modern Soil Pantry",
      about_intro: "Organic pantry goods from family farms.",
      story_title: "Our Heritage",
      story_body: "Passed down across four generations.",
    });

    const updated = getSettings();
    expect(updated.about_title).toBe("Modern Soil Pantry");
    expect(updated.about_intro).toBe("Organic pantry goods from family farms.");
    expect(updated.story_title).toBe("Our Heritage");
    expect(updated.story_body).toBe("Passed down across four generations.");
  });
});
