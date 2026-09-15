import type { SiteSettings } from "@/lib/db/types";

function readEnv(key: string, fallback: string): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    const val = process.env[key]!.trim();
    if (val.length > 0) return val;
  }
  return fallback;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_name: "Ungalil Oruvan",
  logo_path: null,
  accent_color: "#B85C38",
  contact_email: readEnv("CONTACT_EMAIL", "care@ungaliloruvan.com"),
  contact_phone: readEnv("CONTACT_PHONE", "+91 94430 12345"),
  whatsapp_number: readEnv("WHATSAPP_NUMBER", "+91 94430 12345"),
  support_hours: readEnv("SUPPORT_HOURS", "Mon – Sat: 9:00 AM – 6:00 PM IST"),
  address: readEnv("BUSINESS_ADDRESS", "Tamil Nadu, India"),
  social: {
    instagram: "https://instagram.com/ungaliloruvan",
    facebook: "https://facebook.com/ungaliloruvan",
    whatsapp: "https://wa.me/919443012345",
  },
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
    "Traditional roots, modern commerce. The storefront carries honest soil in its details — millet names, farm lots, terracotta accents — bringing authentic native harvests directly from small family farms to your kitchen table.",
  about_tamil_badge: "உங்களில் ஒருவன்",
  about_title: "Ungalil Oruvan",
  about_intro: "One among you. Organic pantry goods from small farm lots.",
  about_image_1: "/images/farm-dawn.jpg",
  about_image_1_alt: "Farm at dawn",
  about_image_2: "/images/soil-hands.jpg",
  about_image_2_alt: "Soil in working hands",
  gstin: (typeof process !== "undefined" && process.env?.BUSINESS_GSTIN) || null,
  fssai: (typeof process !== "undefined" && process.env?.BUSINESS_FSSAI) || null,
  seo_title: "Ungalil Oruvan — Traditional Organic Pantry",
  seo_description: "Ungalil Oruvan. Premium traditional organic pantry. Raw honey, cold-pressed oils, native millets, and heritage spices directly from verified farm lots.",
  free_shipping_over_paise: 99900,
  flat_shipping_paise: 7900,
};

export function withSettingsDefaults(partial?: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(partial ?? {}),
    social: { ...DEFAULT_SITE_SETTINGS.social, ...partial?.social },
  };
}
