import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { env } from "@/lib/env";
import type { Role } from "@/lib/permissions";
import { CART_COOKIE, SESSION_COOKIE } from "./cookies";
import { requestIsHttps, sessionCookieOptions } from "./cookie-options";

export { CART_COOKIE, SESSION_COOKIE };

export interface SessionUser {
  userId: string;
  customerId: string | null;
  email: string;
  name: string;
  role: Role;
}

const encoder = new TextEncoder();

function secret() {
  return encoder.encode(env.authSecret);
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret());
}

export async function readSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.userId || !payload.email || !payload.role) return null;
    return {
      userId: String(payload.userId),
      customerId: payload.customerId ? String(payload.customerId) : null,
      email: String(payload.email),
      name: String(payload.name ?? ""),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readSessionToken(token);
}

export async function setSessionCookie(user: SessionUser) {
  const token = await signSession(user);
  const hdrs = await headers();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions(requestIsHttps(hdrs)));
}

export async function clearSessionCookie() {
  const jar = await cookies();
  const hdrs = await headers();
  const https = requestIsHttps(hdrs);
  jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(https), maxAge: 0 });
}

export async function getOrCreateCartSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CART_COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  const hdrs = await headers();
  jar.set(CART_COOKIE, id, sessionCookieOptions(requestIsHttps(hdrs)));
  return id;
}

export async function getCartSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(CART_COOKIE)?.value ?? null;
}
