import { z } from "zod";

export const registerSchema = z.object({
  full_name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  phone: z.string().min(10).max(15).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(72),
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(80),
  phone: z.string().min(10).max(15).optional().or(z.literal("")),
});
