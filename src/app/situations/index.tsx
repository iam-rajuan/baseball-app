import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { FieldDiagram } from '@/features/playbook/components/field-diagram';
import { situationsService } from '@/services';

export default function SituationsListScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });

  return (
    <Screen header={<PageHeader title="Defensive Situations" />} contentClassName="pt-5">
      {isLoading || !data ? (
        <Loader />
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
                  <FieldDiagram variant={situation.diagramVariant} />
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
