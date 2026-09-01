import { loginCustomer } from "@/lib/services/auth";
import { signSession } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth/cookies";
import { redirectRel, requestIsHttps, safeInternalPath } from "@/lib/auth/cookie-options";
import { toUserMessage } from "@/lib/errors";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeInternalPath(String(form.get("next") || "/account"), "/account");
  const https = requestIsHttps(request.headers);
  try {
    const user = loginCustomer(
      { email: String(form.get("email") || ""), password: String(form.get("password") || "") },
      request.cookies.get("vz_cart")?.value ?? null,
    );
    const token = await signSession(user);
    return redirectRel(next, https, { name: SESSION_COOKIE, value: token });
  } catch (e) {
    const params = new URLSearchParams({ error: toUserMessage(e) });
    if (next !== "/account") params.set("next", next);
    return redirectRel(`/login?${params.toString()}`, https);
  }
}
