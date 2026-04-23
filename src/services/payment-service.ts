import { apiClient, unwrap } from '@/lib/api-client';
import { authService } from '@/services/auth-service';

type PaymentResponse = {
  success: boolean;
  transactionId: string;
  amount: number;
};

export const paymentService = {
  async submitPayment(email: string, country: string): Promise<PaymentResponse> {
    return unwrap<PaymentResponse>(
      apiClient.post('/payments/complete', {
        email,
        country,
      }),
    );
  },
  async restorePurchase(): Promise<{ restored: boolean }> {
    try {
      const profile = await authService.getProfile();
      return { restored: Boolean(profile.isPremium) };
    } catch {
      return { restored: false };
    }
  },
};
