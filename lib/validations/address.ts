import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(10).max(15),
  line1: z.string().min(4).max(120),
  line2: z.string().max(120).optional().or(z.literal("")),
  landmark: z.string().max(80).optional().or(z.literal("")),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
  postal_code: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid Indian PIN code"),
  country: z.string().default("IN"),
  is_default: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
