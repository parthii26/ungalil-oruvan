/** Editorial story kinds. Each maps to a visual sequence — not every product uses CROP_GROWTH. */
export type StoryKind = "CROP_GROWTH" | "FLOWER_TO_HONEY" | "SEED_TO_OIL" | "ROOT_TO_SPICE" | "HERB_TO_PRODUCT";

export type StoryMatchRule = {
  kind: StoryKind;
  cropName: string;
  categorySlugs: string[];
  include: string[];
  exclude: string[];
  preferSlugs: string[];
  grainImage: string;
  fallbackHref: string;
  fallbackLabel: string;
  tagline: string;
};

export type GrowthStoryProduct = {
  name: string;
  tamil: string | null;
  slug: string;
  image: string;
  price: string;
  origin: string | null;
};

/** Serializable payload for the client animation. Product fields come from the catalog. */
export type GrowthStoryView = {
  kind: StoryKind;
  cropName: string;
  tagline: string;
  grainImage: string;
  href: string;
  cta: string;
  product: GrowthStoryProduct | null;
};
