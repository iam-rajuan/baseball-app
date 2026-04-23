import { apiClient, unwrap } from '@/lib/api-client';
import type { Drill, DrillCategory } from '@/types';

export const drillsService = {
  async getCategories(): Promise<DrillCategory[]> {
    const items = await unwrap<Record<string, unknown>[]>(apiClient.get('/drill-categories'));

    return items.map((category) => ({
      id: String(category.id),
      name: String(category.name),
      subtitle: String(category.subtitle),
      numberOfDrills: Number(category.numberOfDrills),
      image: String(category.image),
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
      image: String(category.image),
      accessLevel: String(category.accessLevel) as 'free' | 'premium',
      accentIcon: String(category.accentIcon),
    };
  },
  async getDrillsByCategoryId(categoryId: string): Promise<Drill[]> {
    const items = await unwrap<Record<string, unknown>[]>(
      apiClient.get(`/drills?categoryId=${categoryId}`),
    );

    return items.map((drill) => ({
      id: String(drill.id),
      name: String(drill.name),
      category: String(drill.categoryName),
      description: String(drill.description),
      steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
      equipment: Array.isArray(drill.equipment) ? drill.equipment.map(String) : [],
      focusPoints: Array.isArray(drill.focusPoints) ? drill.focusPoints.map(String) : [],
      accessLevel: String(drill.accessLevel) as 'free' | 'premium',
      image: String(drill.cover),
    }));
  },
  async getById(id: string): Promise<Drill> {
    const drill = await unwrap<Record<string, unknown>>(apiClient.get(`/drills/${id}`));

    return {
      id: String(drill.id),
      name: String(drill.name),
      category: String(drill.category),
      description: String(drill.description),
      steps: Array.isArray(drill.steps) ? drill.steps.map(String) : [],
      equipment: Array.isArray(drill.equipment) ? drill.equipment.map(String) : [],
      focusPoints: Array.isArray(drill.focusPoints) ? drill.focusPoints.map(String) : [],
      accessLevel: String(drill.accessLevel) as 'free' | 'premium',
      image: String(drill.cover),
    };
  },
};
