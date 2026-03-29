import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/components/layout/page-header';

export default function PaymentSuccessScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4E7D5' }} edges={['top', 'left', 'right']}>
      <PageHeader title="Payment" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110, flexGrow: 1 }}
        style={{ flex: 1, backgroundColor: '#F4E7D5' }}
      >
        {/* Success Icon */}
        <View style={{ alignItems: 'center', paddingTop: 40 }}>
          <View
            style={{
              height: 110,
              width: 110,
              borderRadius: 55,
              backgroundColor: '#E8752A',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#E8752A',
              shadowOpacity: 0.35,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 10 },
              elevation: 16,
            }}
          >
            <View
              style={{
                height: 52,
                width: 52,
                borderRadius: 26,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={30} color="#E8752A" />
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              marginTop: 28,
              textAlign: 'center',
              fontSize: 34,
              fontWeight: '800',
              color: '#0C1F4A',
              lineHeight: 40,
            }}
          >
            Unlocked{'\n'}Successfully
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              marginTop: 14,
              textAlign: 'center',
              fontSize: 16,
              color: '#7C869B',
              lineHeight: 24,
            }}
          >
            You now have full access to all{'\n'}drills
          </Text>
        </View>

        {/* Access Level Card */}
        <View
          style={{
            marginTop: 36,
            marginHorizontal: 24,
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#F0E8DB',
            paddingHorizontal: 20,
            paddingVertical: 18,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 12,
              backgroundColor: '#F0ECE4',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="settings-outline" size={22} color="#0C1F4A" />
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: '700',
                letterSpacing: 1.2,
                color: '#5A4B3D',
                textTransform: 'uppercase',
              }}
            >
              Access Level
            </Text>
            <Text
              style={{
                marginTop: 3,
                fontSize: 16,
                fontWeight: '800',
                color: '#0C1F4A',
              }}
            >
              Elite Performance Drills
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <Pressable
            onPress={() => router.replace('/(tabs)/drills')}
            style={{
              backgroundColor: '#0C1F4A',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#FFFFFF',
              }}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
