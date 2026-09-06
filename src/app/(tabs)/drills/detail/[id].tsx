import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { colors } from '@/constants/theme';
import { DrillBanner } from '@/features/drills/components/drill-banner';
import { EquipmentCard } from '@/features/drills/components/equipment-card';
import { FocusPointCard } from '@/features/drills/components/focus-point-card';
import { StepDirection } from '@/features/drills/components/step-direction';
import { YouTubeVideo, getYouTubeWebView } from '@/features/drills/components/youtube-video';
import { clearRemoteImages } from '@/lib/image-cache';
import { toYouTubeEmbedUrl } from '@/features/drills/youtube';
import { getDrillInitialData } from '@/lib/prefetch';
import { showOfflineNoticeAfterRefresh } from '@/lib/refresh-feedback';
import { drillsService, trackContentView } from '@/services';
import { useAppStore } from '@/store/app-store';

export default function DrillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = id ?? '';
  const isPremium = useAppStore((state) => state.isPremium);
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['drill', routeId],
    queryFn: () => drillsService.getById(routeId),
    initialData: () => getDrillInitialData(routeId),
  });
  const trackedContentViewRef = useRef<string | null>(null);

  useEffect(() => {
    if (!data || trackedContentViewRef.current === data.id) {
      return;
    }

    trackedContentViewRef.current = data.id;
    void trackContentView({
      category: data.category,
      contentId: data.id,
      contentName: data.name,
      contentType: 'drill',
    });
  }, [data]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Loader />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState title="Drill unavailable" description="This drill could not be found." />
      </View>
    );
  }

  const isLockedPremiumDrill = data.accessLevel === 'premium' && !isPremium;

  if (isLockedPremiumDrill) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="bg-background"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={(
            <RefreshControl
              colors={['#E35D21']}
              onRefresh={async () => {
                await clearRemoteImages([data.image, data.imageUrl, data.coverUrl, data.coverPhotoUrl]);
                const result = await refetch();
                showOfflineNoticeAfterRefresh([result]);
              }}
              refreshing={isFetching}
              tintColor="#E35D21"
            />
          )}
        >
          <DrillBanner
            title={data.name}
            subtitle={data.category}
            imageUri={data.image}
          />

          <View className="px-5 py-8">
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: '#F0E8DB',
                paddingHorizontal: 22,
                paddingVertical: 28,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: '#E35D21',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="lock-closed" size={28} color="#FFFFFF" />
              </View>

              <Text
                style={{
                  marginTop: 18,
                  textAlign: 'center',
                  fontSize: 28,
                  fontWeight: '900',
                  lineHeight: 34,
                  color: '#0C1F4A',
                }}
              >
                Premium Drill Locked
              </Text>

              <Text
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  fontSize: 15,
                  lineHeight: 23,
                  color: '#5A4B3D',
                }}
              >
                Activate your premium membership to view the full instructions, video, and coaching notes for this drill.
              </Text>

              <Pressable
                onPress={() => router.push('/payment')}
                style={{
                  marginTop: 24,
                  width: '100%',
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#E35D21',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Unlock Premium Access
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={(
          <RefreshControl
            colors={['#E35D21']}
            onRefresh={async () => {
              await clearRemoteImages([data.image, data.imageUrl, data.coverUrl, data.coverPhotoUrl]);
              const result = await refetch();
              showOfflineNoticeAfterRefresh([result]);
            }}
            refreshing={isFetching}
            tintColor="#E35D21"
          />
        )}
      >
        <DrillBanner
          title={data.name}
          subtitle={data.category}
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
