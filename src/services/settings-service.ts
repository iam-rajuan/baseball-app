import { legalPages } from '@/mock/data';
import { delay } from '@/utils/delay';

export const settingsService = {
  async getLegalPages() {
    await delay();
    return legalPages;
  },
};
