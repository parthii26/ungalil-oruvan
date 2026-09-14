import type { SiteSettings } from "@/lib/db/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_name: "Ungalil Oruvan",
  logo_path: null,
  accent_color: "#B85C38",
  contact_email: "hello@ungaliloruvan.example",
  contact_phone: "+91 80 0000 0000",
  address: "",
  social: { instagram: "https://instagram.com", facebook: "https://facebook.com" },
  footer_text: "One among you. Organic pantry goods from small farm lots.",
  hero_headline: "From Our Soil to Your Table",
  hero_subhead: "Millets, cold-pressed oils, spices, and honey — packed with the patience of the land they grew on.",
  hero_tamil: "நமது மண்ணிலிருந்து உங்கள் மேசைக்கு",
  hero_image: "/images/farm-dawn.jpg",
  tamil_tagline: "உங்களில் ஒருவன்",
  english_tagline: "One among you",
  login_headline: "Good Food. Naturally.",
  login_subhead: "Discover authentic, responsibly sourced organic products.",
  story_title: "Rooted in Our Soil",
  story_tamil: "நமது மண்ணில் வேரூன்றியது",
  story_body:
    "Traditional roots, modern commerce. The storefront carries honest soil in its details — millet names, farm lots, terracotta accents — without turning the shop into a costume. Words here are configuration-ready from Settings.",
  about_tamil_badge: "உங்களில் ஒருவன்",
  about_title: "Ungalil Oruvan",
  about_intro: "One among you. Organic pantry goods from small farm lots.",
  about_image_1: "/images/farm-dawn.jpg",
  about_image_1_alt: "Farm at dawn",
  about_image_2: "/images/soil-hands.jpg",
  about_image_2_alt: "Soil in working hands",
  gstin: null,
  fssai: null,
  seo_title: "Ungalil Oruvan — Organic pantry",
  seo_description: "Ungalil Oruvan. Premium traditional organic pantry. Honey, oils, millets, spices.",
  free_shipping_over_paise: 99900,
  flat_shipping_paise: 7900,
};

export function withSettingsDefaults(partial?: Partial<SiteSettings> | null): SiteSettings {
  return { ...DEFAULT_SITE_SETTINGS, ...(partial ?? {}), social: { ...DEFAULT_SITE_SETTINGS.social, ...partial?.social } };
}
