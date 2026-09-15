/**
 * Stage 2 — Resend email notification service.
 * Set RESEND_API_KEY and RESEND_FROM_EMAIL in environment variables to activate.
 * Falls back gracefully (logs to console) when not configured.
 */

export interface NotificationResult {
  queued: boolean;
  reason?: string;
}

export function isNotificationsConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

async function sendEmail(to: string, subject: string, html: string): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.log(`[Notification skipped — Resend not configured] To: ${to} | Subject: ${subject}`);
    return {
      queued: false,
      reason: "Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.",
    };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend email error:", err);
      return { queued: false, reason: "Email service error" };
    }
    return { queued: true };
  } catch (err) {
    console.error("Resend sendEmail error:", err);
    return { queued: false, reason: "Could not reach email service" };
  }
}

export async function sendOrderConfirmation(input: {
  to: string;
  orderNumber: string;
  totalFormatted: string;
  items: { name: string; qty: number; price: string }[];
}): Promise<NotificationResult> {
  const itemsHtml = input.items
    .map((i) => `<li>${i.name} × ${i.qty} — ${i.price}</li>`)
    .join("");
  const html = `
    <h1>Order Confirmed: ${input.orderNumber}</h1>
    <p>Thank you for your order at <strong>Ungalil Oruvar</strong>.</p>
    <ul>${itemsHtml}</ul>
    <p><strong>Total: ${input.totalFormatted}</strong></p>
    <p>We will notify you when your order is shipped.</p>
  `;
  return sendEmail(input.to, `Order confirmed: ${input.orderNumber}`, html);
}

export async function sendOrderShipped(input: {
  to: string;
  orderNumber: string;
  trackingNote?: string;
}): Promise<NotificationResult> {
  const html = `
    <h1>Your order has been shipped: ${input.orderNumber}</h1>
    <p>Your order from <strong>Ungalil Oruvar</strong> is on its way!</p>
    ${input.trackingNote ? `<p>${input.trackingNote}</p>` : ""}
    <p>Thank you for shopping with us.</p>
  `;
  return sendEmail(input.to, `Your order has shipped: ${input.orderNumber}`, html);
}

export async function sendContactNotification(input: {
  adminEmail: string;
  fromName: string;
  fromEmail: string;
  message: string;
}): Promise<NotificationResult> {
  const html = `
    <h2>New contact message from ${input.fromName}</h2>
    <p><strong>Email:</strong> ${input.fromEmail}</p>
    <p><strong>Message:</strong></p>
    <p>${input.message.replace(/\n/g, "<br />")}</p>
  `;
  return sendEmail(input.adminEmail, `Contact: message from ${input.fromName}`, html);
}

export { sendEmail };

export const notificationsService = {
  isConfigured: isNotificationsConfigured,
  sendEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendContactNotification,
};

