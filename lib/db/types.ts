import type { Paise } from "@/lib/money";

export type ProductStatus = "draft" | "published" | "archived";
export type VariantStatus = "active" | "inactive";
export type OrderStatus =
  | "pending_payment"
  | "cancelled"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "customer" | "admin";
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  profile_id: string;
  notes: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  profile_id: string;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string;
  image_path: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  ingredients: string | null;
  origin: string | null;
  storage_instructions: string | null;
  shelf_life: string | null;
  status: ProductStatus;
  is_featured: boolean;
  is_bestseller: boolean;
  hsn: string | null;
  tax_rate_bps: number;
  fssai_license: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tamil_name: string | null;
  search_text: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  barcode: string | null;
  title: string;
  weight_grams: number;
  price_paise: Paise;
  compare_at_paise: Paise | null;
  cost_paise: Paise | null;
  status: VariantStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  path: string;
  alt: string;
  position: number;
  is_thumbnail: boolean;
  created_at: string;
}

export interface ProductCertification {
  id: string;
  product_id: string;
  name: string;
  number: string | null;
  valid_from: string | null;
  valid_until: string | null;
  document_path: string | null;
  created_at: string;
}

export interface ProductNutrition {
  id: string;
  product_id: string;
  serving: string;
  energy_kcal: number | null;
  protein_g: number | null;
  carbohydrates_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  extra: Record<string, string | number>;
}

export interface DietaryTag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductDietaryTag {
  product_id: string;
  tag_id: string;
}

export interface Cart {
  id: string;
  customer_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  customer_id: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  variant_id: string;
  created_at: string;
}

export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percentage points (e.g. 10) or paise
  min_subtotal_paise: Paise;
  max_discount_paise: Paise | null;
  starts_at: string;
  ends_at: string;
  usage_limit: number | null;
  per_customer_limit: number | null;
  product_ids: string[];
  category_ids: string[];
  is_active: boolean;
  created_at: string;
}

export interface CouponRedemption {
  id: string;
  coupon_id: string;
  customer_id: string | null;
  order_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  email: string;
  status: OrderStatus;
  coupon_code: string | null;
  subtotal_paise: Paise;
  discount_paise: Paise;
  tax_paise: Paise;
  shipping_paise: Paise;
  grand_total_paise: Paise;
  shipping_address: AddressSnapshot;
  billing_address: AddressSnapshot;
  notes: string | null;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface AddressSnapshot {
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  product_name: string;
  variant_title: string;
  sku: string;
  quantity: number;
  unit_price_paise: Paise;
  discount_paise: Paise;
  tax_paise: Paise;
  line_total_paise: Paise;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  type: string;
  message: string;
  created_at: string;
}

export interface SiteSettings {
  brand_name: string;
  logo_path: string | null;
  accent_color: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social: { instagram?: string; facebook?: string; youtube?: string };
  footer_text: string;
  hero_headline: string;
  hero_subhead: string;
  hero_tamil: string;
  hero_image: string;
  tamil_tagline: string;
  english_tagline: string;
  login_headline: string;
  login_subhead: string;
  story_title: string;
  story_tamil: string;
  gstin: string | null;
  fssai: string | null;
  seo_title: string;
  seo_description: string;
  free_shipping_over_paise: Paise;
  flat_shipping_paise: Paise;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_path: string | null;
  published: boolean;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  position: number;
  published: boolean;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
}

export interface Database {
  profiles: Profile[];
  customers: Customer[];
  admin_users: AdminUser[];
  addresses: Address[];
  categories: Category[];
  products: Product[];
  product_variants: ProductVariant[];
  product_images: ProductImage[];
  product_certifications: ProductCertification[];
  product_nutrition: ProductNutrition[];
  dietary_tags: DietaryTag[];
  product_dietary_tags: ProductDietaryTag[];
  carts: Cart[];
  cart_items: CartItem[];
  wishlists: Wishlist[];
  wishlist_items: WishlistItem[];
  coupons: Coupon[];
  coupon_redemptions: CouponRedemption[];
  orders: Order[];
  order_items: OrderItem[];
  order_events: OrderEvent[];
  order_sequence: number;
  site_settings: SiteSettings;
  blog_posts: BlogPost[];
  faqs: Faq[];
  pages: Page[];
  reviews: Review[];
  webhook_events: { id: string; source: string; payload: unknown; created_at: string }[];
  outbox_events: { id: string; type: string; payload: unknown; processed_at: string | null; created_at: string }[];
}
