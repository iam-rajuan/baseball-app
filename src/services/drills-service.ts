import { apiClient, resolveApiAssetUrl, unwrap, unwrapPaginated } from '@/lib/api-client';
import { getCachedImageUri, warmRemoteImages } from '@/lib/image-cache';
import { cachedOrMock, readCachedValue, writeCachedValue } from '@/lib/offline-cache';
import { drillCategories as mockDrillCategories, drills as mockDrills } from '@/mock/data';
import type { Drill, DrillCategory, EquipmentItem, PaginatedResult } from '@/types';

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const normalizeCategoryValue = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
  category: (categoryId: string) => `drills:v3:category-detail:${categoryId}`,
  categoryDrills: (categoryId: string) => `drills:v3:category:${categoryId}`,
  detail: (drillId: string) => `drills:v3:detail:${drillId}`,
  newDrills: (limit: number) => `drills:v3:new:${limit}`,
};

const getMockDrillsForCategory = (categoryId: string) =>
  mockDrills.filter((item) => {
    const itemCategoryId = item.categoryId?.trim();

    if (itemCategoryId) {
      return itemCategoryId === categoryId;
    }

    return normalizeCategoryValue(item.category) === categoryId;
  });

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

const withCachedCategoryImages = async (items: DrillCategory[]) =>
  Promise.all(
    items.map(async (item) => ({
      ...item,
      image: await getCachedImageUri(item.image),
      imageUrl: await getCachedImageUri(item.imageUrl),
      coverUrl: await getCachedImageUri(item.coverUrl),
      coverPhotoUrl: await getCachedImageUri(item.coverPhotoUrl),
      iconUrl: await getCachedImageUri(item.iconUrl),
    })),
  );

const withCachedDrillImages = async (items: Drill[]) =>
  Promise.all(
    items.map(async (item) => ({
      ...item,
      image: await getCachedImageUri(item.image),
      imageUrl: await getCachedImageUri(item.imageUrl),
      coverUrl: await getCachedImageUri(item.coverUrl),
      coverPhotoUrl: await getCachedImageUri(item.coverPhotoUrl),
    })),
  );

const warmCategoryImages = (items: DrillCategory[], options?: { forceRefresh?: boolean }) =>
  warmRemoteImages(
    items.flatMap((item) => [
      item.image,
      item.imageUrl,
      item.coverUrl,
      item.coverPhotoUrl,
      item.iconUrl,
    ]),
    options,
  );

const warmDrillImages = (items: Drill[], options?: { forceRefresh?: boolean }) =>
  warmRemoteImages(
    items.flatMap((item) => [item.image, item.imageUrl, item.coverUrl, item.coverPhotoUrl]),
    options,
  );

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
    try {
      const mappedItems = await fetchAllPages(async (page) => {
        const result = await unwrapPaginated<Record<string, unknown>>(
          apiClient.get('/drill-categories', { params: { page, limit: 100 } }),
        );

        return {
          ...result,
          items: result.items.map((category) => mapCategory(category)),
        };
      });

      const cachedItems = await withCachedCategoryImages(mappedItems);
      await writeCachedValue(cacheKeys.categories, cachedItems);
      void warmCategoryImages(mappedItems, { forceRefresh: true }).then(async () => {
        const hydratedItems = await withCachedCategoryImages(mappedItems);
        await writeCachedValue(cacheKeys.categories, hydratedItems);
      });
      return cachedItems;
    } catch {
      return cachedOrMock(cacheKeys.categories, mockDrillCategories);
    }
  },
  async getCategory(id: string): Promise<DrillCategory> {
    try {
      const category = await unwrap<Record<string, unknown>>(apiClient.get(`/drill-categories/${id}`));
      const mappedCategory = mapCategory(category);
      const [cachedCategory] = await withCachedCategoryImages([mappedCategory]);
      await writeCachedValue(cacheKeys.category(id), cachedCategory);
      void warmCategoryImages([mappedCategory], { forceRefresh: true }).then(async () => {
        const [hydratedCategory] = await withCachedCategoryImages([mappedCategory]);
        await writeCachedValue(cacheKeys.category(id), hydratedCategory);
      });
      return cachedCategory;
    } catch {
      const cachedCategory = await readCachedValue<DrillCategory>(cacheKeys.category(id));

      if (cachedCategory) {
        return cachedCategory;
      }

      const cached = await cachedOrMock(cacheKeys.categories, mockDrillCategories);
      const fallbackCategory = cached.find((item) => item.id === id);

      if (fallbackCategory) {
        return fallbackCategory;
      }

      throw new Error('Drill category not found');
    }
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
    try {
      const mappedItems = await fetchAllPages((page) =>
        drillsService.getDrillsByCategoryIdPage(categoryId, page, 100),
      );

      const cachedItems = await withCachedDrillImages(mappedItems);
      await writeCachedValue(cacheKeys.categoryDrills(categoryId), cachedItems);
      void warmDrillImages(mappedItems, { forceRefresh: true }).then(async () => {
        const hydratedItems = await withCachedDrillImages(mappedItems);
        await writeCachedValue(cacheKeys.categoryDrills(categoryId), hydratedItems);
      });
      return cachedItems;
    } catch {
      return cachedOrMock(
        cacheKeys.categoryDrills(categoryId),
        getMockDrillsForCategory(categoryId),
      );
    }
  },
  async getDrillsByCategoryAndAccessLevel(
    categoryId: string,
    accessLevel: 'free' | 'premium',
  ): Promise<Drill[]> {
    try {
      const mappedItems = await fetchAllPages((page) =>
        drillsService.getDrillsByCategoryIdPage(categoryId, page, 100, accessLevel),
      );

      const cachedItems = await withCachedDrillImages(mappedItems);
      await writeCachedValue(cacheKeys.categoryDrills(`${categoryId}:${accessLevel}`), cachedItems);
      void warmDrillImages(mappedItems, { forceRefresh: true }).then(async () => {
        const hydratedItems = await withCachedDrillImages(mappedItems);
        await writeCachedValue(cacheKeys.categoryDrills(`${categoryId}:${accessLevel}`), hydratedItems);
      });
      return cachedItems;
    } catch {
      return cachedOrMock(
        cacheKeys.categoryDrills(`${categoryId}:${accessLevel}`),
        getMockDrillsForCategory(categoryId).filter((item) => item.accessLevel === accessLevel),
      );
    }
  },
  async getNewDrills(limit = 5): Promise<Drill[]> {
    try {
      const result = await unwrapPaginated<Record<string, unknown>>(
        apiClient.get('/drills', { params: { page: 1, limit } }),
      );

      const mappedItems = result.items.map((drill) => mapDrill(drill));
      const cachedItems = await withCachedDrillImages(mappedItems);
      await writeCachedValue(cacheKeys.newDrills(limit), cachedItems);
      void warmDrillImages(mappedItems, { forceRefresh: true }).then(async () => {
        const hydratedItems = await withCachedDrillImages(mappedItems);
        await writeCachedValue(cacheKeys.newDrills(limit), hydratedItems);
      });
      return cachedItems;
    } catch {
      return cachedOrMock(cacheKeys.newDrills(limit), mockDrills.slice(0, limit));
    }
  },
  async getById(id: string): Promise<Drill> {
    try {
      const drill = await unwrap<Record<string, unknown>>(apiClient.get(`/drills/${id}`));
      const mappedDrill = mapDrill(drill);
      const [cachedDrill] = await withCachedDrillImages([mappedDrill]);
      await writeCachedValue(cacheKeys.detail(id), cachedDrill);
      void warmDrillImages([mappedDrill], { forceRefresh: true }).then(async () => {
        const [hydratedDrill] = await withCachedDrillImages([mappedDrill]);
        await writeCachedValue(cacheKeys.detail(id), hydratedDrill);
      });
      return cachedDrill;
    } catch {
      const cachedDetail = await readCachedValue<Drill>(cacheKeys.detail(id));

      if (cachedDetail) {
        return cachedDetail;
      }

      const fallbackDrill = mockDrills.find((item) => item.id === id);

      if (fallbackDrill) {
        return fallbackDrill;
      }

      throw new Error('Drill not found');
    }
  },
};
