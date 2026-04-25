import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { SituationArtwork } from '@/components/situation-artwork';
import { settingsService, situationsService } from '@/services';

export default function SituationsListScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });
  const { data: appSettings, error: settingsError } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });

  return (
    <Screen header={<PageHeader title="Defensive Situations" />} contentClassName="pt-5">
      {isLoading ? (
        <Loader />
      ) : error || settingsError || !data ? (
        <EmptyState
          title="Could not load situations"
          description={`${error?.message ?? settingsError?.message ?? 'Request failed'}\nAPI: ${process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1'}`}
        />
      ) : (
        <View className="gap-4">
          {data.map((situation) => (
            <Pressable key={situation.id} onPress={() => router.push(`/situations/${situation.id}`)}>
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
