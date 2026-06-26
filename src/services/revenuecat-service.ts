import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';

const ENTITLEMENT_ID = 'premium_access';
const OFFERING_ID = 'default';
const PRODUCT_ID = 'mba_premium_lifetime';

const env = {
  appleApiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY,
  googleApiKey: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY,
} as const;

let initPromise: Promise<void> | null = null;

export type RevenueCatAvailablePackages = {
  lifetime: PurchasesPackage;
  all: PurchasesPackage[];
};

const ensureSupportedPlatform = () => {
  if (Platform.OS === 'web') {
    throw new Error('RevenueCat is not supported on web. Use a native iOS or Android build.');
  }

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    throw new Error(`RevenueCat is not supported on platform "${Platform.OS}".`);
  }
};

const getRequiredEnvValue = (value: string | undefined, name: string) => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required RevenueCat environment variable: ${name}`);
  }

  return trimmedValue;
};

const getRevenueCatApiKey = () => {
  ensureSupportedPlatform();

  if (Platform.OS === 'ios') {
    return getRequiredEnvValue(env.appleApiKey, 'EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY');
  }

  return getRequiredEnvValue(env.googleApiKey, 'EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY');
};

const ensureConfigured = async () => {
  const isConfigured = await Purchases.isConfigured();

  if (!isConfigured) {
    await initRevenueCat();
  }
};

const getPackageByProductId = (
  availablePackages: PurchasesPackage[],
  productId: string,
) => {
  return availablePackages.find((pkg) => pkg.product.identifier === productId) ?? null;
};

export async function initRevenueCat(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    ensureSupportedPlatform();

    const isConfigured = await Purchases.isConfigured();

    if (isConfigured) {
      return;
    }

    Purchases.configure({
      apiKey: getRevenueCatApiKey(),
    });
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  await ensureConfigured();
  return Purchases.getCustomerInfo();
}

export async function getDefaultOffering(): Promise<PurchasesOffering> {
  await ensureConfigured();

  const offerings = await Purchases.getOfferings();
  const defaultOffering = offerings.all[OFFERING_ID] ?? null;

  if (!defaultOffering) {
    throw new Error(`RevenueCat offering "${OFFERING_ID}" was not found.`);
  }

  return defaultOffering;
}

export async function getAvailablePackages(): Promise<RevenueCatAvailablePackages> {
  const defaultOffering = await getDefaultOffering();
  const lifetime = getPackageByProductId(defaultOffering.availablePackages, PRODUCT_ID);

  if (!lifetime) {
    throw new Error(
      `RevenueCat offering "${OFFERING_ID}" is missing required product: ${PRODUCT_ID}`,
    );
  }

  return {
    lifetime,
    all: [lifetime],
  };
}

export async function purchaseRevenueCatPackage(pkg: PurchasesPackage) {
  await ensureConfigured();
  return Purchases.purchasePackage(pkg);
}

export async function restoreRevenueCatPurchases(): Promise<CustomerInfo> {
  await ensureConfigured();
  return Purchases.restorePurchases();
}

export function hasPremiumAccess(customerInfo: CustomerInfo | null | undefined): boolean {
  if (!customerInfo) {
    return false;
  }

  return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive);
}

export const revenueCatService = {
  initRevenueCat,
  getCustomerInfo,
  getDefaultOffering,
  getAvailablePackages,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  hasPremiumAccess,
};

