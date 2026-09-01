import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  short_description: z.string().min(8).max(240),
  description: z.string().min(8).max(8000),
  ingredients: z.string().optional().or(z.literal("")),
  origin: z.string().optional().or(z.literal("")),
  storage_instructions: z.string().optional().or(z.literal("")),
  shelf_life: z.string().optional().or(z.literal("")),
  category_id: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().optional(),
  is_bestseller: z.boolean().optional(),
  hsn: z.string().optional().or(z.literal("")),
  tax_rate_bps: z.coerce.number().int().min(0).max(5000),
  fssai_license: z.string().optional().or(z.literal("")),
  seo_title: z.string().max(70).optional().or(z.literal("")),
  seo_description: z.string().max(160).optional().or(z.literal("")),
  tamil_name: z.string().optional().or(z.literal("")),
  dietary_tag_ids: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(600).optional().or(z.literal("")),
  parent_id: z.string().optional().or(z.literal("")),
  image_path: z.string().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0),
  is_active: z.boolean().optional(),
});
