import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Loader } from '@/components/loader';
import { Screen } from '@/components/layout/screen';
import { SituationArtwork } from '@/components/situation-artwork';
import { settingsService, situationsService } from '@/services';

export default function SituationsTabScreen() {
  const { data: situations, isLoading: situationsLoading } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });
  const { data: appSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });

  return (
    <Screen contentClassName="pt-4">
      <Text className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#A7957D]">Home</Text>
      <Text className="mt-2 text-[36px] font-bold uppercase leading-10 text-navy">
        Defensive{'\n'}Situations
      </Text>

      {situationsLoading || settingsLoading || !situations || !appSettings ? (
        <View className="mt-8">
          <Loader />
        </View>
      ) : (
        <View className="mt-5 gap-4">
          {situations.map((situation) => (
            <Pressable key={situation.id} onPress={() => router.push(`/situations/${situation.id}`)}>
              <Card>
                <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
                  {situation.category}
                </Text>
                <Text className="mt-2 text-2xl font-bold text-navy">{situation.title}</Text>
                <View className="mt-4">
                  <SituationArtwork
                    diagramVariant={situation.diagramVariant}
                    imageUri={appSettings.situationImageUri}
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
