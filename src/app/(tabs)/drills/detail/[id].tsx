import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { colors } from '@/constants/theme';
import { DrillBanner } from '@/features/drills/components/drill-banner';
import { EquipmentCard } from '@/features/drills/components/equipment-card';
import { FocusPointCard } from '@/features/drills/components/focus-point-card';
import { StepDirection } from '@/features/drills/components/step-direction';
import { YouTubeVideo, getYouTubeWebView } from '@/features/drills/components/youtube-video';
import { getCategoryIdFromName } from '@/features/drills/drill-media';
import { toYouTubeEmbedUrl } from '@/features/drills/youtube';
import { drillsService } from '@/services';

export default function DrillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = id ?? '';
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['drill', routeId],
    queryFn: () => drillsService.getById(routeId),
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <PageHeader title="Drill Details" />
        <Loader />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 bg-background">
        <PageHeader title="Drill Details" />
        <EmptyState title="Drill unavailable" description="This drill could not be found." />
      </View>
    );
  }

  const focusPoints = data.focusPoints
    .map((point) => {
      if (typeof point !== 'string') {
        return {
          title: point.title.trim(),
          description: point.description.trim(),
        };
      }

      const parts = point.split(':');

      return {
        title: parts[0]?.trim() ?? '',
        description: parts.slice(1).join(':').trim(),
      };
    })
    .filter((point) => point.title || point.description);
  const hasYouTubeVideo = Boolean(toYouTubeEmbedUrl(data.youtubeUrl) && getYouTubeWebView());

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Drill Details" variant="section" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-background"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={(
          <RefreshControl
            colors={['#E35D21']}
            onRefresh={() => {
              void refetch();
            }}
            refreshing={isFetching}
            tintColor="#E35D21"
          />
        )}
      >
        <DrillBanner
          title={data.name}
          subtitle={data.category}
          categoryId={getCategoryIdFromName(data.category)}
          imageUri={data.image}
        />
        
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

          {hasYouTubeVideo ? (
            <View className="mt-8">
              <Text className="mb-4 text-[11px] font-bold uppercase tracking-[1.6px] text-navyMuted">
                Drill Video
              </Text>
              <YouTubeVideo url={data.youtubeUrl} />
            </View>
          ) : null}

          {data.equipment.length ? (
            <View className="mt-10">
              <EquipmentCard equipment={data.equipment} />
            </View>
          ) : null}

          {data.steps.length ? (
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
          ) : null}

          {focusPoints.length ? (
            <View className="mt-12">
              <Text className="text-[11px] font-bold uppercase tracking-[1.6px] text-navyMuted mb-5">
                Key Focus Points
              </Text>
              <View className="gap-4">
                {focusPoints.map((point, index) => (
                  <FocusPointCard
                    key={index}
                    title={point.title}
                    description={point.description}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
