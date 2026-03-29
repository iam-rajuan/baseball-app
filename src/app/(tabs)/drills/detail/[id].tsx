import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { colors } from '@/constants/theme';
import { DrillBanner } from '@/features/drills/components/drill-banner';
import { EquipmentCard } from '@/features/drills/components/equipment-card';
import { FocusPointCard } from '@/features/drills/components/focus-point-card';
import { StepDirection } from '@/features/drills/components/step-direction';
import { drillsService } from '@/services';

export default function DrillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = id ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['drill', routeId],
    queryFn: () => drillsService.getById(routeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <PageHeader title="Drill Details" />
        <Loader />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <PageHeader title="Drill Details" />
        <EmptyState title="Drill unavailable" description="This drill could not be found." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <PageHeader title="Drill Details" />
      <ScrollView showsVerticalScrollIndicator={false} className="bg-background" contentContainerStyle={{ paddingBottom: 60 }}>
        <DrillBanner />
        
        <View className="px-5 py-8">
          <Text className="text-[34px] font-black leading-[42px] text-navy">{data.name}</Text>
          
          {/* Setup Process */}
          <View className="mt-5">
            <View className="flex-row items-center gap-2.5">
              <View className="mt-[-1px]">
                <Ionicons name="settings-outline" size={15} color={colors.orange} />
              </View>
              <Text className="text-[11px] font-bold uppercase tracking-[1.6px] text-navyMuted">
                Setup Process
              </Text>
            </View>
            <Text className="mt-3 text-[15px] leading-7 font-medium text-navyMuted pr-2">
              {data.description}
            </Text>
          </View>

          {/* Equipment Needed */}
          <View className="mt-10">
            <EquipmentCard equipment={data.equipment} />
          </View>

          {/* Step-by-Step Directions */}
          <View className="mt-10">
            <Text className="text-[11px] font-bold uppercase tracking-[1.6px] text-navyMuted">
              Step-by-Step Directions
            </Text>
            <View className="mt-5 gap-5">
              {data.steps.map((step, index) => (
                <StepDirection key={index} index={index + 1} text={step} />
              ))}
            </View>
          </View>

          {/* Key Focus Points */}
          <View className="mt-12">
            <Text className="text-[11px] font-bold uppercase tracking-[1.6px] text-navyMuted mb-5">
              Key Focus Points
            </Text>
            <View className="gap-4">
              {data.focusPoints.map((point, index) => {
                const parts = point.split(':');
                if (parts.length < 2) return null;
                const title = parts[0].trim();
                const description = parts.slice(1).join(':').trim();
                return (
                  <FocusPointCard 
                    key={index} 
                    title={title} 
                    description={description} 
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


