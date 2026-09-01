import { z } from "zod";

export const applyCouponSchema = z.object({
  code: z.string().min(2).max(32).transform((s) => s.trim().toUpperCase()),
});
