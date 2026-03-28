import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { FieldDiagram } from '@/features/playbook/components/field-diagram';
import { situationsService } from '@/services';

export default function SituationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = id ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['situation', routeId],
    queryFn: () => situationsService.getById(routeId),
  });

  return (
    <Screen header={<PageHeader title="Situation Details" />} contentClassName="pt-5">
      {isLoading ? <Loader /> : null}
      {!isLoading && !data ? (
        <EmptyState title="Situation unavailable" description="This play could not be found." />
      ) : null}
      {data ? (
        <View className="gap-5">
          <Card>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              {data.category}
            </Text>
            <Text className="mt-2 text-[34px] font-bold leading-10 text-navy">{data.title}</Text>
            <View className="mt-4">
              <FieldDiagram variant={data.diagramVariant} />
            </View>
          </Card>
          <Card>
            <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
              Player Instructions
            </Text>
            <View className="mt-4 gap-3">
              {data.instructions.map((instruction) => (
                <Text key={instruction.player} className="text-[14px] leading-6 text-navy">
                  <Text className="font-bold">{instruction.player}: </Text>
                  {instruction.detail}
                </Text>
              ))}
            </View>
          </Card>
        </View>
      ) : null}
    </Screen>
  );
}
