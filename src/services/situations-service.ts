import { situations } from '@/mock/data';
import { delay } from '@/utils/delay';

export const situationsService = {
  async getAll() {
    await delay();
    return situations;
  },
  async getById(id: string) {
    await delay();
    return situations.find((item) => item.id === id) ?? null;
  },
};
