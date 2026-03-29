import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
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
import { settingsService, situationsService } from '@/services';

const specificSituationImage = require('../../../assets/images/specific-situation.png');

export default function SituationsTabScreen() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

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
      <View style={{ flex: 1, backgroundColor: '#FAF4EA', paddingTop: statusBarHeight }}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF4EA' }}>
      {/* ===== HEADER (Fixed) ===== */}
      <View
        style={{
          paddingTop: statusBarHeight,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderColor: '#EFE7D9',
          zIndex: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#0C1F4A',
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
                color: '#0C1F4A',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginTop: 1,
              }}
            >
              Baseball Academy
            </Text>
          </View>
          <Pressable style={{ height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons color="#0C1F4A" name="search" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ position: 'relative', backgroundColor: '#FAF4EA' }}>
          {/* Grid pattern */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.35 }}>
            {[0, 80, 160, 240, 320, 400, 480].map(top => (
              <View key={top} style={{ position: 'absolute', left: 0, right: 0, top, height: 1, backgroundColor: '#EAD9C0' }} />
            ))}
            {['20%', '40%', '60%', '80%'].map(left => (
              <View key={left} style={{ position: 'absolute', top: 0, bottom: 0, left: left as any as number, width: 1, backgroundColor: '#EAD9C0' }} />
            ))}
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '700', color: '#6A563E', letterSpacing: 1.5, textTransform: 'uppercase' }}>Master the Game</Text>
              <Text style={{ marginTop: 4, fontSize: 34, fontWeight: '900', textTransform: 'uppercase', lineHeight: 36, color: '#1A1A1A', fontFamily: 'serif' }}>Defensive Situations</Text>
            </View>

            <View style={{ gap: 24 }}>
              {(situations || []).map((situation, index) => (
                <View key={situation.id}>
                  <Text style={{ marginBottom: 10, fontSize: 10, fontWeight: '700', letterSpacing: 1.0, color: '#9F927A', textTransform: 'uppercase' }}>{`Situation ${index + 1}`}</Text>
                  <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 18, paddingBottom: 20, paddingTop: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}>
                    <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: '700', lineHeight: 25, color: '#21314F' }}>{situation.title}</Text>
                    <Pressable onPress={() => router.push(`/situations/${situation.id}`)}>
                      <Image contentFit="contain" source={specificSituationImage} style={{ width: '100%', height: 220, marginTop: 14 }} />
                    </Pressable>
                    <View style={{ marginTop: 14, gap: 4 }}>
                      {situation.instructions.slice(0, 5).map((instruction) => (
                        <Text key={instruction.player} style={{ fontSize: 11.5, lineHeight: 17, fontWeight: '400', color: '#1E2438' }}>
                          <Text style={{ fontWeight: '700', color: '#1E2438' }}>{`${instruction.player}: `}</Text>
                          {instruction.detail}
                        </Text>
                      ))}
                    </View>
                    <Pressable onPress={() => router.push(`/situations/${situation.id}`)} style={{ marginTop: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#E35D21' }}>View Full Playbook</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
