import { apiClient, unwrap } from '@/lib/api-client';
import { cachedOrMock, readCachedValue, writeCachedValue } from '@/lib/offline-cache';
import {
  drillCategories as mockDrillCategories,
  drills as mockDrills,
} from '@/mock/data';
import type { Drill, DrillCategory } from '@/types';

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const unwrapItems = <T>(value: T[] | { items: T[] }) => (Array.isArray(value) ? value : value.items);

const cacheKeys = {
  categories: 'drills:categories',
  categoryDrills: (categoryId: string) => `drills:category:${categoryId}`,
};

const mapCategory = (category: Record<string, unknown>): DrillCategory => ({
  id: String(category.id),
  name: String(category.name),
  subtitle: String(category.subtitle),
  numberOfDrills: Number(category.numberOfDrills),
  image: toStringValue(category.image || category.imageUrl || category.coverPhotoUrl || category.coverUrl),
  imageUrl: toStringValue(category.imageUrl),
  coverUrl: toStringValue(category.coverUrl),
  coverPhotoUrl: toStringValue(category.coverPhotoUrl),
  iconUrl: toStringValue(category.iconUrl),
  accessLevel: String(category.accessLevel) as 'free' | 'premium',
  accentIcon: String(category.accentIcon),
});

const mapDrill = (drill: Record<string, unknown>): Drill => ({
  id: String(drill.id),
  name: String(drill.name),
  category: toStringValue(drill.categoryName || drill.category),
  description: String(drill.description),
  steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
  equipment: Array.isArray(drill.equipment) ? drill.equipment.map(String) : [],
  focusPoints: Array.isArray(drill.focusPoints) ? drill.focusPoints.map(String) : [],
  accessLevel: String(drill.accessLevel) as 'free' | 'premium',
  image: toStringValue(drill.imageUrl || drill.coverPhotoUrl || drill.coverUrl || drill.cover),
  imageUrl: toStringValue(drill.imageUrl),
  coverUrl: toStringValue(drill.coverUrl),
  coverPhotoUrl: toStringValue(drill.coverPhotoUrl),
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
