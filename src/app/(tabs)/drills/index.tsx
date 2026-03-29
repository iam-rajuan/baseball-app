import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';


import { Loader } from '@/components/loader';
import { typography } from '@/constants/typography';
import { CategoryTile } from '@/features/drills/components/category-tile';
import { drillsService } from '@/services';

export default function DrillsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['drill-categories'],
    queryFn: drillsService.getCategories,
  });

  if (isLoading || !data) {
    return (
      <View className="flex-1 bg-[#FAF4EA]" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Loader />
      </View>
    );
  }

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View className="flex-1 bg-[#FAF4EA]">
      {/* ═══════ HEADER ═══════ */}
      <View
        style={{
          paddingTop: statusBarHeight,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 16,
          paddingVertical: 10,
          zIndex: 10
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons color="#1F3A5F" name="chevron-back" size={24} />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F3A5F', fontFamily: typography.family.serif }}>
          Drill Category
        </Text>
        <Pressable style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons color="#1F3A5F" name="search" size={22} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ position: 'relative' }}>
          {/* Seamless Grid Backdrop */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}>
            {[0, 80, 160, 240, 320, 400, 480].map(top => (
              <View key={top} style={{ position: 'absolute', left: 0, right: 0, top, height: 1, backgroundColor: '#E6D5B8' }} />
            ))}
            {(['20%', '40%', '60%', '80%'] as const).map(left => (
              <View key={left} style={{ position: 'absolute', top: 0, bottom: 0, left: left as any, width: 1, backgroundColor: '#EAD9C0' }} />
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
                  fontSize: 40, // Bumped to match Home scale
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  lineHeight: 42,
                  color: '#1A1A1A',
                  fontFamily: typography.family.serif
                }}
              >
                Train By Category
              </Text>
              <Text className="mt-3 text-[15px] leading-[24px] text-[#6A563E] font-normal">
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
              {data.map((item, index) => (
                <View key={item.id}>
                  <CategoryTile
                    item={item}
                    onPress={() => router.push(`/drills/category/${item.id}`)}
                  />
                </View>
              ))}
            </View>

            {/* Unlock All Premium Section (Glassmorphism) */}
            <View
              style={{
                marginTop: 20,
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: '#FAF4EA',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.85)',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
                elevation: 6,
                position: 'relative',
              }}
            >
              {/* Background Teaser Content */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingVertical: 20, paddingHorizontal: 20, opacity: 0.35 }}>
                {['Velocity Shredder', "Catcher's Framing Pro", 'Elite Arm Care', 'Advanced Pitch Tunnelling', 'Situational Defense'].map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                      <Ionicons name="lock-closed" size={18} color="#A0AABF" />
                    </View>
                    <Text style={{ flex: 1, fontSize: 18, fontWeight: '800', color: '#0C1F4A' }}>{item}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#A0AABF" />
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
                <View
                  style={{
                    height: 52,
                    width: 52,
                    borderRadius: 26,
                    backgroundColor: '#E35D21',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    shadowColor: '#E35D21',
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4
                  }}
                >
                  <Ionicons color="#FFFFFF" name="lock-closed" size={24} />
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
                  Unlock All{'\n'}Premium Drills
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
                  Unlock every premium drill at once, including position categories and all locked drills in the library, for $99.99.
                </Text>

                <View style={{ marginTop: 24, width: '100%', gap: 10 }}>
                  <Pressable
                    style={{ height: 48, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center', shadowColor: '#E35D21', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                    onPress={() => router.push('/auth/email')}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 }}>UNLOCK ALL $99.99</Text>
                  </Pressable>
                  <Pressable
                    style={{ height: 48, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#B6BCD0', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => router.push('/auth/email')}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#21314F', letterSpacing: 0.5 }}>RESTORE PURCHASES</Text>
                  </Pressable>
                </View>

                <Text
                  style={{
                    marginTop: 16,
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: '700',
                    color: '#4B5563',
                    opacity: 0.8
                  }}
                >
                  All premium drills were unlocked in demo mode. Connect StoreKit next.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
