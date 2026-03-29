import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Loader } from '@/components/loader';
import { settingsService, situationsService } from '@/services';

const specificSituationImage = require('../../../assets/images/specific-situation.png');

export default function SituationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routeId = id ?? '';
  
  const { data: situation, isLoading: situationLoading } = useQuery({
    queryKey: ['situation', routeId],
    queryFn: () => situationsService.getById(routeId),
  });
  const { data: appSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });

  if (situationLoading || settingsLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F6EEDB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Loader />
      </View>
    );
  }

  if (!situation) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F6EEDB', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#6A563E' }}>Situation not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: '#E35D21', borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F6EEDB', paddingTop: statusBarHeight }}>
      {/* ═ HEADER ═ */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, zIndex: 10 }}>
        <Pressable onPress={() => router.back()} style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons color="#1F3A5F" name="chevron-back" size={24} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F3A5F', fontFamily: 'serif', fontStyle: 'italic' }}>Marietta</Text>
          <Text style={{ fontSize: 9, fontWeight: '600', color: '#1F3A5F', textTransform: 'uppercase', letterSpacing: 1.0, marginTop: 0 }}>Baseball Academy</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ position: 'relative' }}>
          {/* Grid pattern */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}>
            {[0, 80, 160, 240, 320, 400, 480].map(top => (
              <View key={top} style={{ position: 'absolute', left: 0, right: 0, top, height: 1, backgroundColor: '#E6D5B8' }} />
            ))}
            {['20%', '40%', '60%', '80%'].map(left => (
              <View key={left} style={{ position: 'absolute', top: 0, bottom: 0, left, width: 1, backgroundColor: '#EAD9C0' }} />
            ))}
          </View>

          <Animated.View entering={FadeIn.duration(500)} style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#9F927A', letterSpacing: 1.0, textTransform: 'uppercase' }}>Full Situational Analysis</Text>
            </View>

            <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 5 }, elevation: 3 }}>
              <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '900', textTransform: 'uppercase', lineHeight: 30, color: '#1A1A1A', fontFamily: 'serif' }}>{situation.title}</Text>
              <Image contentFit="contain" source={specificSituationImage} style={{ width: '100%', height: 260, marginTop: 20 }} />
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#9F927A', letterSpacing: 1.0, textTransform: 'uppercase', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 4 }}>Player Instructions</Text>
                <View style={{ gap: 8 }}>
                  {situation.instructions.map((instruction) => (
                    <Text key={instruction.player} style={{ fontSize: 13.5, lineHeight: 20, fontWeight: '400', color: '#1E2438' }}>
                      <Text style={{ fontWeight: '700', color: '#1E2438' }}>{`${instruction.player}: `}</Text>
                      {instruction.detail}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
