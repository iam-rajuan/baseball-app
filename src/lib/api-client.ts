import axios, { isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const configuredApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1';

const unique = <T>(items: T[]) => Array.from(new Set(items));

const buildApiBaseUrlCandidates = () => {
  const candidates = [configuredApiBaseUrl];

  if (__DEV__ && Platform.OS === 'android') {
    candidates.push(
      // Physical device with `adb reverse tcp:5000 tcp:5000`.
      'http://127.0.0.1:5000/api/v1',
      // Android emulator host machine alias.
      'http://10.0.2.2:5000/api/v1',
    );
  }

  return unique(candidates);
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
