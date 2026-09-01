import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/cookies";

async function readRole(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET || "varizel-dev-auth-secret-change-in-production-32"),
    );
    return String(payload.role ?? "");
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await readRole(request);

  if (pathname === "/admin/login") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/auth/login") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "customer") {
      const next = request.nextUrl.searchParams.get("next");
      const dest = next && next.startsWith("/") && !next.startsWith("/admin") ? next : "/account";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    if (pathname === "/auth/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!role) return NextResponse.redirect(new URL("/admin/login", request.url));
    if (role !== "admin") return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  if (pathname.startsWith("/account") && !role) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/account/:path*", "/login", "/auth/login"],
};
