"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, getCartSessionId, setSessionCookie } from "@/lib/auth/session";
import { loginAdmin, loginCustomer, registerCustomer } from "@/lib/services/auth";
import { toUserMessage } from "@/lib/errors";

function safeNext(value: FormDataEntryValue | null, fallback: string, allowPrefix?: string) {
  const next = String(value || fallback);
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (next.startsWith("/admin")) return fallback;
  if (allowPrefix && !next.startsWith(allowPrefix) && next !== fallback) {
    /* customer next can be checkout / account */
  }
  return next;
}

export async function customerLoginAction(_prev: unknown, formData: FormData) {
  try {
    const sessionId = await getCartSessionId();
    const user = loginCustomer(
      { email: formData.get("email"), password: formData.get("password") },
      sessionId,
    );
    await setSessionCookie(user);
  } catch (e) {
    return { error: toUserMessage(e) };
  }
  redirect(safeNext(formData.get("next"), "/account"));
}

export async function adminLoginAction(_prev: unknown, formData: FormData) {
  try {
    const user = loginAdmin({ email: formData.get("email"), password: formData.get("password") });
    await setSessionCookie(user);
  } catch (e) {
    return { error: toUserMessage(e) };
  }
  redirect("/admin");
}

export async function loginAction(_prev: unknown, formData: FormData) {
  return customerLoginAction(_prev, formData);
}

export async function registerAction(_prev: unknown, formData: FormData) {
  try {
    const sessionId = await getCartSessionId();
    const user = registerCustomer(
      {
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone") || "",
      },
      sessionId,
    );
    await setSessionCookie(user);
  } catch (e) {
    return { error: toUserMessage(e) };
  }
  redirect("/account");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function resetPasswordRequestAction(_prev: unknown, formData: FormData) {
  try {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return { ok: false, error: "Please enter a valid email address." };
    }
    const { notificationsService } = await import("@/lib/services/notifications");
    await notificationsService.sendEmail(
      email,
      "Password Reset Request — Ungalil Oruvan",
      `<p>Vanakkam,</p><p>We received a request to reset the password for your account at Ungalil Oruvan. If you made this request, please log in or contact support to finalize the update.</p>`,
    );
    return { ok: true, message: `If an account exists for ${email}, a reset link has been dispatched.` };
  } catch (e) {
    return { ok: false, error: toUserMessage(e) };
  }
}

