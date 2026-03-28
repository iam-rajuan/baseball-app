import { drillCategories, drills } from '@/mock/data';
import { delay } from '@/utils/delay';

export const drillsService = {
  async getCategories() {
    await delay();
    return drillCategories;
  },
  async getCategory(id: string) {
    await delay();
    return drillCategories.find((item) => item.id === id) ?? null;
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
