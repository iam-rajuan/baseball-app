import { apiClient, resolveApiAssetUrl, unwrap, unwrapPaginated } from '@/lib/api-client';
import { writeCachedValue } from '@/lib/offline-cache';
import type { Drill, DrillCategory, EquipmentItem, PaginatedResult } from '@/types';

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const mapFocusPoints = (value: unknown): Drill['focusPoints'] =>
  Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'string') return item;

          if (item && typeof item === 'object') {
            const point = item as Record<string, unknown>;
            return {
              title: toStringValue(point.title),
              description: toStringValue(point.description),
            };
          }

          return '';
        })
        .filter((item) => (typeof item === 'string' ? item.trim() : item.title || item.description))
    : [];

const cacheKeys = {
  categories: 'drills:v3:categories',
  categoryDrills: (categoryId: string) => `drills:v3:category:${categoryId}`,
};

const mapCategory = (category: Record<string, unknown>): DrillCategory => ({
  id: String(category.id),
  name: String(category.name),
  subtitle: String(category.subtitle),
  numberOfDrills: Number(category.numberOfDrills),
  image: resolveApiAssetUrl(toStringValue(category.image || category.imageUrl || category.coverPhotoUrl || category.coverUrl)),
  imageUrl: resolveApiAssetUrl(toStringValue(category.imageUrl)),
  coverUrl: resolveApiAssetUrl(toStringValue(category.coverUrl)),
  coverPhotoUrl: resolveApiAssetUrl(toStringValue(category.coverPhotoUrl)),
  iconUrl: resolveApiAssetUrl(toStringValue(category.iconUrl)),
  accessLevel: String(category.accessLevel) as 'free' | 'premium',
  accentIcon: toStringValue(category.accentIcon) || 'baseball-outline',
});

const mapEquipment = (items: unknown): EquipmentItem[] =>
  Array.isArray(items)
    ? items
        .map((item) => {
          if (typeof item === 'string') {
            return { name: item.trim(), link: null };
          }
          if (item && typeof item === 'object') {
            const eq = item as Record<string, unknown>;
            return {
              name: toStringValue(eq.name).trim(),
              link: toStringValue(eq.link).trim() || null,
            };
          }
          return { name: '', link: null };
        })
        .filter((item) => item.name)
    : [];

const mapDrill = (drill: Record<string, unknown>): Drill => ({
  id: String(drill.id),
  name: String(drill.name),
  categoryId: toStringValue(drill.categoryId),
  category: toStringValue(drill.categoryName || drill.category),
  description: String(drill.description),
  steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
  equipment: mapEquipment(drill.equipment),
  focusPoints: mapFocusPoints(drill.focusPoints),
  listIcon: toStringValue(drill.listIcon) || 'baseball-outline',
  accessLevel: String(drill.accessLevel) as 'free' | 'premium',
  image: resolveApiAssetUrl(toStringValue(drill.imageUrl || drill.coverPhotoUrl || drill.coverUrl || drill.cover)),
  youtubeUrl: toStringValue(drill.youtubeUrl) || null,
  imageUrl: resolveApiAssetUrl(toStringValue(drill.imageUrl)),
  coverUrl: resolveApiAssetUrl(toStringValue(drill.coverUrl)),
  coverPhotoUrl: resolveApiAssetUrl(toStringValue(drill.coverPhotoUrl)),
  createdAt: toStringValue(drill.createdAt),
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

export const drillsService = {
  async getCategories(): Promise<DrillCategory[]> {
    const mappedItems = await fetchAllPages(async (page) => {
      const result = await unwrapPaginated<Record<string, unknown>>(
        apiClient.get('/drill-categories', { params: { page, limit: 100 } }),
      );

      return {
        ...result,
        items: result.items.map((category) => mapCategory(category)),
      };
    });

    await writeCachedValue(cacheKeys.categories, mappedItems);
    return mappedItems;
  },
  async getCategory(id: string): Promise<DrillCategory> {
    const category = await unwrap<Record<string, unknown>>(apiClient.get(`/drill-categories/${id}`));
    return mapCategory(category);
  },
  async getDrillsByCategoryIdPage(
    categoryId: string,
    page = 1,
    limit = 25,
    accessLevel?: 'free' | 'premium',
  ): Promise<PaginatedResult<Drill>> {
    const result = await unwrapPaginated<Record<string, unknown>>(
      apiClient.get('/drills', { params: { categoryId, page, limit, accessLevel } }),
    );
    const mappedItems = result.items.map((drill) => mapDrill(drill));

    if (page === 1) {
      await writeCachedValue(cacheKeys.categoryDrills(categoryId), mappedItems);
    }

    return {
      items: mappedItems,
      pagination: result.pagination,
    };
  },
  async getDrillsByCategoryId(categoryId: string): Promise<Drill[]> {
    const mappedItems = await fetchAllPages((page) =>
      drillsService.getDrillsByCategoryIdPage(categoryId, page, 100),
    );

    await writeCachedValue(cacheKeys.categoryDrills(categoryId), mappedItems);
    return mappedItems;
  },
  async getDrillsByCategoryAndAccessLevel(
    categoryId: string,
    accessLevel: 'free' | 'premium',
  ): Promise<Drill[]> {
    const mappedItems = await fetchAllPages((page) =>
      drillsService.getDrillsByCategoryIdPage(categoryId, page, 100, accessLevel),
    );

    await writeCachedValue(cacheKeys.categoryDrills(`${categoryId}:${accessLevel}`), mappedItems);
    return mappedItems;
  },
  async getNewDrills(limit = 5): Promise<Drill[]> {
    const result = await unwrapPaginated<Record<string, unknown>>(
      apiClient.get('/drills', { params: { page: 1, limit } }),
    );

    return result.items.map((drill) => mapDrill(drill));
  },
  async getById(id: string): Promise<Drill> {
    const drill = await unwrap<Record<string, unknown>>(apiClient.get(`/drills/${id}`));
    return mapDrill(drill);
  },
};
