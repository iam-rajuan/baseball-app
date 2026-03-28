import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { PlaceholderBanner } from '@/features/drills/components/placeholder-banner';
import { drillsService } from '@/services';

export default function DrillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = id ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['drill', routeId],
    queryFn: () => drillsService.getById(routeId),
  });

  return (
    <Screen header={<PageHeader title="Drill Details" />} contentClassName="pt-5">
      {isLoading ? <Loader /> : null}
      {!isLoading && !data ? (
        <EmptyState title="Drill unavailable" description="This drill could not be found." />
      ) : null}
      {data ? (
        <View className="gap-5">
          <PlaceholderBanner subtitle="Ultimate Hitting Drill Pack" title={data.name} />
          <Card>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Setup Process
            </Text>
            <Text className="mt-3 text-base leading-7 text-navyMuted">{data.description}</Text>
          </Card>
          <Card>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Equipment Needed
            </Text>
            <View className="mt-3 gap-3">
              {data.equipment.map((item) => (
                <Text key={item} className="text-base text-navy">
                  • {item}
                </Text>
              ))}
            </View>
          </Card>
          <Card>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Step-by-Step Directions
            </Text>
            <View className="mt-4 gap-4">
              {data.steps.map((step, index) => (
                <View key={step} className="flex-row gap-3">
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-navy">
                    <Text className="font-bold text-surface">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-base leading-6 text-navy">{step}</Text>
                </View>
              ))}
            </View>
          </Card>
          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Key Focus Points
            </Text>
            {data.focusPoints.map((point) => (
              <Card key={point}>
                <Text className="text-base leading-6 text-navy">{point}</Text>
              </Card>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
