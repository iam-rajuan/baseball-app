import AsyncStorage from '@react-native-async-storage/async-storage';

const keyPrefix = 'mba-offline-cache';

type CacheEnvelope<T> = {
  savedAt: string;
  value: T;
};

const cacheKey = (key: string) => `${keyPrefix}:${key}`;

export async function readCachedValue<T>(key: string): Promise<T | null> {
  try {
    const rawValue = await AsyncStorage.getItem(cacheKey(key));

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as CacheEnvelope<T>;
    return parsedValue.value;
  } catch {
    return null;
  }
}

export async function writeCachedValue<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(
      cacheKey(key),
      JSON.stringify({
        savedAt: new Date().toISOString(),
        value,
      } satisfies CacheEnvelope<T>),
    );
  } catch {
    // Cache failures should never block the app from rendering live data.
  }
}

export async function cachedOrMock<T>(key: string, mockValue: T): Promise<T> {
  return (await readCachedValue<T>(key)) ?? mockValue;
}
