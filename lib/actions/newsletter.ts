"use server";

import { subscribeEmail } from "@/lib/repositories/newsletter";
import { notificationsService } from "@/lib/services/notifications";

export async function subscribeNewsletterAction(_prev: unknown, formData: FormData) {
  try {
    const email = String(formData.get("email") || "").trim();
    const result = subscribeEmail(email);
    if (!result.ok) {
      return { ok: false, error: result.message };
    }

    // Attempt to send welcome notification asynchronously if configured
    try {
      await notificationsService.sendEmail(
        email,
        "Welcome to Ungalil Oruvar Harvest Updates",
        `
          <div style="font-family: serif; color: #1c281e; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #243e2b;">Ungalil Oruvar</h1>
            <p>Vanakkam,</p>
            <p>Thank you for joining our community of organic pantry patrons. We'll share new crop harvests, cold-pressing schedules, and community recipes with you.</p>
            <p style="margin-top: 24px; color: #5a665b; font-size: 13px;">Pure, organic, and ethically sourced from local farmers.</p>
          </div>
        `,
      );
    } catch {
      // Non-blocking notification fallback
    }

    return { ok: true, message: result.message };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
