import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const MAX_AGE = 60 * 60 * 24 * 14;

export function sessionCookieOptions(https: boolean): Partial<ResponseCookie> {
  if (https) {
    return {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: MAX_AGE,
    };
  }
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
    maxAge: MAX_AGE,
  };
}

function forwardedHost(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-host")?.split(",")[0].trim() ||
    headersList.get("host") ||
    ""
  );
}

export function requestIsHttps(headersList: Headers): boolean {
  const proto = headersList.get("x-forwarded-proto")?.split(",")[0].trim();
  if (proto === "https") return true;
  const host = forwardedHost(headersList);
  return host.includes("e2b.app") || host.includes("e2b.dev") || host.includes("netlify.app");
}

export function safeInternalPath(value: string | null | undefined, fallback: string): string {
  const next = String(value || fallback);
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (next.startsWith("/admin") && fallback !== "/admin") return fallback;
  return next;
}

/** Relative 303 — never send the browser to 127.0.0.1 behind a preview proxy. */
export function redirectRel(
  path: string,
  https: boolean,
  cookie?: { name: string; value: string; clear?: boolean },
) {
  const res = new Response(null, {
    status: 303,
    headers: { Location: path },
  });
  if (cookie) {
    const opts = sessionCookieOptions(https);
    const parts = [
      `${cookie.name}=${cookie.value}`,
      "Path=/",
      "HttpOnly",
      cookie.clear ? "Max-Age=0" : `Max-Age=${opts.maxAge}`,
      opts.secure ? "Secure" : "",
      `SameSite=${opts.sameSite === "none" ? "None" : "Lax"}`,
    ].filter(Boolean);
    res.headers.append("Set-Cookie", parts.join("; "));
  }
  return res;
}
