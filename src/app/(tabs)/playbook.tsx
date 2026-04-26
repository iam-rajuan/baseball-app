import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { LogoMark } from '@/components/logo-mark';
import { Screen } from '@/components/layout/screen';
import { Section } from '@/components/section';
import { FieldDiagram } from '@/features/playbook/components/field-diagram';
import { getActiveApiBaseUrl } from '@/lib/api-client';
import { situationsService } from '@/services';

export default function PlaybookScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });

  if (isLoading) {
    return (
      <Screen>
        <Loader />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <EmptyState
          title="Could not load playbook"
          description={`${error?.message ?? 'Request failed'}\nAPI: ${getActiveApiBaseUrl()}`}
        />
      </Screen>
    );
  }

  const featured = data.find((item) => item.featured) ?? data[0];
  const randomSituation = () => {
    const next = data[Math.floor(Math.random() * data.length)];
    router.push(`/situations/${next.id}`);
  };

  return (
    <Screen contentClassName="pt-4">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-[28px] font-bold text-navy">Marietta</Text>
          <Text className="-mt-1 text-[11px] font-semibold uppercase tracking-[1.3px] text-navyMuted">
            Baseball Academy
          </Text>
        </View>
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface">
          <Ionicons color="#7382A3" name="search-outline" size={20} />
        </Pressable>
      </View>

      <View className="mt-5 rounded-[32px] border border-[#EFE7D7] bg-[#F8F0E3] px-4 py-5">
        <Text className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#8E7A60]">
          Every player has a role on every play
        </Text>
        <Text className="mt-3 text-[45px] font-bold uppercase leading-[48px] text-[#17120F]">
          Defensive{'\n'}Situations
        </Text>
        <View className="mt-5 items-center">
          <LogoMark />
        </View>
        <View className="mt-6 gap-3">
          <Button label="Pick Random" onPress={randomSituation} />
          <Button label="Browse All 40" onPress={() => router.push('/situations')} />
        </View>
      </View>

      <View className="mt-5">
        <Section title="Featured Situation">
          <Pressable onPress={() => router.push(`/situations/${featured.id}`)}>
            <Card>
              <View className="flex-row items-center gap-4">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-[#74B864]">
                  <Text className="text-sm font-bold text-surface">{featured.shortLabel}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.3px] text-[#B0BACA]">
                    Featured Situation
                  </Text>
                  <Text className="mt-1 text-2xl font-bold text-navy">{featured.title}</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        </Section>
      </View>

      <View className="mt-6">
        <Section eyebrow="Specific Situations" title={data[1]?.title ?? 'Browse Situations'}>
          <Pressable onPress={() => router.push(`/situations/${data[1]?.id ?? featured.id}`)}>
            <Card>
              <FieldDiagram variant={data[1]?.diagramVariant} />
              <View className="mt-4 gap-2">
                {(data[1]?.instructions ?? featured.instructions).map((instruction) => (
                  <Text key={instruction.player} className="text-[13px] leading-5 text-navy">
                    <Text className="font-bold">{instruction.player}: </Text>
                    {instruction.detail}
                  </Text>
                ))}
              </View>
            </Card>
          </Pressable>
        </Section>
      </View>
    </Screen>
  );
}
