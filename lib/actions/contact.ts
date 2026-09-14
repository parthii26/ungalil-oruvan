"use server";

import { revalidatePath } from "next/cache";
import { createMessage, markRead, deleteMessage } from "@/lib/repositories/contact";
import { toUserMessage } from "@/lib/errors";
import { getSession } from "@/lib/auth/session";
import { ForbiddenError } from "@/lib/errors";

export async function submitContactAction(_prev: unknown, formData: FormData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    if (!name || name.length < 2) return { ok: false, error: "Please enter your name." };
    if (!email || !email.includes("@")) return { ok: false, error: "Please enter a valid email." };
    if (!message || message.length < 10) return { ok: false, error: "Message must be at least 10 characters." };
    createMessage({ name, email, message });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: toUserMessage(e) };
  }
}

export async function markReadAction(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new ForbiddenError("Admin only");
  markRead(id);
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new ForbiddenError("Admin only");
  deleteMessage(id);
  revalidatePath("/admin/messages");
}
