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
  id: 'monthly' | 'annual';
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

const buildPaymentOption = (
  id: 'monthly' | 'annual',
  pkg: PurchasesPackage,
): PaymentPackageOption => {
  const isMonthly = id === 'monthly';

  return {
    id,
    package: pkg,
    productIdentifier: pkg.product.identifier,
    title: isMonthly ? 'Monthly Membership' : 'Annual Membership',
    billingLabel: isMonthly ? 'Billed every month' : 'Billed every year',
    description: isMonthly
      ? 'Flexible month-to-month access to every premium drill in the academy.'
      : 'Best long-term value for full premium drill access across the year.',
    priceString: pkg.product.priceString,
  };
};

export const paymentService = {
  async getSubscriptionPackages(): Promise<PaymentPackageOption[]> {
    const packages = await getAvailablePackages();

    return [
      buildPaymentOption('monthly', packages.monthly),
      buildPaymentOption('annual', packages.annual),
    ];
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
          message: 'No active premium subscription was found to restore.',
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
