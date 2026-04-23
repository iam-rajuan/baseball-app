import { apiClient, unwrap } from '@/lib/api-client';
import type { Situation } from '@/types';

export const situationsService = {
  async getAll(): Promise<Situation[]> {
    return unwrap<Situation[]>(apiClient.get('/situations'));
  },
  async getById(id: string): Promise<Situation> {
    return unwrap<Situation>(apiClient.get(`/situations/${id}`));
  },
};
