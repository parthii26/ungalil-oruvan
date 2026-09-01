import { z } from "zod";
import { addressSchema } from "./address";

export const checkoutSchema = z.object({
  email: z.string().email(),
  address_id: z.string().optional(),
  address: addressSchema.optional(),
  coupon_code: z.string().optional(),
  notes: z.string().max(240).optional(),
  idempotency_key: z.string().min(8),
});
