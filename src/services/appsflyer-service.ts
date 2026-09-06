import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

const APPSFLYER_DEV_KEY = 'amqLPNxWYP5cWoZrDe2KcX';
const APPSFLYER_IOS_APP_ID = '6784838370';
const LOG_PREFIX = '[AppsFlyer]';

let initPromise: Promise<void> | null = null;
const trackedPurchaseTransactionIds = new Set<string>();

const isSupportedPlatform = () => Platform.OS === 'ios' || Platform.OS === 'android';

type AppsFlyerEventValues = Record<string, boolean | number | string>;

type ContentViewEvent = {
  category?: string;
  contentId: string;
  contentName: string;
  contentType: 'drill' | 'situation';
};

type ListViewEvent = {
  categoryId?: string;
  itemCount: number;
  listName: string;
  contentType: 'drill_category' | 'drill_list' | 'situation_list';
};

const logDevelopmentInfo = (message: string, data?: unknown) => {
  if (!__DEV__) {
    return;
  }

  if (data === undefined) {
    console.info(`${LOG_PREFIX} ${message}`);
    return;
  }

  console.info(`${LOG_PREFIX} ${message}`, data);
};

const logDevelopmentWarning = (message: string, error?: unknown) => {
  if (!__DEV__) {
    return;
  }

  console.warn(`${LOG_PREFIX} ${message}`, error);
};

const logEvent = async (eventName: string, eventValues: AppsFlyerEventValues) => {
  if (!isSupportedPlatform()) {
    return;
  }

  try {
    await initAppsFlyer();
    await appsFlyer.logEvent(eventName, eventValues);
    logDevelopmentInfo(`event sent: ${eventName}`, eventValues);
  } catch (error) {
    logDevelopmentWarning(`event failed: ${eventName}`, error);
  }
};

const getAppsFlyerUid = () =>
  new Promise<string>((resolve, reject) => {
    appsFlyer.getAppsFlyerUID((error, uid) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(uid);
    });
  });

export async function initAppsFlyer(): Promise<void> {
  if (!isSupportedPlatform()) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    logDevelopmentInfo('initialization starting');

    await appsFlyer.initSdk({
      devKey: APPSFLYER_DEV_KEY,
      isDebug: __DEV__,
      appId: Platform.OS === 'ios' ? APPSFLYER_IOS_APP_ID : undefined,
      manualStart: true,
    });

    logDevelopmentInfo('initialization successful');

    try {
      appsFlyer.startSdk();
      logDevelopmentInfo('SDK started');
    } catch (error) {
      logDevelopmentWarning('SDK start failed', error);
      throw error;
    }

    try {
      const uid = await getAppsFlyerUid();
      logDevelopmentInfo(`UID: ${uid}`);
    } catch (error) {
      logDevelopmentWarning('UID retrieval failed', error);
    }
  })().catch((error) => {
    initPromise = null;
    logDevelopmentWarning('initialization failed', error);
    throw error;
  });

  return initPromise;
}

export const trackLogin = () =>
  logEvent('af_login', {
    af_login_method: 'otp',
  });

export const trackContentView = (event: ContentViewEvent) => {
  const values: AppsFlyerEventValues = {
    af_content_id: event.contentId,
    af_content_type: event.contentType,
    af_content: event.contentName,
  };

  if (event.category) {
    values.af_category = event.category;
  }

  return logEvent('af_content_view', values);
};

export const trackListView = (event: ListViewEvent) => {
  const values: AppsFlyerEventValues = {
    af_content_type: event.contentType,
    af_content_list: event.listName,
    item_count: event.itemCount,
  };

  if (event.categoryId) {
    values.af_category = event.categoryId;
  }

  return logEvent('af_list_view', values);
};

const getLatestMatchingTransaction = (customerInfo: CustomerInfo, productIdentifier: string) =>
  customerInfo.nonSubscriptionTransactions
    .filter((transaction) => transaction.productIdentifier === productIdentifier)
    .sort((left, right) => Date.parse(right.purchaseDate) - Date.parse(left.purchaseDate))[0];

const getPremiumEntitlement = (customerInfo: CustomerInfo) =>
  customerInfo.entitlements.active.premium_access ?? customerInfo.entitlements.all.premium_access;

const getPurchaseEventValues = (
  selectedPackage: PurchasesPackage,
  customerInfo: CustomerInfo,
): AppsFlyerEventValues => {
  const transaction = getLatestMatchingTransaction(customerInfo, selectedPackage.product.identifier);
  const entitlement = getPremiumEntitlement(customerInfo);
  const values: AppsFlyerEventValues = {
    af_revenue: selectedPackage.product.price,
    af_currency: selectedPackage.product.currencyCode,
    af_content_id: selectedPackage.product.identifier,
    af_content_type: 'premium_access',
    af_quantity: 1,
  };

  if (transaction?.transactionIdentifier) {
    values.af_order_id = transaction.transactionIdentifier;
  }

  if (transaction?.purchaseDate ?? entitlement?.latestPurchaseDate) {
    values.purchase_timestamp = transaction?.purchaseDate ?? entitlement?.latestPurchaseDate;
  }

  return values;
};

export const trackInitiatedCheckout = (selectedPackage: PurchasesPackage) =>
  logEvent('af_initiated_checkout', {
    af_revenue: selectedPackage.product.price,
    af_currency: selectedPackage.product.currencyCode,
    af_content_id: selectedPackage.product.identifier,
    af_content_type: 'premium_access',
    af_quantity: 1,
  });

export const trackPurchase = (selectedPackage: PurchasesPackage, customerInfo: CustomerInfo) => {
  const values = getPurchaseEventValues(selectedPackage, customerInfo);
  const transactionIdentifier = typeof values.af_order_id === 'string' ? values.af_order_id : null;

  if (transactionIdentifier) {
    if (trackedPurchaseTransactionIds.has(transactionIdentifier)) {
      logDevelopmentInfo('duplicate purchase event skipped', { transactionIdentifier });
      return Promise.resolve();
    }

    trackedPurchaseTransactionIds.add(transactionIdentifier);
  }

  return logEvent('af_purchase', values);
};

export const appsFlyerService = {
  initAppsFlyer,
  trackContentView,
  trackInitiatedCheckout,
  trackListView,
  trackLogin,
  trackPurchase,
};
