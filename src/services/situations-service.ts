import { apiClient, resolveApiAssetUrl, unwrap } from '@/lib/api-client';
import { cachedOrMock, readCachedValue, writeCachedValue } from '@/lib/offline-cache';
import { situations as mockSituations } from '@/mock/data';
import type { Situation } from '@/types';
import { featuredSituationsCacheKey } from './featured-situations-service';

const cacheKeys = {
  all: 'situations:all',
};

const mapSituation = (item: Record<string, unknown>): Situation => ({
  id: String(item.id),
  title: String(item.title),
  category: String(item.category),
  shortLabel: String(item.shortLabel),
  featured: Boolean(item.featured),
  diagramVariant: String(item.diagramVariant || 'infield') as 'infield' | 'outfield',
  instructions: Array.isArray(item.instructions)
    ? item.instructions.map((instruction) => instruction as Situation['instructions'][number])
    : [],
  image: resolveApiAssetUrl(typeof item.image === 'string' ? item.image : ''),
  imageUrl: resolveApiAssetUrl(typeof item.imageUrl === 'string' ? item.imageUrl : ''),
});

export const situationsService = {
  async getAll(): Promise<Situation[]> {
    try {
      const result = await unwrap<Situation[] | { items: Record<string, unknown>[] }>(
        apiClient.get('/situations'),
      );
      const items = Array.isArray(result) ? result : result.items;
      const mappedItems = items.map((item) => mapSituation(item as Record<string, unknown>));

      await writeCachedValue(cacheKeys.all, mappedItems);
      return mappedItems;
    } catch {
      return cachedOrMock(cacheKeys.all, mockSituations);
    }
  },
  async getById(id: string): Promise<Situation> {
    try {
      const result = await unwrap<Record<string, unknown>>(apiClient.get(`/situations/${id}`));
      return mapSituation(result);
    } catch {
      const cachedItems = await readCachedValue<Situation[]>(cacheKeys.all);
      const cachedFeaturedItems = await readCachedValue<Situation[]>(featuredSituationsCacheKey);
      const fallbackItems = [...(cachedItems ?? []), ...(cachedFeaturedItems ?? []), ...mockSituations];
      const fallbackItem = fallbackItems.find((item) => item.id === id);

      if (fallbackItem) {
        return fallbackItem;
      }

      throw new Error('Situation not found offline');
    }
  },
};
