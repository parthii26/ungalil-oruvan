import { BIO_EDGES, BIO_HYSTERESIS } from "./growth-progress";

/** Timeline labels for the one continuous plant. Photos do not drive stages. */
export type GrowthStage = {
  id: "seed" | "germination" | "sprout" | "young" | "growth" | "paddy" | "harvest";
  number: string;
  title: string;
  tamil: string;
  caption: string;
};

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: "seed",
    number: "01",
    title: "Seed",
    tamil: "விதை",
    caption: "A single grain carries the beginning of the crop.",
  },
  {
    id: "germination",
    number: "02",
    title: "Germination",
    tamil: "முளை",
    caption: "The seed opens. A root finds the dark.",
  },
  {
    id: "sprout",
    number: "03",
    title: "Sprout",
    tamil: "தளிர்",
    caption: "A pale shoot reaches for the light.",
  },
  {
    id: "young",
    number: "04",
    title: "Young plant",
    tamil: "இளம் பயிர்",
    caption: "Leaves unfold from the stem, one node at a time.",
  },
  {
    id: "growth",
    number: "05",
    title: "Growth",
    tamil: "வளர்ச்சி",
    caption: "The culm rises. The plant takes its height.",
  },
  {
    id: "paddy",
    number: "06",
    title: "Paddy",
    tamil: "நெற்பயிர்",
    caption: "A panicle forms. Grain begins to fill.",
  },
  {
    id: "harvest",
    number: "07",
    title: "Harvest",
    tamil: "அறுவடை",
    caption: "Green gives way to gold. The crop is ready.",
  },
];

/** Post-harvest only — never used for stages 01–06 or the growing plant. */
export const POST_HARVEST_GRAIN = "/images/growth/rice-08-grain.webp";

export const STAGE_EDGES = [...BIO_EDGES];
export const HYSTERESIS = BIO_HYSTERESIS;
