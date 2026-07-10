import { apiClient, resolveApiAssetUrl, unwrap, unwrapPaginated } from '@/lib/api-client';
import { readCachedValue, writeCachedValue } from '@/lib/offline-cache';
import type { PaginatedResult, Situation } from '@/types';

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

const fetchAllPages = async <T>(
  fetchPage: (page: number) => Promise<PaginatedResult<T>>,
) => {
  const firstPage = await fetchPage(1);
  const items = [...firstPage.items];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const nextPage = await fetchPage(page);
    items.push(...nextPage.items);
  }

  return items;
};

export const situationsService = {
  async getAll(): Promise<Situation[]> {
    try {
      const mappedItems = await fetchAllPages(async (page) => {
        const result = await unwrapPaginated<Record<string, unknown>>(
          apiClient.get('/situations', { params: { page, limit: 100 } }),
        );

        return {
          ...result,
          items: result.items.map((item) => mapSituation(item)),
        };
      });

      await writeCachedValue(cacheKeys.all, mappedItems);
      return mappedItems;
    } catch {
      const cached = await readCachedValue<Situation[]>(cacheKeys.all);
      return cached ?? [];
    }
  },
  async getById(id: string): Promise<Situation> {
    const result = await unwrap<Record<string, unknown>>(apiClient.get(`/situations/${id}`));
    return mapSituation(result);
  },
};
