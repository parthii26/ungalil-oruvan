import { loginAdmin } from "@/lib/services/auth";
import { signSession } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth/cookies";
import { redirectRel, requestIsHttps } from "@/lib/auth/cookie-options";
import { toUserMessage } from "@/lib/errors";

export async function POST(request: Request) {
  const form = await request.formData();
  const https = requestIsHttps(request.headers);
  try {
    const user = loginAdmin({
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    });
    const token = await signSession(user);
    return redirectRel("/admin", https, { name: SESSION_COOKIE, value: token });
  } catch (e) {
    return redirectRel(`/admin/login?error=${encodeURIComponent(toUserMessage(e))}`, https);
  }
}
