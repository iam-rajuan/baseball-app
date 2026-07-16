import { Directory, File, Paths } from 'expo-file-system';

const imageCacheDirectory = new Directory(Paths.cache, 'mba-images');
const resolvedImageUriCache = new Map<string, string>();
const pendingImageDownloads = new Map<string, Promise<string>>();

const ensureImageCacheDirectory = () => {
  if (!imageCacheDirectory.exists) {
    imageCacheDirectory.create({ idempotent: true, intermediates: true });
  }
};

const hashValue = (value: string) => {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  }

  return Math.abs(hash).toString(36);
};

const getExtension = (value: string) => {
  try {
    const url = new URL(value);
    const extension = url.pathname.split('.').pop()?.trim().toLowerCase();

    if (extension && /^[a-z0-9]{2,5}$/.test(extension)) {
      return extension;
    }
  } catch {
    // Ignore malformed urls and fall back to a generic extension.
  }

  return 'img';
};

const getCachedImageFile = (uri: string) =>
  new File(imageCacheDirectory, `${hashValue(uri)}.${getExtension(uri)}`);

export const isRemoteImageUri = (uri?: string | null) => /^https?:\/\//i.test(uri?.trim() ?? '');
export const getKnownCachedImageUri = (uri?: string | null) =>
  resolvedImageUriCache.get(uri?.trim() ?? '') ?? null;

export async function clearRemoteImage(uri?: string | null): Promise<void> {
  const normalizedUri = uri?.trim() ?? '';

  if (!isRemoteImageUri(normalizedUri)) {
    return;
  }

  resolvedImageUriCache.delete(normalizedUri);
  pendingImageDownloads.delete(normalizedUri);

  try {
    ensureImageCacheDirectory();
    const file = getCachedImageFile(normalizedUri);

    if (file.exists) {
      file.delete();
    }
  } catch {
    // Ignore cache-clear failures so refresh can still continue.
  }
}

export async function clearRemoteImages(
  uris: (string | null | undefined)[],
): Promise<void> {
  const uniqueUris = Array.from(
    new Set(uris.map((uri) => uri?.trim() ?? '').filter((uri) => isRemoteImageUri(uri))),
  );

  await Promise.allSettled(uniqueUris.map((uri) => clearRemoteImage(uri)));
}

export async function getCachedImageUri(uri?: string | null): Promise<string> {
  const normalizedUri = uri?.trim() ?? '';

  if (!isRemoteImageUri(normalizedUri)) {
    return normalizedUri;
  }

  const memoizedUri = resolvedImageUriCache.get(normalizedUri);

  if (memoizedUri) {
    return memoizedUri;
  }

  try {
    ensureImageCacheDirectory();
    const file = getCachedImageFile(normalizedUri);

    if (file.exists) {
      // If the cached file is empty or corrupted (e.g. text/HTML error content), delete it
      if (file.size < 1024) {
        try {
          file.delete();
        } catch {
          // Ignore delete failures
        }
        resolvedImageUriCache.set(normalizedUri, normalizedUri);
        return normalizedUri;
      }
      resolvedImageUriCache.set(normalizedUri, file.uri);
      return file.uri;
    }
    resolvedImageUriCache.set(normalizedUri, normalizedUri);
    return normalizedUri;
  } catch {
    return normalizedUri;
  }
}

export async function cacheRemoteImage(
  uri?: string | null,
  options?: { forceRefresh?: boolean },
): Promise<string> {
  const normalizedUri = uri?.trim() ?? '';

  if (!isRemoteImageUri(normalizedUri)) {
    return normalizedUri;
  }

  const pendingDownload = pendingImageDownloads.get(normalizedUri);

  if (pendingDownload) {
    return pendingDownload;
  }

  try {
    const downloadPromise = (async () => {
      ensureImageCacheDirectory();
      const file = getCachedImageFile(normalizedUri);

      if (file.exists && !options?.forceRefresh) {
        if (file.size < 1024) {
          try {
            file.delete();
          } catch {
            // Ignore delete failures
          }
        } else {
          resolvedImageUriCache.set(normalizedUri, file.uri);
          return file.uri;
        }
      }

      await File.downloadFileAsync(normalizedUri, file, { idempotent: true });

      // Validate the downloaded file size immediately
      if (file.exists && file.size < 1024) {
        try {
          file.delete();
        } catch {
          // Ignore delete failures
        }
        resolvedImageUriCache.set(normalizedUri, normalizedUri);
        return normalizedUri;
      }

      resolvedImageUriCache.set(normalizedUri, file.uri);
      return file.uri;
    })();

    pendingImageDownloads.set(normalizedUri, downloadPromise);

    return await downloadPromise;
  } catch {
    return getCachedImageUri(normalizedUri);
  } finally {
    pendingImageDownloads.delete(normalizedUri);
  }
}

export async function warmRemoteImages(
  uris: (string | null | undefined)[],
  options?: { forceRefresh?: boolean },
): Promise<void> {
  const uniqueUris = Array.from(
    new Set(uris.map((uri) => uri?.trim() ?? '').filter((uri) => isRemoteImageUri(uri))),
  );

  await Promise.allSettled(uniqueUris.map((uri) => cacheRemoteImage(uri, options)));
}
