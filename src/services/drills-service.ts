import { apiClient, unwrap } from '@/lib/api-client';
import type { Drill, DrillCategory } from '@/types';

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const unwrapItems = <T>(value: T[] | { items: T[] }) => (Array.isArray(value) ? value : value.items);

export const drillsService = {
  async getCategories(): Promise<DrillCategory[]> {
    const result = await unwrap<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
      apiClient.get('/drill-categories'),
    );
    const items = unwrapItems(result);

    return items.map((category) => ({
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
    }));
  },
  async getCategory(id: string): Promise<DrillCategory> {
    const category = await unwrap<Record<string, unknown>>(apiClient.get(`/drill-categories/${id}`));

    return {
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
    };
  },
  async getDrillsByCategoryId(categoryId: string): Promise<Drill[]> {
    const result = await unwrap<Record<string, unknown>[] | { items: Record<string, unknown>[] }>(
      apiClient.get(`/drills?categoryId=${categoryId}`),
    );
    const items = unwrapItems(result);

    return items.map((drill) => ({
      id: String(drill.id),
      name: String(drill.name),
      category: toStringValue(drill.categoryName),
      description: String(drill.description),
      steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
      equipment: Array.isArray(drill.equipment) ? drill.equipment.map(String) : [],
      focusPoints: Array.isArray(drill.focusPoints) ? drill.focusPoints.map(String) : [],
      accessLevel: String(drill.accessLevel) as 'free' | 'premium',
      image: toStringValue(drill.imageUrl || drill.coverPhotoUrl || drill.coverUrl || drill.cover),
      imageUrl: toStringValue(drill.imageUrl),
      coverUrl: toStringValue(drill.coverUrl),
      coverPhotoUrl: toStringValue(drill.coverPhotoUrl),
    }));
  },
  async getById(id: string): Promise<Drill> {
    const drill = await unwrap<Record<string, unknown>>(apiClient.get(`/drills/${id}`));

    return {
      id: String(drill.id),
      name: String(drill.name),
      category: toStringValue(drill.categoryName),
      description: String(drill.description),
      steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
      equipment: Array.isArray(drill.equipment) ? drill.equipment.map(String) : [],
      focusPoints: Array.isArray(drill.focusPoints) ? drill.focusPoints.map(String) : [],
      accessLevel: String(drill.accessLevel) as 'free' | 'premium',
      image: toStringValue(drill.imageUrl || drill.coverPhotoUrl || drill.coverUrl || drill.cover),
      imageUrl: toStringValue(drill.imageUrl),
      coverUrl: toStringValue(drill.coverUrl),
      coverPhotoUrl: toStringValue(drill.coverPhotoUrl),
    };
  },
};
