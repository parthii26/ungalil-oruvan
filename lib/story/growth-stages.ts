import { BIO_EDGES, BIO_HYSTERESIS } from "./growth-progress";

/** Timeline labels for the scroll-driven story. Scroll drives stages; photos illustrate them. */
export type GrowthStage = {
  id: "seed" | "germination" | "sprout" | "young" | "growth" | "paddy" | "harvest";
  number: string;
  title: string;
  tamil: string;
  caption: string;
  /** Realistic field photograph illustrating this stage. */
  photo: string;
  alt: string;
};

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: "seed",
    number: "01",
    title: "Seed",
    tamil: "விதை",
    caption: "A single grain carries the beginning of the crop.",
    photo: "/images/growth/rice-01-seed.webp",
    alt: "Ungalil Oruvan rice seed resting in dark soil",
  },
  {
    id: "germination",
    number: "02",
    title: "Germination",
    tamil: "முளை",
    caption: "The seed opens. A root finds the dark.",
    photo: "/images/growth/rice-02-germination.webp",
    alt: "Rice seed germinating, a white root reaching into moist earth",
  },
  {
    id: "sprout",
    number: "03",
    title: "Sprout",
    tamil: "தளிர்",
    caption: "A pale shoot reaches for the light.",
    photo: "/images/growth/rice-03-sprout.webp",
    alt: "A tiny green rice sprout rising in the paddy",
  },
  {
    id: "young",
    number: "04",
    title: "Young plant",
    tamil: "இளம் பயிர்",
    caption: "Leaves unfold from the stem, one node at a time.",
    photo: "/images/growth/rice-05-developing.webp",
    alt: "Young rice transplants developing in a flooded paddy at dawn",
  },
  {
    id: "growth",
    number: "05",
    title: "Growth",
    tamil: "வளர்ச்சி",
    caption: "The culm rises. The plant takes its height.",
    photo: "/images/growth/rice-04-young.webp",
    alt: "Young rice plant growing tall in a flooded green paddy",
  },
  {
    id: "paddy",
    number: "06",
    title: "Paddy",
    tamil: "நெற்பயிர்",
    caption: "A panicle forms. Grain begins to fill.",
    photo: "/images/growth/rice-06-paddy.webp",
    alt: "Vast green paddy field under a bright sky",
  },
  {
    id: "harvest",
    number: "07",
    title: "Harvest",
    tamil: "அறுவடை",
    caption: "Green gives way to gold. The crop is ready.",
    photo: "/images/growth/rice-07-golden.webp",
    alt: "Golden ripe paddy field ready for harvest",
  },
];

/** Post-harvest only — never used for stages 01–06 or the growing plant. */
export const POST_HARVEST_GRAIN = "/images/growth/rice-08-grain.webp";

export const STAGE_EDGES = [...BIO_EDGES];
export const HYSTERESIS = BIO_HYSTERESIS;
