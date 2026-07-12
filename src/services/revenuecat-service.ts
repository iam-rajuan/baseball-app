import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type CustomerInfoUpdateListener,
  PACKAGE_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';

const ENTITLEMENT_ID = 'premium_access';
const OFFERING_ID = 'default';
const PRODUCT_ID = 'mba_premium_lifetime';
const PACKAGE_IDENTIFIER = '$rc_lifetime';

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

const TEMP_LOG_PREFIX = '[RevenueCat]';

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

const getRevenueCatApiKeyPlatformLabel = () => {
  ensureSupportedPlatform();
  return Platform.OS === 'ios' ? 'apple' : 'google';
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

const getLifetimePackage = (offering: PurchasesOffering) => {
  return (
    offering.availablePackages.find((pkg) => pkg.identifier === PACKAGE_IDENTIFIER) ??
    offering.lifetime ??
    offering.availablePackages.find((pkg) => pkg.packageType === PACKAGE_TYPE.LIFETIME) ??
    getPackageByProductId(offering.availablePackages, PRODUCT_ID) ??
    null
  );
};

const isSubscriptionProduct = (pkg: PurchasesPackage) => {
  const { product } = pkg;

  return (
    product.productCategory === PRODUCT_CATEGORY.SUBSCRIPTION ||
    product.productType === PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION ||
    product.productType === PRODUCT_TYPE.PREPAID_SUBSCRIPTION ||
    product.productType === PRODUCT_TYPE.NON_RENEWABLE_SUBSCRIPTION
  );
};

const logSelectedPackage = (offering: PurchasesOffering, pkg: PurchasesPackage) => {
  console.info(
    `${TEMP_LOG_PREFIX} platformApiKey=${getRevenueCatApiKeyPlatformLabel()} offering=${offering.identifier} package=${pkg.identifier} product=${pkg.product.identifier} packageType=${pkg.packageType}`,
  );
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

    console.info(
      `${TEMP_LOG_PREFIX} configuring platformApiKey=${getRevenueCatApiKeyPlatformLabel()}`,
    );

    Purchases.configure({
      apiKey: getRevenueCatApiKey(),
    });
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}

export async function identifyRevenueCatUser(email: string): Promise<void> {
  await ensureConfigured();

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('RevenueCat user email is required.');
  }

  await Purchases.logIn(normalizedEmail);
  Purchases.setEmail(normalizedEmail);
  await Purchases.syncAttributesAndOfferingsIfNeeded();
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  await ensureConfigured();
  return Purchases.getCustomerInfo();
}

export async function refreshCustomerInfo(): Promise<CustomerInfo> {
  await ensureConfigured();
  await Purchases.invalidateCustomerInfoCache();
  return Purchases.getCustomerInfo();
}

export async function getDefaultOffering(): Promise<PurchasesOffering> {
  await ensureConfigured();

  const offerings = await Purchases.getOfferings();
  const defaultOffering =
    (offerings.current?.identifier === OFFERING_ID ? offerings.current : null) ??
    offerings.all[OFFERING_ID] ??
    null;

  if (!defaultOffering) {
    throw new Error(`RevenueCat offering "${OFFERING_ID}" was not found.`);
  }

  console.info(`${TEMP_LOG_PREFIX} currentOffering=${defaultOffering.identifier}`);

  return defaultOffering;
}

export async function getAvailablePackages(): Promise<RevenueCatAvailablePackages> {
  const defaultOffering = await getDefaultOffering();
  const lifetime = getLifetimePackage(defaultOffering);

  if (!lifetime) {
    throw new Error(
      `RevenueCat offering "${OFFERING_ID}" is missing required lifetime package "${PACKAGE_IDENTIFIER}" for product "${PRODUCT_ID}".`,
    );
  }

  if (lifetime.product.identifier !== PRODUCT_ID) {
    throw new Error(
      `RevenueCat lifetime package product mismatch. Expected "${PRODUCT_ID}" but received "${lifetime.product.identifier}".`,
    );
  }

  if (isSubscriptionProduct(lifetime)) {
    throw new Error(
      `RevenueCat lifetime package "${lifetime.identifier}" is incorrectly configured as a subscription. Expected a non-subscription/in-app product for "${PRODUCT_ID}".`,
    );
  }

  logSelectedPackage(defaultOffering, lifetime);

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

export function addRevenueCatCustomerInfoListener(listener: CustomerInfoUpdateListener) {
  Purchases.addCustomerInfoUpdateListener(listener);

  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export function hasPremiumAccess(customerInfo: CustomerInfo | null | undefined): boolean {
  if (!customerInfo) {
    return false;
  }

  return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive);
}

export const revenueCatService = {
  initRevenueCat,
  identifyRevenueCatUser,
  getCustomerInfo,
  refreshCustomerInfo,
  getDefaultOffering,
  getAvailablePackages,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  addRevenueCatCustomerInfoListener,
  hasPremiumAccess,
};
