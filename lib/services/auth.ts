import { ConflictError, ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import * as customersRepo from "@/lib/repositories/customers";
import { mergeOnLogin } from "./cart";
import type { SessionUser } from "@/lib/auth/session";

export function registerCustomer(input: unknown, sessionId: string | null): SessionUser {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) throw new ValidationError("Please check your details.", parsed.error.flatten());
  const existing = customersRepo.findProfileByEmail(parsed.data.email);
  if (existing) throw new ConflictError("An account with that email already exists.");
  const { profile, customer } = customersRepo.createCustomerAccount({
    email: parsed.data.email,
    full_name: parsed.data.full_name,
    phone: parsed.data.phone || null,
    password_hash: hashPassword(parsed.data.password),
  });
  if (sessionId) mergeOnLogin(sessionId, customer.id);
  return {
    userId: profile.id,
    customerId: customer.id,
    email: profile.email,
    name: profile.full_name,
    role: "customer",
  };
}

function authenticate(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) throw new ValidationError("Enter a valid email and password.");
  const profile = customersRepo.findProfileByEmail(parsed.data.email);
  if (!profile || !verifyPassword(parsed.data.password, profile.password_hash)) {
    throw new UnauthorizedError("Those credentials do not match our records.");
  }
  return profile;
}

export function loginCustomer(input: unknown, sessionId: string | null): SessionUser {
  const profile = authenticate(input);
  if (profile.role !== "customer") {
    throw new ForbiddenError("Use the store administration sign-in.");
  }
  const customer = customersRepo.getCustomerByProfileId(profile.id);
  if (sessionId && customer) mergeOnLogin(sessionId, customer.id);
  return {
    userId: profile.id,
    customerId: customer?.id ?? null,
    email: profile.email,
    name: profile.full_name,
    role: "customer",
  };
}

export function loginAdmin(input: unknown): SessionUser {
  const profile = authenticate(input);
  if (profile.role !== "admin") {
    throw new ForbiddenError("This portal is for store administrators.");
  }
  return {
    userId: profile.id,
    customerId: null,
    email: profile.email,
    name: profile.full_name,
    role: "admin",
  };
}

/** @deprecated prefer loginCustomer / loginAdmin */
export function login(input: unknown, sessionId: string | null): SessionUser {
  return loginCustomer(input, sessionId);
}

export function toSession(profileId: string): SessionUser | null {
  const profile = customersRepo.findProfileById(profileId);
  if (!profile) return null;
  const customer = customersRepo.getCustomerByProfileId(profile.id);
  return {
    userId: profile.id,
    customerId: customer?.id ?? null,
    email: profile.email,
    name: profile.full_name,
    role: profile.role,
  };
}
