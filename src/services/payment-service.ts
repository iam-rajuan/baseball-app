import { delay } from '@/utils/delay';

export const paymentService = {
  async submitMockPayment() {
    await delay(600);
    return { success: true };
  },
  async restorePurchase() {
    await delay(400);
    return { restored: true };
  },
};
