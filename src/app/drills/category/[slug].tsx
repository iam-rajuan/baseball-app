import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { PlaceholderBanner } from '@/features/drills/components/placeholder-banner';
import { drillsService } from '@/services';
import { useAppStore } from '@/store/app-store';

export default function DrillCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const routeSlug = slug ?? '';
  const isPremium = useAppStore((state) => state.isPremium);
  const categoryQuery = useQuery({
    queryKey: ['drill-category', routeSlug],
    queryFn: () => drillsService.getCategory(routeSlug),
  });
  const drillsQuery = useQuery({
    queryKey: ['drill-list', routeSlug],
    queryFn: async () => {
      const category = await drillsService.getCategory(routeSlug);
      return category ? drillsService.getDrillsByCategory(category.name) : [];
    },
  });

  return (
    <Screen header={<PageHeader title="Drill Category" />} contentClassName="pt-5">
      {categoryQuery.isLoading || drillsQuery.isLoading ? <Loader /> : null}
      {!categoryQuery.isLoading && !categoryQuery.data ? (
        <EmptyState title="Category missing" description="This drill category could not be found." />
      ) : null}
      {categoryQuery.data ? (
        <View className="gap-5">
          <PlaceholderBanner
            subtitle="Practice Drills"
            title={categoryQuery.data.name.toUpperCase()}
          />
          <View>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Included
            </Text>
            <View className="mt-3 gap-3">
              {drillsQuery.data
                ?.filter((drill) => drill.accessLevel === 'free')
                .map((drill) => (
                  <Pressable key={drill.id} onPress={() => router.push(`/drills/detail/${drill.id}`)}>
                    <Card>
                      <Text className="text-lg font-bold text-navy">{drill.name}</Text>
                    </Card>
                  </Pressable>
                ))}
            </View>
          </View>

          <View>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Premium
            </Text>
            <View className="mt-3 gap-3">
              {drillsQuery.data
                ?.filter((drill) => drill.accessLevel === 'premium')
                .map((drill) => (
                  <Pressable
                    key={drill.id}
                    onPress={() => (isPremium ? router.push(`/drills/detail/${drill.id}`) : router.push('/premium'))}
                  >
                    <Card>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-navy">{drill.name}</Text>
                        {!isPremium ? <Badge label="Premium" tone="premium" /> : null}
                      </View>
                    </Card>
                  </Pressable>
                ))}
            </View>
          </View>

          {!isPremium ? (
            <Card>
              <Text className="text-center text-[32px] font-bold leading-9 text-navy">
                Unlock all{'\n'}Premium Drills
              </Text>
              <Text className="mt-3 text-center text-sm leading-6 text-navyMuted">
                Unlock every premium drill across all categories for $99.99.
              </Text>
              <View className="mt-5 gap-3">
                <Button label="Upgrade • $99.99" onPress={() => router.push('/premium')} />
              </View>
            </Card>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}
