import { SESSION_COOKIE } from "@/lib/auth/cookies";
import { redirectRel, requestIsHttps } from "@/lib/auth/cookie-options";

export async function POST(request: Request) {
  const admin = new URL(request.url).searchParams.get("admin") === "1";
  const https = requestIsHttps(request.headers);
  return redirectRel(admin ? "/admin/login" : "/", https, { name: SESSION_COOKIE, value: "", clear: true });
}
