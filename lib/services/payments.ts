/** Stage 2 interface — Razorpay is not connected. */
export interface PaymentIntent {
  provider: "razorpay";
  configured: false;
  message: string;
}

export class PaymentsService {
  isConfigured() {
    return false;
  }

  createIntent(_orderId: string): PaymentIntent {
    return {
      provider: "razorpay",
      configured: false,
      message: "Live payment capture is deferred to Stage 2. The order remains pending payment.",
    };
  }

  capture(_paymentId: string): never {
    throw new Error("PaymentsService.capture is not implemented in Stage 1.");
  }
}

export const paymentsService = new PaymentsService();
