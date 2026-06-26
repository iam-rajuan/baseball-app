import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

import {
  getAvailablePackages,
  hasPremiumAccess,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
} from '@/services/revenuecat-service';

export type PaymentPackageOption = {
  billingLabel: string;
  description: string;
  id: 'lifetime';
  package: PurchasesPackage;
  priceString: string;
  productIdentifier: string;
  title: string;
};

export type PaymentActionResult = {
  customerInfo?: CustomerInfo;
  message?: string;
  status: 'cancelled' | 'not_entitled' | 'success';
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Something went wrong while contacting the store. Please try again.';
};

const isCancelledPurchaseError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return Boolean(
    'userCancelled' in error &&
      typeof (error as { userCancelled?: unknown }).userCancelled === 'boolean' &&
      (error as { userCancelled: boolean }).userCancelled,
  );
};

const buildPaymentOption = (pkg: PurchasesPackage): PaymentPackageOption => {
  return {
    id: 'lifetime',
    package: pkg,
    productIdentifier: pkg.product.identifier,
    title: 'Lifetime Premium Access',
    billingLabel: 'One-time purchase',
    description: 'Unlock all premium drills with a one-time purchase.',
    priceString: pkg.product.priceString,
  };
};

export const paymentService = {
  async getLifetimePackage(): Promise<PaymentPackageOption> {
    const packages = await getAvailablePackages();

    return buildPaymentOption(packages.lifetime);
  },

  async purchasePackage(selectedPackage: PurchasesPackage): Promise<PaymentActionResult> {
    try {
      const result = await purchaseRevenueCatPackage(selectedPackage);
      const premiumActive = hasPremiumAccess(result.customerInfo);

      if (!premiumActive) {
        return {
          status: 'not_entitled',
          customerInfo: result.customerInfo,
          message: 'Purchase completed, but premium access is not active yet. Please try Restore Purchases.',
        };
      }

      return {
        status: 'success',
        customerInfo: result.customerInfo,
      };
    } catch (error) {
      if (isCancelledPurchaseError(error)) {
        return {
          status: 'cancelled',
          message: 'Purchase cancelled.',
        };
      }

      throw new Error(getErrorMessage(error));
    }
  },

  async restorePurchase(): Promise<PaymentActionResult> {
    try {
      const customerInfo = await restoreRevenueCatPurchases();
      const premiumActive = hasPremiumAccess(customerInfo);

      if (!premiumActive) {
        return {
          status: 'not_entitled',
          customerInfo,
          message: 'No previous lifetime purchase was found to restore.',
        };
      }

      return {
        status: 'success',
        customerInfo,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
