import { z } from "zod";

export const variantSchema = z.object({
  sku: z.string().min(2).max(40),
  barcode: z.string().optional().or(z.literal("")),
  title: z.string().min(1).max(60),
  weight_grams: z.coerce.number().int().min(1),
  price_paise: z.coerce.number().int().min(0),
  compare_at_paise: z.coerce.number().int().min(0).optional().or(z.literal("")),
  cost_paise: z.coerce.number().int().min(0).optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export const categoryFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});
