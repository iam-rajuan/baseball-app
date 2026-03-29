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
      <View style={{ flex: 1, backgroundColor: '#F6EEDB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Loader />
      </View>
    );
  }

  const featuredSituations = (situations || []).filter((item) => item.featured);
  const sliderItems = featuredSituations.length ? featuredSituations : (situations || []);
  const specificSituation = (situations || []).find((item) => !item.featured) ?? (situations || [])[0];
  const bulletItems = specificSituation?.instructions?.slice(0, 9) || [];
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
    <View style={{ flex: 1, backgroundColor: '#F6EEDB', paddingTop: statusBarHeight }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ===== NAVBAR ===== */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10 }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F3A5F', fontFamily: 'serif', fontStyle: 'italic' }}>Marietta</Text>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#1F3A5F', textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 1 }}>Baseball Academy</Text>
          </View>
          <Pressable style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons color="#1F3A5F" name="search" size={20} />
          </Pressable>
        </View>

        {/* ===== HERO SECTION ===== */}
        <View style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F6EEDB' }}>
          {/* Grid pattern */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}>
            {[0, 80, 160, 240, 320, 400, 480].map(top => (
              <View key={top} style={{ position: 'absolute', left: 0, right: 0, top, height: 1, backgroundColor: '#E6D5B8' }} />
            ))}
            {(['20%', '40%', '60%', '80%'] as const).map(left => (
              <View key={left} style={{ position: 'absolute', top: 0, bottom: 0, left: left as any, width: 1, backgroundColor: '#EAD9C0' }} />
            ))}
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
            <Text style={{ textAlign: 'center', fontSize: 11, lineHeight: 14, fontWeight: '700', color: '#6A563E', letterSpacing: 1.5, textTransform: 'uppercase' }}>{appSettings.homeEyebrow}</Text>
            <Text style={{ marginTop: 4, textAlign: 'center', fontSize: 40, fontWeight: '900', textTransform: 'uppercase', lineHeight: 42, color: '#1A1A1A', fontFamily: 'serif' }}>{appSettings.homeTitle}</Text>
            <View style={{ marginTop: 12, alignItems: 'center' }}><HomeLogo height={110} width={138} /></View>
            <Pressable style={{ marginTop: 20, height: 46, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center' }} onPress={openRandomSituation}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Pick Random</Text>
            </Pressable>
            <Pressable style={{ marginTop: 10, height: 46, borderRadius: 999, backgroundColor: '#E35D21', justifyContent: 'center', alignItems: 'center' }} onPress={() => router.push('/(tabs)/situations')}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Browse All 40</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== FEATURED SITUATION ===== */}
        <View style={{ backgroundColor: '#F6EEDB', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.0, color: '#9F927A', textTransform: 'uppercase' }}>Featured Situation</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#E6D8BF', backgroundColor: '#FFFFFF' }} disabled={activeSlide === 0} onPress={() => scrollToSlide('prev')}>
                <Ionicons color={activeSlide === 0 ? '#D0C4AF' : '#D66A1D'} name="chevron-back" size={14} />
              </Pressable>
              <Pressable style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderWidth: 1, borderColor: '#E6D8BF', backgroundColor: '#FFFFFF' }} disabled={activeSlide === sliderItems.length - 1} onPress={() => scrollToSlide('next')}>
                <Ionicons color={activeSlide === sliderItems.length - 1 ? '#D0C4AF' : '#D66A1D'} name="chevron-forward" size={14} />
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
              <Pressable onPress={() => router.push(`/situations/${item.id}`)} style={{ width: slideWidth, marginRight: 12, borderRadius: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 18, paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#76B45D' }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase' }}>{item.shortLabel}</Text>
                    </View>
                    <View style={{ marginTop: 4, height: 5, width: 5, borderRadius: 3, backgroundColor: '#76B45D' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 0.9, color: '#B6BCD0', textTransform: 'uppercase' }}>Featured Situation</Text>
                    <Text style={{ marginTop: 2, fontSize: 21, fontWeight: '700', lineHeight: 25, color: '#21314F' }}>{item.title}</Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>

        {/* ===== SPECIFIC SITUATIONS ===== */}
        <View style={{ backgroundColor: '#F6EEDB', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
          <Text style={{ marginBottom: 10, fontSize: 10, fontWeight: '700', letterSpacing: 1.0, color: '#9F927A', textTransform: 'uppercase' }}>Specific Situations</Text>
          {specificSituation && (
            <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 18, paddingBottom: 20, paddingTop: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}>
              <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: '700', lineHeight: 25, color: '#21314F' }}>{specificSituation.title}</Text>
              <Pressable onPress={() => router.push(`/situations/${specificSituation.id}`)}>
                <Image contentFit="contain" source={specificSituationImage} style={{ width: '100%', height: 220, marginTop: 14 }} />
              </Pressable>
              <View style={{ marginTop: 14, gap: 4 }}>
                {bulletItems.map((instruction) => (
                  <Text key={instruction.player} style={{ fontSize: 11.5, lineHeight: 17, fontWeight: '400', color: '#1E2438' }}>
                    <Text style={{ fontWeight: '700' }}>{instruction.player}: </Text>
                    {instruction.detail}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
