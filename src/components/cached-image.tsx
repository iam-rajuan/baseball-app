import { Image as ExpoImage } from 'expo-image';
import { useEffect, useState, type ComponentProps } from 'react';

import {
  cacheRemoteImage,
  getCachedImageUri,
  getKnownCachedImageUri,
  isRemoteImageUri,
} from '@/lib/image-cache';

type CachedImageProps = Omit<ComponentProps<typeof ExpoImage>, 'source'> & {
  uri: string;
};

export function CachedImage({ uri, ...props }: CachedImageProps) {
  const normalizedUri = uri.trim();
  const [displayUri, setDisplayUri] = useState(
    () => getKnownCachedImageUri(normalizedUri) ?? normalizedUri,
  );

  useEffect(() => {
    let isMounted = true;

    setDisplayUri(getKnownCachedImageUri(normalizedUri) ?? normalizedUri);

    if (!isRemoteImageUri(normalizedUri)) {
      return () => {
        isMounted = false;
      };
    }

    void (async () => {
      const cachedUri = await getCachedImageUri(normalizedUri);

      if (isMounted && cachedUri && cachedUri !== displayUri) {
        setDisplayUri(cachedUri);
      }

      const syncedUri = await cacheRemoteImage(normalizedUri);

      if (isMounted && syncedUri && syncedUri !== cachedUri) {
        setDisplayUri(syncedUri);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [displayUri, normalizedUri]);

  return <ExpoImage {...props} cachePolicy="memory-disk" source={{ uri: displayUri }} />;
}
