/** Stage 2 interface — Resend / WhatsApp are not connected. */
export class NotificationService {
  isConfigured() {
    return false;
  }

  enqueue(_type: string, _payload: unknown) {
    return { queued: false, reason: "Notifications are a Stage 2 integration." };
  }
}

export const notificationService = new NotificationService();
