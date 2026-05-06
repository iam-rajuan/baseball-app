import axios, { isAxiosError } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const getRequiredEnv = (key: string) => {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const configuredApiBaseUrl = trimTrailingSlash(
  getRequiredEnv('EXPO_PUBLIC_API_BASE_URL'),
);

const unique = <T>(items: T[]) => Array.from(new Set(items));
const splitCsv = (value?: string) =>
  value
    ?.split(',')
    .map((item) => trimTrailingSlash(item.trim()))
    .filter(Boolean) ?? [];

const getAndroidEmulatorHostUrl = (value: string) => {
  if (Platform.OS !== 'android' || !__DEV__) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      url.hostname = '10.0.2.2';
      return trimTrailingSlash(url.toString());
    }
  } catch {
    return null;
  }

  return null;
};

const buildApiBaseUrlCandidates = () => {
  return unique([
    configuredApiBaseUrl,
    getAndroidEmulatorHostUrl(configuredApiBaseUrl),
    ...splitCsv(process.env.EXPO_PUBLIC_API_BASE_URL_CANDIDATES),
  ].filter(Boolean) as string[]);
};

const apiBaseUrlCandidates = buildApiBaseUrlCandidates();
let activeApiBaseUrl = apiBaseUrlCandidates[0];

export const getActiveApiBaseUrl = () => activeApiBaseUrl;

export const resolveApiAssetUrl = (value?: string | null) => {
  const url = value?.trim();

  if (!url || !__DEV__) {
    return url ?? '';
  }

  try {
    const assetUrl = new URL(url);
    const configuredUrl = new URL(configuredApiBaseUrl);
    const activeUrl = new URL(activeApiBaseUrl);

    if (assetUrl.host === configuredUrl.host) {
      assetUrl.protocol = activeUrl.protocol;
      assetUrl.host = activeUrl.host;
    }

    return assetUrl.toString();
  } catch {
    return url;
  }
};

export const apiClient = axios.create({
  baseURL: activeApiBaseUrl,
  timeout: 6000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('mba-auth-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    const isNetworkFailure = !error.response;

    if (__DEV__ && isNetworkFailure && originalConfig && !originalConfig.__apiBaseRetry) {
      originalConfig.__apiBaseRetry = true;

      for (const candidate of apiBaseUrlCandidates) {
        if (candidate === originalConfig.baseURL) {
          continue;
        }

        try {
          activeApiBaseUrl = candidate;
          apiClient.defaults.baseURL = candidate;
          originalConfig.baseURL = candidate;
          return await apiClient.request(originalConfig);
        } catch (candidateError) {
          if (
            !isAxiosError(candidateError) ||
            candidateError.response ||
            candidateError.response
          ) {
            return Promise.reject(candidateError);
          }
        }
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Request failed';

    return Promise.reject(new Error(message));
  },
);

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}
