import { apiClient, resolveApiAssetUrl, unwrap } from '@/lib/api-client';
import { cachedOrMock, writeCachedValue } from '@/lib/offline-cache';
import { situations as mockSituations } from '@/mock/data';
import type { Situation } from '@/types';

export const featuredSituationsCacheKey = 'situations:featured:v2';

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');

const mapFeaturedSituation = (item: Record<string, unknown>): Situation | null => {
  const title = toStringValue(item.title);

  if (!title) {
    return null;
  }

  return {
    id: toStringValue(item.id),
    title,
    category: toStringValue(item.category || 'Featured Situation'),
    shortLabel: toStringValue(item.shortLabel || title.slice(0, 2).toUpperCase()),
    featured: true,
    diagramVariant: String(item.diagramVariant || 'infield') as 'infield' | 'outfield',
    instructions: Array.isArray(item.instructions)
      ? item.instructions.map((instruction) => instruction as Situation['instructions'][number])
      : [],
    image: resolveApiAssetUrl(toStringValue(item.image || item.imageUrl)),
    imageUrl: resolveApiAssetUrl(toStringValue(item.imageUrl || item.image)),
  };
};

const mockFeaturedSituations = mockSituations.filter((item) => item.featured);

export const featuredSituationsService = {
  async getAll(): Promise<Situation[]> {
    try {
      const result = await unwrap<Record<string, unknown>[]>(
        apiClient.get('/featured-situations'),
      );
      const mappedItems = result
        .map((item) => mapFeaturedSituation(item))
        .filter((item): item is Situation => Boolean(item));

      if (!mappedItems.length) {
        return cachedOrMock(featuredSituationsCacheKey, mockFeaturedSituations);
      }

      await writeCachedValue(featuredSituationsCacheKey, mappedItems);
      return mappedItems;
    } catch {
      return cachedOrMock(featuredSituationsCacheKey, mockFeaturedSituations);
    }
  },
};
