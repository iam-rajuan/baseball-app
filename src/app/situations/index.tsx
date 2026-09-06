import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { SituationArtwork } from '@/components/situation-artwork';
import { getActiveApiBaseUrl, isRecoverableApiError } from '@/lib/api-client';
import { prefetchSituation } from '@/lib/prefetch';
import { settingsService, situationsService, trackListView } from '@/services';

export default function SituationsListScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });
  const { data: appSettings, error: settingsError } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });
  const trackedListViewRef = useRef(false);

  useEffect(() => {
    if (!data || trackedListViewRef.current) {
      return;
    }

    trackedListViewRef.current = true;
    void trackListView({
      contentType: 'situation_list',
      itemCount: data.length,
      listName: 'Defensive Situations',
    });
  }, [data]);

  return (
    <Screen header={<PageHeader title="Defensive Situations" />} contentClassName="pt-5">
      {isLoading || (!data && isRecoverableApiError(error)) ? (
        <SkeletonLoader />
      ) : error || settingsError || !data ? (
        <EmptyState
          title="Could not load situations"
          description={`${error?.message ?? settingsError?.message ?? 'Request failed'}\nAPI: ${getActiveApiBaseUrl()}`}
        />
      ) : (
        <View className="gap-4">
          {data.map((situation) => (
            <Pressable key={situation.id} onPressIn={() => {
              void prefetchSituation(situation.id);
            }} onPress={() => router.push(`/situations/${situation.id}`)}>
              <Card>
                <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
                  {situation.category}
                </Text>
                <Text className="mt-2 text-2xl font-bold text-navy">{situation.title}</Text>
                <View className="mt-4">
                  <SituationArtwork
                    diagramVariant={situation.diagramVariant}
                    imageUri={appSettings?.situationImageUri}
                  />
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
