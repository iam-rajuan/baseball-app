import { apiClient, resolveApiAssetUrl, unwrap } from '@/lib/api-client';
import { cachedOrMock, readCachedValue, writeCachedValue } from '@/lib/offline-cache';
import {
  drillCategories as mockDrillCategories,
  drills as mockDrills,
} from '@/mock/data';
import type { Drill, DrillCategory } from '@/types';

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const unwrapItems = <T>(value: T[] | { items: T[] }) => (Array.isArray(value) ? value : value.items);
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
  categories: 'drills:v2:categories',
  categoryDrills: (categoryId: string) => `drills:v2:category:${categoryId}`,
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

const mapDrill = (drill: Record<string, unknown>): Drill => ({
  id: String(drill.id),
  name: String(drill.name),
  category: toStringValue(drill.categoryName || drill.category),
  description: String(drill.description),
  steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
  equipment: Array.isArray(drill.equipment) ? drill.equipment.map(String) : [],
  focusPoints: mapFocusPoints(drill.focusPoints),
  listIcon: toStringValue(drill.listIcon) || 'baseball-outline',
  accessLevel: String(drill.accessLevel) as 'free' | 'premium',
  image: resolveApiAssetUrl(toStringValue(drill.imageUrl || drill.coverPhotoUrl || drill.coverUrl || drill.cover)),
  imageUrl: resolveApiAssetUrl(toStringValue(drill.imageUrl)),
  coverUrl: resolveApiAssetUrl(toStringValue(drill.coverUrl)),
  coverPhotoUrl: resolveApiAssetUrl(toStringValue(drill.coverPhotoUrl)),
});

const getMockDrillsByCategoryId = (categoryId: string) => {
  const category = mockDrillCategories.find((item) => item.id === categoryId);

  if (!category) {
    return mockDrills;
  }

  return mockDrills.filter((drill) => drill.category === category.name);
};

const readCachedCategoryDrills = async () => {
  const categories = await readCachedValue<DrillCategory[]>(cacheKeys.categories);
  const drillGroups = await Promise.all(
    (categories ?? mockDrillCategories).map((category) =>
      readCachedValue<Drill[]>(cacheKeys.categoryDrills(category.id)),
    ),
  );

  return drillGroups.flatMap((items) => items ?? []);
};

export const drillsService = {
  async getCategories(): Promise<DrillCategory[]> {
    try {
      const result = await unwrap<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        apiClient.get('/drill-categories'),
      );
      const items = unwrapItems(result);
      const mappedItems = items.map((category) => mapCategory(category));

      await writeCachedValue(cacheKeys.categories, mappedItems);
      return mappedItems;
    } catch {
      return cachedOrMock(cacheKeys.categories, mockDrillCategories);
    }
  },
  async getCategory(id: string): Promise<DrillCategory> {
    try {
      const category = await unwrap<Record<string, unknown>>(apiClient.get(`/drill-categories/${id}`));
      return mapCategory(category);
    } catch {
      const cachedCategories = await readCachedValue<DrillCategory[]>(cacheKeys.categories);
      const fallbackCategories = cachedCategories ?? mockDrillCategories;
      const fallbackCategory = fallbackCategories.find((category) => category.id === id);

      if (fallbackCategory) {
        return fallbackCategory;
      }

      throw new Error('Drill category not found offline');
    }
  },
  async getDrillsByCategoryId(categoryId: string): Promise<Drill[]> {
    try {
      const result = await unwrap<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
        apiClient.get(`/drills?categoryId=${categoryId}`),
      );
      const items = unwrapItems(result);
      const mappedItems = items.map((drill) => mapDrill(drill));

      await writeCachedValue(cacheKeys.categoryDrills(categoryId), mappedItems);
      return mappedItems;
    } catch {
      return cachedOrMock(cacheKeys.categoryDrills(categoryId), getMockDrillsByCategoryId(categoryId));
    }
  },
  async getById(id: string): Promise<Drill> {
    try {
      const drill = await unwrap<Record<string, unknown>>(apiClient.get(`/drills/${id}`));
      return mapDrill(drill);
    } catch {
      const cachedDrills = await readCachedCategoryDrills();
      const fallbackDrill = [...cachedDrills, ...mockDrills].find((drill) => drill.id === id);

      if (fallbackDrill) {
        return fallbackDrill;
      }

      throw new Error('Drill not found offline');
    }
  },
};
