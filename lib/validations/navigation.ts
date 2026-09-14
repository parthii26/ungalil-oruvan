import { z } from "zod";

export const navigationItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Label is required").max(60, "Label must be 60 characters or less"),
  url: z.string().trim().min(1, "URL is required").max(200, "URL must be 200 characters or less"),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const navigationListSchema = z.array(navigationItemSchema);

export type NavigationItemInput = z.infer<typeof navigationItemSchema>;
