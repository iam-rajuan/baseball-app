import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Loader } from '@/components/loader';
import { Screen } from '@/components/layout/screen';
import { SituationArtwork } from '@/components/situation-artwork';
import { settingsService, situationsService } from '@/services';

export default function HomeScreen() {
  const { data: situations, isLoading: situationsLoading } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });
  const { data: appSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });

  if (situationsLoading || settingsLoading || !situations || !appSettings) {
    return (
      <Screen>
        <Loader />
      </Screen>
    );
  }

  const featuredSituations = situations.filter((item) => item.featured);
  const sliderItems = featuredSituations.length ? featuredSituations : situations;
  const specificSituation = situations.find((item) => !item.featured) ?? situations[0];
  const bulletItems = specificSituation.instructions.slice(0, 5);

  return (
    <Screen contentClassName="px-0 pb-28 pt-0">
      <View className="border-b border-[#EFE4D5] bg-white px-5 pb-3 pt-2">
        <Text className="text-[10px] font-semibold uppercase tracking-[1.1px] text-[#302823]">
          Marietta
        </Text>
        <Text className="-mt-0.5 text-[9px] uppercase tracking-[0.8px] text-[#302823]">
          Baseball Academy
        </Text>
      </View>

      <View className="px-4 pt-3">
        <View className="rounded-[28px] border border-[#E7D9C6] bg-[#FCF6EC] px-4 pb-6 pt-4">
          <Text className="text-center text-[10px] uppercase tracking-[1.2px] text-[#6E645A]">
            {appSettings.homeEyebrow}
          </Text>
          <Text
            className="mt-3 text-center text-[31px] font-bold uppercase leading-[33px] text-[#17120F]"
            style={{ fontFamily: 'Georgia' }}
          >
            {appSettings.homeTitle}
          </Text>
          <View className="mt-4 items-center">
            <View className="h-14 w-14 items-center justify-center rounded-full border border-[#E7D9C6] bg-[#F7EDE0]">
              <Ionicons color="#23201D" name="baseball-outline" size={24} />
            </View>
            <Text className="mt-1 text-[10px] font-semibold uppercase tracking-[1.3px] text-[#2E2925]">
              Baseball
            </Text>
          </View>

          <Pressable
            className="mt-4 rounded-full bg-[#EF7D31] px-5 py-3"
            onPress={() => router.push('/(tabs)/situations')}
          >
            <Text className="text-center text-[11px] font-bold uppercase tracking-[0.9px] text-white">
              {appSettings.homePrimaryCta}
            </Text>
          </Pressable>

          <Pressable
            className="mt-3 rounded-full bg-[#F3A46E] px-5 py-3"
            onPress={() => router.push(`/situations/${specificSituation.id}`)}
          >
            <Text className="text-center text-[11px] font-bold uppercase tracking-[0.9px] text-white">
              {appSettings.homeSecondaryCta}
            </Text>
          </Pressable>

          <View className="mt-4 items-center">
            <View className="rounded-full bg-[#8DC26C] px-4 py-2">
              <Text className="text-[11px] font-bold text-white">{appSettings.featuredSectionTitle}</Text>
            </View>
          </View>

          <View className="mt-5 rounded-[22px] border border-[#E8DCC9] bg-white px-3 py-4">
            <Text className="text-center text-[10px] uppercase tracking-[1.1px] text-[#8A7B67]">
              Specific Situations
            </Text>
            <Text className="mt-2 text-center text-[18px] font-bold text-[#17120F]">
              {specificSituation.title}
            </Text>
            <View className="mt-4 rounded-[18px] bg-[#F5F0E6] p-2">
              <SituationArtwork
                diagramVariant={specificSituation.diagramVariant}
                imageUri={appSettings.situationImageUri}
                roundedClassName="rounded-[14px]"
              />
            </View>
            <View className="mt-4 gap-2">
              {bulletItems.map((instruction) => (
                <View key={instruction.player} className="flex-row items-start gap-2">
                  <Text className="mt-[2px] text-[11px] text-[#1B1714]">•</Text>
                  <Text className="flex-1 text-[11px] leading-[16px] text-[#1B1714]">
                    <Text className="font-bold">{instruction.player}: </Text>
                    {instruction.detail}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="mt-4">
        <View className="flex-row items-center justify-between px-4">
          <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#8A7B67]">
            Featured Situations
          </Text>
          <Pressable
            className="h-9 w-9 items-center justify-center rounded-full border border-[#E8DCC9] bg-white"
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons color="#F46A12" name="settings-outline" size={18} />
          </Pressable>
        </View>
        <ScrollView
          className="mt-3"
          contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 24 }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {sliderItems.map((situation) => (
            <Pressable
              key={situation.id}
              className="mr-3 w-[310px] rounded-[24px] border border-[#E7D9C6] bg-white px-3 py-4"
              onPress={() => router.push(`/situations/${situation.id}`)}
            >
              <Text className="text-center text-[10px] uppercase tracking-[1.1px] text-[#8A7B67]">
                Featured Situations
              </Text>
              <Text className="mt-2 text-center text-[20px] font-bold text-[#17120F]">
                {situation.title}
              </Text>
              <View className="mt-4 rounded-[18px] bg-[#F5F0E6] p-2">
                <SituationArtwork
                  diagramVariant={situation.diagramVariant}
                  imageUri={appSettings.situationImageUri}
                  roundedClassName="rounded-[14px]"
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}
