import { drillCategories, drills } from '@/mock/data';
import { delay } from '@/utils/delay';

export const drillsService = {
  async getCategories() {
    await delay();
    return drillCategories.map((category) => ({
      ...category,
      numberOfDrills: drills.filter(
        (drill) => drill.category.toLowerCase() === category.name.toLowerCase(),
      ).length,
    }));
  },
  async getCategory(id: string) {
    await delay();
    const category = drillCategories.find((item) => item.id === id) ?? null;
    if (!category) return null;

    return {
      ...category,
      numberOfDrills: drills.filter(
        (drill) => drill.category.toLowerCase() === category.name.toLowerCase(),
      ).length,
    };
  },
  async getDrillsByCategory(category: string) {
    await delay();
    return drills.filter((drill) => drill.category.toLowerCase() === category.toLowerCase());
  },
  async getById(id: string) {
    await delay();
    return drills.find((item) => item.id === id) ?? null;
  },
};
