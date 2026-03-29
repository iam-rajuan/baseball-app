import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { typography } from '@/constants/typography';
import { getCategoryEyebrow } from '@/features/drills/drill-media';
import { PlaceholderBanner } from '@/features/drills/components/placeholder-banner';
import { drillsService } from '@/services';
import { useAppStore } from '@/store/app-store';

/**
 * Hitting action image (stored in assets/images)
 */
const FEATURED_HITTING_IMAGE = require('../../../../../assets/images/hitting-featured.png');

export default function DrillCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const routeSlug = slug ?? '';
  const isPremium = useAppStore((state) => state.isPremium);

  const categoryQuery = useQuery({
    queryKey: ['drill-category', routeSlug],
    queryFn: () => drillsService.getCategory(routeSlug),
  });

  const drillsQuery = useQuery({
    queryKey: ['drill-list', routeSlug, 'v1'], // Bumped key to bust cache
    queryFn: async () => {
      const categoryCache = await drillsService.getCategory(routeSlug);
      return categoryCache ? drillsService.getDrillsByCategory(categoryCache.name) : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (categoryQuery.isLoading || drillsQuery.isLoading || !categoryQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F4E7D5', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Loader />
      </View>
    );
  }

  const category = categoryQuery.data;
  const drills = drillsQuery.data || [];
  const freeDrills = drills.filter((drill) => drill.accessLevel === 'free');
  const premiumDrills = drills.filter((drill) => drill.accessLevel === 'premium');

  return (
    <View style={{ flex: 1, backgroundColor: '#F4E7D5' }}>
      <PageHeader
        title={category.name}
        variant="section"
        rightSlot={(
          <Pressable style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons color="#1F3A5F" name="search" size={22} />
          </Pressable>
        )}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            {/* Top Eyebrow Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#C2410C', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                {getCategoryEyebrow(category.name)}
              </Text>
              <Text style={{ fontSize: 44, fontWeight: '900', textTransform: 'uppercase', lineHeight: 46, color: '#1A1A1A', fontFamily: typography.family.serif }}>
                {category.name}
              </Text>
              <Text style={{ marginTop: 8, fontSize: 15, lineHeight: 22, color: '#5A4B3D', fontWeight: '400' }}>
                {category.subtitle}
              </Text>
            </View>

            {/* Featured Image */}
            {category.id === 'hitting' ? (
              <View style={{ marginBottom: 28, borderRadius: 28, overflow: 'hidden', backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
                <Image
                  source={FEATURED_HITTING_IMAGE}
                  style={{ width: '100%', height: 210 }}
                  contentFit="cover"
                />
              </View>
            ) : (
              <View style={{ marginBottom: 28 }}>
                <PlaceholderBanner title={category.name} subtitle={`${category.numberOfDrills} drills`} />
              </View>
            )}

            {!drills.length ? (
              <View style={{ marginBottom: 24 }}>
                <EmptyState
                  title="No drills yet"
                  description="When drills are added from the admin dashboard, they will appear here automatically."
                />
              </View>
            ) : null}

            {/* Included Drills Section */}
            {freeDrills.length ? (
            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View style={{ backgroundColor: '#FAF0E6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, marginRight: 10 }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#A34712', textTransform: 'uppercase', letterSpacing: 0.8 }}>Included</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A1A1A', fontFamily: typography.family.serif }}>Included Drills</Text>
              </View>

              <View style={{ gap: 12 }}>
                {freeDrills.map((drill, index) => {
                  let iconName: any = 'baseball-outline';
                  if (drill.id === 'soccer-ball-drill') iconName = 'ellipse-outline';
                  if (drill.id === 'connection-ball-drill') iconName = 'link';

                  return (
                    <Pressable
                      key={drill.id}
                      onPress={() => router.push(`/drills/detail/${drill.id}`)}
                      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2, borderWidth: 1, borderColor: '#F0E8DB' }}
                    >
                      <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#FAF4EA', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                        <Ionicons name={iconName} size={20} color="#C2410C" />
                      </View>
                      <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: '#1F2937' }}>{drill.name}</Text>
                      <Ionicons name="chevron-forward" size={18} color="#CBD2E0" />
                    </Pressable>
                  );
                })}
              </View>
            </View>
            ) : null}

            {/* Premium Drills Section */}
            {premiumDrills.length ? (
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View style={{ backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, marginRight: 10, borderWidth: 1, borderColor: '#FFEDD5' }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#C2410C', textTransform: 'uppercase', letterSpacing: 0.8 }}>Premium</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A1A1A', fontFamily: typography.family.serif }}>Premium Drills</Text>
              </View>

              <View style={{ gap: 12 }}>
                {premiumDrills.map((drill, index) => (
                  <Pressable
                    key={drill.id}
                    onPress={() => isPremium ? router.push(`/drills/detail/${drill.id}`) : router.push('/premium')}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2, borderWidth: 1, borderColor: '#F0E8DB' }}
                  >
                    <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#FAF4EA', alignItems: 'center', justifyContent: 'center', marginRight: 14, opacity: 0.6 }}>
                      <Ionicons name="lock-closed" size={18} color="#CBD2E0" />
                    </View>
                    <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: '#1F2937', opacity: 0.6 }}>{drill.name}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#CBD2E0" />
                  </Pressable>
                ))}
              </View>
            </View>
            ) : null}

            {/* Unlock All Section Card (Glassmorphism) */}
            {!isPremium && premiumDrills.length > 0 && (
              <View style={{ marginTop: 12, borderRadius: 28, overflow: 'hidden', backgroundColor: '#FAF4EA', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)', position: 'relative' }}>

                {/* Background Teaser Content */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingVertical: 24, paddingHorizontal: 20 }}>
                  {[1, 2, 3, 4].map((_, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, opacity: 0.35 }}>
                      <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                        <Ionicons name="lock-closed" size={18} color="#A0AABF" />
                      </View>
                      <View style={{ flex: 1, height: 14, backgroundColor: '#0C1F4A', borderRadius: 7, opacity: 0.3 }} />
                    </View>
                  ))}
                </View>

                {/* Blur Overlay */}
                <BlurView
                  intensity={100}
                  tint="light"
                  experimentalBlurMethod="dimezisBlurView"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.55)'
                  }}
                />

                {/* Foreground Content */}
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 32,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <View style={{ height: 48, width: 48, borderRadius: 24, backgroundColor: '#E35D21', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Ionicons color="#FFFFFF" name="lock-closed" size={22} />
                  </View>
                  <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '900', lineHeight: 28, color: '#1A1A1A', fontFamily: typography.family.serif, marginBottom: 16 }}>
                    Unlock all drills
                  </Text>
                  <Text style={{ textAlign: 'center', fontSize: 14, lineHeight: 22, color: '#374151', fontWeight: '600', marginBottom: 28, paddingHorizontal: 10 }}>
                    Get access to our full library of 50+ professional hitting and fielding drills.
                  </Text>
                  <Pressable onPress={() => router.push('/auth/email')} style={{ width: '100%', height: 60, borderRadius: 30, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center', shadowColor: '#E35D21', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }}>Upgrade - $99.99</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
