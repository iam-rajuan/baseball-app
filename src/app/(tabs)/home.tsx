import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Loader } from '@/components/loader';
import { Screen } from '@/components/layout/screen';
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
      <Screen>
        <Loader />
      </Screen>
    );
  }

  const featuredSituations = situations.filter((item) => item.featured);
  const sliderItems = featuredSituations.length ? featuredSituations : situations;
  const specificSituation = situations.find((item) => !item.featured) ?? situations[0];
  const bulletItems = specificSituation.instructions.slice(0, 9);
  const slideWidth = Math.min(width - 40, 336);

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

  return (
    <Screen contentClassName="px-0 pb-28 pt-0">
      <View className="relative overflow-hidden bg-[#F6EEDB]">
        <View className="absolute inset-0 opacity-60">
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

        <View className="px-5 pb-10 pt-6">
          <Text className="text-center text-[11px] font-semibold uppercase tracking-[1px] text-[#6A563E]">
            {appSettings.homeEyebrow}
          </Text>

          <Text
            className="mt-3 text-center text-[28px] font-bold uppercase leading-[31px] text-[#22170D]"
            style={{ fontFamily: 'Georgia' }}
          >
            {appSettings.homeTitle}
          </Text>

          <View className="mt-5 items-center">
            <HomeLogo height={96} width={120} />
          </View>

          <Pressable
            className="mt-6 rounded-full bg-[#F06A22] px-5 py-4 shadow-sm"
            onPress={openRandomSituation}
          >
            <Text className="text-center text-[15px] font-bold text-white">Pick Random</Text>
          </Pressable>

          <Pressable
            className="mt-3 rounded-full bg-[#F06A22] px-5 py-4 shadow-sm"
            onPress={() => router.push('/(tabs)/situations')}
          >
            <Text className="text-center text-[15px] font-bold text-white">Browse All 40</Text>
          </Pressable>

          <View className="mt-6">
            <View className="mb-3 flex-row items-center justify-between px-1">
              <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#9F927A]">
                Featured Situation
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-[#E6D8BF] bg-white"
                  disabled={activeSlide === 0}
                  onPress={() => scrollToSlide('prev')}
                >
                  <Ionicons color={activeSlide === 0 ? '#D0C4AF' : '#D66A1D'} name="chevron-back" size={18} />
                </Pressable>
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-[#E6D8BF] bg-white"
                  disabled={activeSlide === sliderItems.length - 1}
                  onPress={() => scrollToSlide('next')}
                >
                  <Ionicons
                    color={activeSlide === sliderItems.length - 1 ? '#D0C4AF' : '#D66A1D'}
                    name="chevron-forward"
                    size={18}
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
                  className="rounded-[24px] bg-white px-5 py-5"
                  onPress={() => router.push(`/situations/${item.id}`)}
                  style={{ width: slideWidth, marginRight: 12 }}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="h-16 w-16 items-center justify-center rounded-full bg-[#76B45D]">
                      <Text className="text-[13px] font-bold uppercase text-white">{item.shortLabel}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[9px] font-bold uppercase tracking-[0.9px] text-[#B6BCD0]">
                        Featured Situation
                      </Text>
                      <Text className="mt-1 text-[24px] font-bold leading-[28px] text-[#21314F]">
                        {item.title}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />

            <View className="mt-3 flex-row items-center justify-center gap-2">
              {sliderItems.map((item, index) => (
                <View
                  key={item.id}
                  className={`h-2 rounded-full ${index === activeSlide ? 'w-6 bg-[#E46C1A]' : 'w-2 bg-[#D7CCB8]'}`}
                />
              ))}
            </View>
          </View>

          <View className="mt-6 rounded-[24px] bg-white px-5 pb-6 pt-5">
            <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#9F927A]">
              Specific Situations
            </Text>
            <Text className="mt-4 text-center text-[24px] font-bold leading-[30px] text-[#21314F]">
              {specificSituation.title}
            </Text>

            <Pressable onPress={() => router.push(`/situations/${specificSituation.id}`)}>
              <Image
                contentFit="contain"
                source={specificSituationImage}
                style={{ width: '100%', height: 250, marginTop: 18 }}
              />
            </Pressable>

            <View className="mt-5 gap-2">
              {bulletItems.map((instruction) => (
                <Text key={instruction.player} className="text-[11px] font-semibold leading-[17px] text-[#1E2438]">
                  <Text className="font-bold">{instruction.player}: </Text>
                  {instruction.detail}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
