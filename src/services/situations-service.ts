import { apiClient, unwrap } from '@/lib/api-client';
import type { Situation } from '@/types';

const mapSituation = (item: Record<string, unknown>): Situation => ({
  id: String(item.id),
  title: String(item.title),
  category: String(item.category),
  shortLabel: String(item.shortLabel),
  featured: Boolean(item.featured),
  diagramVariant: String(item.diagramVariant || 'infield') as 'infield' | 'outfield',
  instructions: Array.isArray(item.instructions)
    ? item.instructions.map((instruction) => instruction as Situation['instructions'][number])
    : [],
  image: typeof item.image === 'string' ? item.image : '',
  imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
});

export const situationsService = {
  async getAll(): Promise<Situation[]> {
    const result = await unwrap<Situation[] | { items: Record<string, unknown>[] }>(
      apiClient.get('/situations'),
    );
    const items = Array.isArray(result) ? result : result.items;
    return items.map((item) => mapSituation(item as Record<string, unknown>));
  },
  async getById(id: string): Promise<Situation> {
    const result = await unwrap<Record<string, unknown>>(apiClient.get(`/situations/${id}`));
    return mapSituation(result);
  },
};
