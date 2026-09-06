import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/layout/page-header';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { typography } from '@/constants/typography';
import { CategoryTile } from '@/features/drills/components/category-tile';
import { isRecoverableApiError } from '@/lib/api-client';
import { prefetchDrillCategory } from '@/lib/prefetch';
import { showOfflineNoticeAfterRefresh } from '@/lib/refresh-feedback';
import { drillsService, trackListView } from '@/services';
import { useAppStore } from '@/store/app-store';

function FrostedCard({ children }: { children: ReactNode }) {
  if (Platform.OS === 'android') {
    return <View style={{ backgroundColor: 'rgba(250, 246, 240, 0.92)' }}>{children}</View>;
  }

  return (
    <BlurView
      intensity={60}
      tint="systemThickMaterialLight"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
    >
      <View style={{ backgroundColor: 'rgba(250, 246, 240, 0.65)' }}>{children}</View>
    </BlurView>
  );
}

export default function DrillsScreen() {
  const isPremium = useAppStore((state) => state.isPremium);
  const insets = useSafeAreaInsets();

  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['drill-categories'],
    queryFn: drillsService.getCategories,
  });
  const trackedListViewRef = useRef(false);

  useEffect(() => {
    if (!data || trackedListViewRef.current) {
      return;
    }

    trackedListViewRef.current = true;
    void trackListView({
      contentType: 'drill_category',
      itemCount: data.length,
      listName: 'Drill Categories',
    });
  }, [data]);

  if (isLoading || (!data && isRecoverableApiError(error))) {
    return (
      <View className="flex-1 bg-[#F4E7D5]" style={{ paddingTop: insets.top }}>
        <SkeletonLoader />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-[#F4E7D5]" style={{ paddingTop: insets.top, paddingHorizontal: 16, justifyContent: 'center' }}>
        <EmptyState
          title="Unable to load drills"
          description="Please check your internet connection and try again."
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F4E7D5]">
      <PageHeader
        title="Drill Category"
        variant="section"
        showBack={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={(
          <RefreshControl
            colors={['#E35D21']}
            onRefresh={async () => {
              const result = await refetch();
              showOfflineNoticeAfterRefresh([result]);
            }}
            refreshing={isFetching}
            tintColor="#E35D21"
          />
        )}
      >
        <View style={{ position: 'relative' }}>
          {/* Seamless Grid Backdrop */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
            {[0, 80, 160, 240, 320, 400, 480].map(top => (
              <View key={top} style={{ position: 'absolute', left: 0, right: 0, top, height: 1.5, backgroundColor: '#D8C3A6' }} />
            ))}
            {(['20%', '40%', '60%', '80%'] as const).map(left => (
              <View key={left} style={{ position: 'absolute', top: 0, bottom: 0, left: left as any, width: 1.5, backgroundColor: '#D8C3A6' }} />
            ))}
          </View>

          <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            {/* Top Eyebrow Section */}
            <View style={{ marginBottom: 28 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: '#C2410C',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}
              >
                Practice Drills
              </Text>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  lineHeight: 42,
                  color: '#1A1A1A',
                  fontFamily: typography.family.serif
                }}
              >
                Train By Category
              </Text>
              <Text className="mt-3 text-[15px] leading-[24px] text-[#5A4B3D] font-normal">
                {`Start with the included drill library, then unlock\npremium position-specific work and expanded drill packs with in-app purchases.`}
              </Text>
            </View>

            {/* List Header */}
            <Text
              style={{
                marginBottom: 20,
                fontSize: 22,
                fontWeight: '900',
                letterSpacing: 0.5,
                color: '#1A1A1A',
                fontFamily: typography.family.serif,
                textTransform: 'uppercase'
              }}
            >
              Drill Categories
            </Text>

            {/* Drill Categories List */}
            <View>
              {data.length ? (
                data.map((item) => (
                  <View key={item.id}>
                    <CategoryTile
                      item={item}
                      onPressIn={() => {
                        void prefetchDrillCategory(item.id);
                      }}
                      onPress={() => router.push(`/drills/category/${item.id}`)}
                    />
                  </View>
                ))
              ) : (
                <EmptyState
                  title="No Drill Categories"
                  description="Training categories are currently being prepared. Please check back soon."
                />
              )}
            </View>

            {/* Premium Access Status Card */}
            <View
              style={{
                marginTop: 20,
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.6)',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
                elevation: 8,
              }}
            >
              <FrostedCard>
                {/* Foreground Content */}
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 32,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <View
                    style={{
                      height: 52,
                      width: 52,
                      borderRadius: 26,
                      backgroundColor: isPremium ? '#2F9E44' : '#E35D21',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      shadowColor: isPremium ? '#2F9E44' : '#E35D21',
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 4
                    }}
                  >
                    <Ionicons color="#FFFFFF" name={isPremium ? 'checkmark' : 'lock-closed'} size={24} />
                  </View>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: '900',
                      lineHeight: 28,
                      color: '#1A1A1A',
                      fontFamily: typography.family.serif,
                      textTransform: 'uppercase'
                    }}
                  >
                    {isPremium ? `All Premium Drills\nUnlocked` : `Unlock All\nPremium Drills`}
                  </Text>

                  <Text
                    style={{
                      marginTop: 12,
                      textAlign: 'center',
                      fontSize: 13,
                      lineHeight: 20,
                      color: '#374151',
                      fontWeight: '600',
                      paddingHorizontal: 10
                    }}
                  >
                    {isPremium
                      ? 'Your premium access is active. You can open every premium drill and training pack.'
                      : 'Unlock all premium drills with a one-time purchase.'}
                  </Text>

                  <View style={{ marginTop: 24, width: '100%', gap: 10 }}>
                    <Pressable
                      style={{ height: 48, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center', shadowColor: '#E35D21', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                      onPress={() => router.push(isPremium ? '/payment/success' : '/payment')}
                    >
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 }}>
                        {isPremium ? 'PREMIUM ACTIVE' : 'UNLOCK PREMIUM'}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={{ height: 48, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(180,185,200,0.5)', justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => router.push('/payment')}
                    >
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#21314F', letterSpacing: 0.5 }}>
                        {isPremium ? 'MANAGE MEMBERSHIP' : 'RESTORE PURCHASES'}
                      </Text>
                    </Pressable>
                  </View>

                </View>
              </FrostedCard>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
