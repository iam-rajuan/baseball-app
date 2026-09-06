import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';

const APPSFLYER_DEV_KEY = 'amqLPNxWYP5cWoZrDe2KcX';
const APPSFLYER_IOS_APP_ID = '6784838370';
const LOG_PREFIX = '[AppsFlyer]';

let initPromise: Promise<void> | null = null;

const isSupportedPlatform = () => Platform.OS === 'ios' || Platform.OS === 'android';

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

export const appsFlyerService = {
  initAppsFlyer,
};
