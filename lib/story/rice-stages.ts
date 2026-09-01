export type RiceStageId =
  | "seed"
  | "germination"
  | "sprout"
  | "young"
  | "developing"
  | "mature"
  | "golden"
  | "grain"
  | "product";

export type RiceStage = {
  id: RiceStageId;
  n: string;
  label: string;
  tamil: string;
  line: string;
  src: string;
  alt: string;
};

/** Photographic rice sequence. Product src is injected from catalog at render. */
export const RICE_STAGES: RiceStage[] = [
  {
    id: "seed",
    n: "01",
    label: "Seed",
    tamil: "விதை",
    line: "A single grain. The field is still a thought.",
    src: "/images/growth/rice-01-seed.webp",
    alt: "Rice seed on damp soil",
  },
  {
    id: "germination",
    n: "02",
    label: "Germination",
    tamil: "முளை",
    line: "The seed splits. A root finds the dark.",
    src: "/images/growth/rice-02-germination.webp",
    alt: "Rice seed germinating",
  },
  {
    id: "sprout",
    n: "03",
    label: "Sprout",
    tamil: "தளிர்",
    line: "Two narrow leaves meet the morning.",
    src: "/images/growth/rice-03-sprout.webp",
    alt: "Rice seedling emerging from mud",
  },
  {
    id: "young",
    n: "04",
    label: "Young plant",
    tamil: "இளம் பயிர்",
    line: "The crop establishes its roots.",
    src: "/images/growth/rice-04-young.webp",
    alt: "Young rice plant in paddy water",
  },
  {
    id: "developing",
    n: "05",
    label: "Growth",
    tamil: "வளர்ந்து வரும் பயிர்",
    line: "More leaves. A stronger stem. Neighbours appear.",
    src: "/images/growth/rice-05-developing.webp",
    alt: "Developing rice plant",
  },
  {
    id: "mature",
    n: "06",
    label: "Paddy",
    tamil: "நெற்பயிர்",
    line: "One plant becomes the field.",
    src: "/images/growth/rice-06-mature.webp",
    alt: "Green Tamil Nadu paddy field at dawn",
  },
  {
    id: "golden",
    n: "07",
    label: "Harvest",
    tamil: "அறுவடை",
    line: "Green gives way to gold when the grain is ready.",
    src: "/images/growth/rice-07-golden.webp",
    alt: "Golden ripe paddy",
  },
  {
    id: "grain",
    n: "08",
    label: "Grain",
    tamil: "நெல்",
    line: "The field, now small enough to hold.",
    src: "/images/growth/rice-08-grain.webp",
    alt: "Harvested rice grain",
  },
];
