import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';

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
    <View className="flex-1 bg-[#FAF4EA]" style={{ paddingTop: statusBarHeight }}>
      {/* ═══════ HEADER ═══════ */}
      <View
        style={{
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

          <Animated.View entering={SlideInDown.duration(600).springify().damping(18)} style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
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
                <Animated.View key={item.id} entering={FadeInDown.delay(index * 60).duration(500)}>
                  <CategoryTile
                    item={item}
                    onPress={() => router.push(`/drills/category/${item.id}`)}
                  />
                </Animated.View>
              ))}
            </View>

            {/* Unlock All Premium Section */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(800)}
              style={{
                marginTop: 20,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 20,
                paddingVertical: 24,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4
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
                  marginBottom: 16
                }}
              >
                <Ionicons color="#FFFFFF" name="lock-closed" size={24} />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 28,
                  fontWeight: '900',
                  lineHeight: 32,
                  color: '#1A1A1A',
                  fontFamily: typography.family.serif,
                  textTransform: 'uppercase'
                }}
              >
                {`Unlock All\nPremium Drills`}
              </Text>

              <Text
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  fontSize: 13,
                  lineHeight: 20,
                  color: '#7D869A',
                  fontWeight: '400',
                  paddingHorizontal: 10
                }}
              >
                {`Unlock every premium drill at once, including premium position categories and all locked drills in the original six categories, for $99.99.`}
              </Text>

              <View style={{ marginTop: 20, width: '100%', gap: 10 }}>
                <Pressable
                  style={{ height: 48, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => router.push('/premium')}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>UNLOCK ALL $99.99</Text>
                </Pressable>
                <Pressable
                  style={{ height: 48, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#B6BCD0', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => router.push('/premium')}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#21314F' }}>RESTORE PURCHASES</Text>
                </Pressable>
              </View>

              <Text
                style={{
                  marginTop: 16,
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: '700',
                  color: '#1F3A5F',
                  textTransform: 'none'
                }}
              >
                All premium drills were unlocked in demo mode. Connect StoreKit next.
              </Text>
            </Animated.View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
