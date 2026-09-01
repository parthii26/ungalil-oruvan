import { BusinessRuleError, NotFoundError } from "@/lib/errors";
import * as productsRepo from "@/lib/repositories/products";
import * as categoriesRepo from "@/lib/repositories/categories";
import type { Product, ProductVariant } from "@/lib/db/types";

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export interface CatalogQuery {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  tag?: string;
  availability?: "in" | "all";
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface ProductCard {
  product: Product;
  variant: ProductVariant;
  image: string | null;
  categoryName: string;
  tags: { name: string; slug: string }[];
}

export function hydrateCard(product: Product): ProductCard | null {
  const variants = productsRepo.getVariants(product.id).filter((v) => v.status === "active");
  if (!variants.length) return null;
  const variant = variants[0];
  const image = productsRepo.getThumbnail(product.id)?.path ?? null;
  const cat = categoriesRepo.getCategoryById(product.category_id);
  return {
    product,
    variant,
    image,
    categoryName: cat?.name ?? "",
    tags: productsRepo.getDietaryTags(product.id).map((t) => ({ name: t.name, slug: t.slug })),
  };
}

export function searchCatalog(query: CatalogQuery) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(48, query.pageSize ?? 12);
  let list = productsRepo.listPublishedProducts();

  if (query.category) {
    const cat = categoriesRepo.getCategoryBySlug(query.category);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
  }

  if (query.q) {
    const q = query.q.toLowerCase().trim();
    list = list.filter((p) => p.search_text.includes(q) || p.name.toLowerCase().includes(q));
  }

  if (query.tag) {
    list = list.filter((p) => productsRepo.getDietaryTags(p.id).some((t) => t.slug === query.tag));
  }

  let cards = list.map(hydrateCard).filter((c): c is ProductCard => Boolean(c));

  if (query.min != null) cards = cards.filter((c) => c.variant.price_paise >= query.min!);
  if (query.max != null) cards = cards.filter((c) => c.variant.price_paise <= query.max!);

  const sort = query.sort ?? "featured";
  cards.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.variant.price_paise - b.variant.price_paise;
      case "price-desc":
        return b.variant.price_paise - a.variant.price_paise;
      case "newest":
        return b.product.created_at.localeCompare(a.product.created_at);
      case "rating":
        return (b.product.is_bestseller ? 1 : 0) - (a.product.is_bestseller ? 1 : 0);
      default:
        return Number(b.product.is_featured) - Number(a.product.is_featured);
    }
  });

  const total = cards.length;
  const start = (page - 1) * pageSize;
  return {
    items: cards.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function searchSuggestions(q: string, limit = 6) {
  if (!q.trim()) return [];
  const { items } = searchCatalog({ q, pageSize: limit, page: 1 });
  return items.map((i) => ({ name: i.product.name, slug: i.product.slug, image: i.image }));
}

export function getPublicProduct(slug: string) {
  const product = productsRepo.getProductBySlug(slug);
  if (!product || product.status !== "published") throw new NotFoundError("This product is not available.");
  return assembleProduct(product);
}

export function assembleProduct(product: Product) {
  const variants = productsRepo.getVariants(product.id);
  const images = productsRepo.getImages(product.id);
  const nutrition = productsRepo.getNutrition(product.id);
  const certifications = productsRepo.getCertifications(product.id);
  const tags = productsRepo.getDietaryTags(product.id);
  const category = categoriesRepo.getCategoryById(product.category_id);
  return { product, variants, images, nutrition, certifications, tags, category };
}

export function relatedProducts(productId: string, categoryId: string, limit = 4) {
  return productsRepo
    .listPublishedProducts()
    .filter((p) => p.id !== productId && p.category_id === categoryId)
    .slice(0, limit)
    .map(hydrateCard)
    .filter((c): c is ProductCard => Boolean(c));
}

export function featuredProducts(limit = 4) {
  return productsRepo
    .listPublishedProducts()
    .filter((p) => p.is_featured)
    .slice(0, limit)
    .map(hydrateCard)
    .filter((c): c is ProductCard => Boolean(c));
}

export function bestSellers(limit = 4) {
  return productsRepo
    .listPublishedProducts()
    .filter((p) => p.is_bestseller)
    .slice(0, limit)
    .map(hydrateCard)
    .filter((c): c is ProductCard => Boolean(c));
}

export function assertPurchasable(variantId: string) {
  const variant = productsRepo.getVariantById(variantId);
  if (!variant || variant.status !== "active") {
    throw new BusinessRuleError("This option is not available.");
  }
  const product = productsRepo.getProductById(variant.product_id);
  if (!product || product.status !== "published") {
    throw new BusinessRuleError("This product cannot be purchased.");
  }
  return { product, variant };
}

export function listPublicCategories() {
  return categoriesRepo.listActiveCategories();
}
