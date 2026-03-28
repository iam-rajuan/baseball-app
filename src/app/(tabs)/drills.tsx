import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Loader } from '@/components/loader';
import { Screen } from '@/components/layout/screen';
import { Section } from '@/components/section';
import { CategoryTile } from '@/features/drills/components/category-tile';
import { drillsService } from '@/services';

export default function DrillsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['drill-categories'],
    queryFn: drillsService.getCategories,
  });

  return (
    <Screen contentClassName="pt-4">
      <Section eyebrow="Practice Drills" title="Train By Category">
        <Text className="text-sm leading-6 text-navyMuted">
          Start with the included drill library, then unlock premium position-specific work and expanded drill packs with in-app purchases.
        </Text>
      </Section>

      <View className="mt-6 gap-4">
        {isLoading || !data ? (
          <Loader />
        ) : (
          data.map((item) => (
            <CategoryTile
              key={item.id}
              item={item}
              onPress={() => router.push(`/drills/category/${item.id}`)}
            />
          ))
        )}
      </View>

      <View className="mt-6 rounded-[30px] bg-surface px-5 py-6 shadow-card">
        <View className="mx-auto h-12 w-12 items-center justify-center rounded-full bg-orange">
          <Text className="text-xl text-surface">🔒</Text>
        </View>
        <Text className="mt-4 text-center text-[30px] font-bold leading-9 text-navy">
          Unlock All{'\n'}Premium Drills
        </Text>
        <Text className="mt-3 text-center text-sm leading-6 text-navyMuted">
          Unlock every premium drill across all categories with one-time access for $99.99.
        </Text>
        <View className="mt-5 gap-3">
          <Button label="Unlock All $99.99" onPress={() => router.push('/premium')} />
          <Button label="Restore Purchase" variant="secondary" onPress={() => router.push('/premium')} />
        </View>
      </View>
    </Screen>
  );
}
