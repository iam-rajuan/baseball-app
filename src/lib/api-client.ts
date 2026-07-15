import axios, { isAxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useAppStore } from '@/store/app-store';

const env = {
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_API_BASE_URL_CANDIDATES:
    process.env.EXPO_PUBLIC_API_BASE_URL_CANDIDATES,
} as const;

const getRequiredEnv = (key: keyof typeof env) => {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const debuggerHost = (Constants as unknown as { expoGoConfig?: { debuggerHost?: string } }).expoGoConfig?.debuggerHost;
const expoHost = debuggerHost ? debuggerHost.split(':')[0]?.trim() || undefined : undefined;

const resolveDevelopmentHostUrl = (value: string) => {
  if (!__DEV__) {
    return trimTrailingSlash(value);
  }

  try {
    const url = new URL(value);
    const isLoopbackHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    if (!isLoopbackHost) {
      return trimTrailingSlash(url.toString());
    }

    if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
      url.hostname = expoHost;
      return trimTrailingSlash(url.toString());
    }

    if (Platform.OS === 'android') {
      url.hostname = '10.0.2.2';
      return trimTrailingSlash(url.toString());
    }

    return trimTrailingSlash(url.toString());
  } catch {
    return trimTrailingSlash(value);
  }
};

const configuredApiBaseUrl = resolveDevelopmentHostUrl(
  getRequiredEnv('EXPO_PUBLIC_API_BASE_URL'),
);

const unique = <T>(items: T[]) => Array.from(new Set(items));
const splitCsv = (value?: string) =>
  value
    ?.split(',')
    .map((item) => resolveDevelopmentHostUrl(item.trim()))
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
    ...splitCsv(env.EXPO_PUBLIC_API_BASE_URL_CANDIDATES),
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
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('mba-auth-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    useAppStore.getState().markServerUp();
    return response;
  },
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

    if (isNetworkFailure) {
      useAppStore.getState().markServerDown();
    }

    return Promise.reject(new Error(message));
  },
);

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: Pagination;
  } | null;
  pagination?: Pagination;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: Pagination;
};

export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export async function unwrapPaginated<T>(
  promise: Promise<{ data: ApiEnvelope<T[]> }>,
): Promise<PaginatedResult<T>> {
  const response = await promise;

  return {
    items: response.data.data,
    pagination: response.data.pagination ??
      response.data.meta?.pagination ?? {
        page: 1,
        limit: response.data.data.length,
        total: response.data.data.length,
        totalPages: 1,
      },
  };
}

export const isRecoverableApiError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes('network error') ||
    message.includes('timeout') ||
    message.includes('network request failed') ||
    message.includes('failed to fetch')
  );
};
