import type { Drill, DrillCategory, Situation } from '@/types';

import { queryClient } from '@/lib/query-client';
import { drillsService, situationsService } from '@/services';

const findDrillFromCache = (drillId: string): Drill | undefined => {
  const newDrills = queryClient.getQueryData<Drill[]>(['new-drills']);
  const drillFromNewList = newDrills?.find((item) => item.id === drillId);

  if (drillFromNewList) {
    return drillFromNewList;
  }

  const drillLists = queryClient.getQueriesData<Drill[]>({
    queryKey: ['drill-list'],
  });

  for (const [, drills] of drillLists) {
    const matchingDrill = drills?.find((item) => item.id === drillId);

    if (matchingDrill) {
      return matchingDrill;
    }
  }

  return undefined;
};

export const getSituationInitialData = (situationId: string): Situation | undefined =>
  queryClient.getQueryData<Situation[]>(['situations'])?.find((item) => item.id === situationId);

export const getDrillInitialData = (drillId: string): Drill | undefined =>
  findDrillFromCache(drillId);

export const getDrillCategoryInitialData = (
  categoryId: string,
): DrillCategory | undefined =>
  queryClient
    .getQueryData<DrillCategory[]>(['drill-categories'])
    ?.find((item) => item.id === categoryId);

export const prefetchSituation = (situationId: string) =>
  queryClient.prefetchQuery({
    queryKey: ['situation', situationId],
    queryFn: () => situationsService.getById(situationId),
  });

export const prefetchDrill = (drillId: string) =>
  queryClient.prefetchQuery({
    queryKey: ['drill', drillId],
    queryFn: () => drillsService.getById(drillId),
  });

export const prefetchDrillCategory = async (categoryId: string) => {
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['drill-category', categoryId],
      queryFn: () => drillsService.getCategory(categoryId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['drill-list', categoryId, 'free'],
      queryFn: () => drillsService.getDrillsByCategoryAndAccessLevel(categoryId, 'free'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['drill-list', categoryId, 'premium'],
      queryFn: () => drillsService.getDrillsByCategoryAndAccessLevel(categoryId, 'premium'),
    }),
  ]);
};
