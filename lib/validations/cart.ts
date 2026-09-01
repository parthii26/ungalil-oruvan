import { z } from "zod";

export const cartItemSchema = z.object({
  variant_id: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const updateQtySchema = z.object({
  item_id: z.string().min(1),
  quantity: z.number().int().min(0).max(20),
});
