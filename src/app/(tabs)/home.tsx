import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Loader } from '@/components/loader';
import { settingsService, situationsService } from '@/services';
import type { Situation } from '@/types';
import HomeLogo from '../../../assets/svg/home-logo.svg';

const specificSituationImage = require('../../../assets/images/specific-situation.png');

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const sliderRef = useRef<FlatList<Situation>>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: situations, isLoading: situationsLoading } = useQuery({
    queryKey: ['situations'],
    queryFn: situationsService.getAll,
  });
  const { data: appSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });

  if (situationsLoading || settingsLoading || !situations || !appSettings) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAF4EA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Loader />
      </View>
    );
  }

  const featuredSituations = situations.filter((item) => item.featured);
  const sliderItems = featuredSituations.length ? featuredSituations : situations;
  const specificSituation = situations.find((item) => !item.featured) ?? situations[0];
  const bulletItems = specificSituation.instructions.slice(0, 9);
  const slideWidth = width - 32;

  const handleSliderScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    if (nextIndex !== activeSlide) {
      setActiveSlide(nextIndex);
    }
  };

  const scrollToSlide = (direction: 'prev' | 'next') => {
    const maxIndex = sliderItems.length - 1;
    const nextIndex =
      direction === 'prev' ? Math.max(activeSlide - 1, 0) : Math.min(activeSlide + 1, maxIndex);

    sliderRef.current?.scrollToOffset({
      animated: true,
      offset: nextIndex * slideWidth,
    });
    setActiveSlide(nextIndex);
  };

  const openRandomSituation = () => {
    const randomSituation = situations[Math.floor(Math.random() * situations.length)];
    router.push(`/situations/${randomSituation.id}`);
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#EDE2D0', paddingTop: statusBarHeight }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ===== TOP HEADER BAR ===== */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12 }}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#1F3A5F',
                fontFamily: 'serif',
                fontStyle: 'italic',
              }}
            >
              Marietta
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: '#1F3A5F',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginTop: 0,
              }}
            >
              Baseball Academy
            </Text>
          </View>
          <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons color="#1F3A5F" name="search" size={20} />
          </Pressable>
        </View>

        {/* ===== HERO SECTION ===== */}
        <View className="relative overflow-hidden" style={{ backgroundColor: '#EDE2D0' }}>
          {/* Background grid pattern */}
          <View className="absolute inset-0 opacity-50">
            <View className="absolute inset-x-0 top-0 h-px bg-[#EADBBE]" />
            <View className="absolute inset-x-0 top-[84px] h-px bg-[#EADBBE]" />
            <View className="absolute inset-x-0 top-[168px] h-px bg-[#EADBBE]" />
            <View className="absolute inset-x-0 top-[252px] h-px bg-[#EADBBE]" />
            <View className="absolute inset-x-0 top-[336px] h-px bg-[#EADBBE]" />
            <View className="absolute inset-x-0 top-[420px] h-px bg-[#EADBBE]" />
            <View className="absolute inset-x-0 top-[504px] h-px bg-[#EADBBE]" />
            <View className="absolute inset-y-0 left-[20%] w-px bg-[#EDE1C9]" />
            <View className="absolute inset-y-0 left-[40%] w-px bg-[#EDE1C9]" />
            <View className="absolute inset-y-0 left-[60%] w-px bg-[#EDE1C9]" />
            <View className="absolute inset-y-0 left-[80%] w-px bg-[#EDE1C9]" />
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 24 }}>
            {/* Subheading */}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 13,
                lineHeight: 18,
                fontWeight: '600',
                color: '#6A563E',
                letterSpacing: 1.3,
                textTransform: 'uppercase',
              }}
            >
              {appSettings.homeEyebrow}
            </Text>

            {/* Main Heading */}
            <Text
              style={{
                marginTop: 6,
                textAlign: 'center',
                fontSize: 42,
                fontWeight: '900',
                textTransform: 'uppercase',
                lineHeight: 44,
                color: '#1A1A1A',
                fontFamily: 'serif',
              }}
            >
              {appSettings.homeTitle}
            </Text>

            {/* Logo */}
            <View className="mt-4 items-center">
              <HomeLogo height={128} width={160} />
            </View>

            {/* Pick Random button */}
            <Pressable
              style={{ marginTop: 24, height: 48, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center' }}
              onPress={openRandomSituation}
            >
              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Pick Random</Text>
            </Pressable>

            {/* Browse All button */}
            <Pressable
              style={{ marginTop: 10, height: 48, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => router.push('/(tabs)/situations')}
            >
              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Browse All 40</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== FEATURED SITUATION SLIDER ===== */}
        <View style={{ backgroundColor: '#EDE2D0', paddingHorizontal: 16, paddingBottom: 24 }}>
          <View className="mb-3 flex-row items-center justify-between">
            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.0, color: '#9F927A', textTransform: 'uppercase' }}>
              Featured Situation
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full border border-[#E6D8BF] bg-white"
                disabled={activeSlide === 0}
                onPress={() => scrollToSlide('prev')}
              >
                <Ionicons color={activeSlide === 0 ? '#D0C4AF' : '#D66A1D'} name="chevron-back" size={16} />
              </Pressable>
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full border border-[#E6D8BF] bg-white"
                disabled={activeSlide === sliderItems.length - 1}
                onPress={() => scrollToSlide('next')}
              >
                <Ionicons
                  color={activeSlide === sliderItems.length - 1 ? '#D0C4AF' : '#D66A1D'}
                  name="chevron-forward"
                  size={16}
                />
              </Pressable>
            </View>
          </View>

          <FlatList
            ref={sliderRef}
            data={sliderItems}
            horizontal
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={handleSliderScroll}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={slideWidth}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/situations/${item.id}`)}
                style={{ width: slideWidth, marginRight: 12, borderRadius: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }}
              >
                <View className="flex-row items-center gap-4">
                  <View className="items-center">
                    <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-[#76B45D]">
                      <Text className="text-[13px] font-bold uppercase text-white">{item.shortLabel}</Text>
                    </View>
                    <View className="mt-1 h-[5px] w-[5px] rounded-full bg-[#76B45D]" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 0.9, color: '#B6BCD0', textTransform: 'uppercase' }}>
                      Featured Situation
                    </Text>
                    <Text style={{ marginTop: 2, fontSize: 22, fontWeight: '700', lineHeight: 26, color: '#21314F' }}>
                      {item.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>

        {/* ===== SPECIFIC SITUATIONS ===== */}
        <View style={{ backgroundColor: '#EDE2D0', paddingHorizontal: 16, paddingBottom: 24, paddingTop: 24 }}>
          <Text style={{ marginBottom: 12, fontSize: 10, fontWeight: '700', letterSpacing: 1.0, color: '#9F927A', textTransform: 'uppercase' }}>
            Specific Situations
          </Text>

          <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 24, paddingTop: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', lineHeight: 26, color: '#21314F' }}>
              {specificSituation.title}
            </Text>

            <Pressable onPress={() => router.push(`/situations/${specificSituation.id}`)}>
              <Image
                contentFit="contain"
                source={specificSituationImage}
                style={{ width: '100%', height: 230, marginTop: 16 }}
              />
            </Pressable>

            <View style={{ marginTop: 16, gap: 5 }}>
              {bulletItems.map((instruction) => (
                <Text key={instruction.player} style={{ fontSize: 11.5, lineHeight: 17, fontWeight: '400', color: '#1E2438' }}>
                  <Text style={{ fontWeight: '700', color: '#1E2438' }}>{instruction.player}: </Text>
                  {instruction.detail}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

