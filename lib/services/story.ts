import { formatPrice } from "@/lib/formatters";
import { hydrateCard, listPublicCategories } from "@/lib/services/catalog";
import * as productsRepo from "@/lib/repositories/products";
import { HOMEPAGE_STORY_KIND, STORY_RULES } from "@/lib/story/config";
import type { GrowthStoryView, StoryKind, StoryMatchRule } from "@/lib/story/types";

function haystack(name: string, slug: string, origin: string | null): string {
  return `${name} ${slug} ${origin ?? ""}`.toLowerCase();
}

export function productFitsStory(
  rule: StoryMatchRule,
  input: { name: string; slug: string; origin: string | null; categorySlug: string | null },
): boolean {
  const text = haystack(input.name, input.slug, input.origin);
  if (rule.exclude.some((w) => text.includes(w))) return false;
  const inCategory = Boolean(input.categorySlug && rule.categorySlugs.includes(input.categorySlug));
  const inName = rule.include.some((w) => text.includes(w));
  return inCategory || inName;
}

/** Resolve a story from published catalog rows. Never invents a product or swaps in an unrelated lot. */
export function resolveGrowthStory(kind: StoryKind = HOMEPAGE_STORY_KIND): GrowthStoryView {
  const rule = STORY_RULES[kind];
  const categories = listPublicCategories();
  const published = productsRepo.listPublishedProducts();

  const candidates = published
    .map((product) => {
      const card = hydrateCard(product);
      if (!card) return null;
      const categorySlug = categories.find((c) => c.id === product.category_id)?.slug ?? null;
      if (
        !productFitsStory(rule, {
          name: product.name,
          slug: product.slug,
          origin: product.origin,
          categorySlug,
        })
      ) {
        return null;
      }
      return card;
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  candidates.sort((a, b) => {
    const ai = rule.preferSlugs.indexOf(a.product.slug);
    const bi = rule.preferSlugs.indexOf(b.product.slug);
    const ap = ai === -1 ? 99 : ai;
    const bp = bi === -1 ? 99 : bi;
    if (ap !== bp) return ap - bp;
    return Number(b.product.is_featured) - Number(a.product.is_featured);
  });

  const match = candidates[0];
  if (!match) {
    return {
      kind: rule.kind,
      cropName: rule.cropName,
      tagline: rule.tagline,
      grainImage: rule.grainImage,
      href: rule.fallbackHref,
      cta: rule.fallbackLabel,
      product: null,
    };
  }

  return {
    kind: rule.kind,
    cropName: rule.cropName,
    tagline: rule.tagline,
    grainImage: rule.grainImage,
    href: `/product/${match.product.slug}`,
    cta: "View product",
    product: {
      name: match.product.name,
      tamil: match.product.tamil_name,
      slug: match.product.slug,
      image: match.image ?? rule.grainImage,
      price: formatPrice(match.variant.price_paise),
      origin: match.product.origin,
    },
  };
}

export function resolveHomepageStory(): GrowthStoryView {
  return resolveGrowthStory(HOMEPAGE_STORY_KIND);
}
