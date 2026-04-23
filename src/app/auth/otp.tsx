import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OTPInput } from '@/components/form/otp-input';
import { PageHeader } from '@/components/layout/page-header';
import { LogoMark } from '@/components/logo-mark';
import { typography } from '@/constants/typography';
import { authService } from '@/services';
import { useAppStore } from '@/store/app-store';

export default function OtpScreen() {
  const authEmail = useAppStore((state) => state.authEmail);
  const otpCode = useAppStore((state) => state.otpCode);
  const setOtpCode = useAppStore((state) => state.setOtpCode);
  const hydrateSession = useAppStore((state) => state.hydrateSession);

  const onContinue = async () => {
    const result = await authService.verifyCode(authEmail, otpCode);
    hydrateSession(result.user);
    router.replace(result.user.isPremium ? '/(tabs)/drills' : '/payment');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4E7D5' }}>
      <PageHeader title="Verification" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 18, paddingTop: 10 }}>
          {/* Logo Section */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 24 }}>
            <LogoMark height={100} width={100} />
            <Text
              style={{
                marginTop: 16,
                fontSize: 28,
                fontWeight: '900',
                color: '#0C1F4A',
                textTransform: 'uppercase',
                fontFamily: typography.family.serif,
                textAlign: 'center',
              }}
            >
              Verify Code
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontSize: 16,
                color: '#5A4B3D',
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Enter the 4-digit code sent to{'\n'}
              <Text style={{ fontWeight: '700', color: '#0C1F4A' }}>{authEmail || 'your email'}</Text>
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
              borderWidth: 1,
              borderColor: '#F0E8DB',
            }}
          >
            <OTPInput length={4} onChange={setOtpCode} value={otpCode} />

            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#5A4B3D' }}>
                Didn’t receive the code?
              </Text>
              <Pressable onPress={() => authService.sendCode(authEmail)}>
                <Text
                  style={{
                    marginTop: 6,
                    color: '#E35D21',
                    fontWeight: '700',
                  }}
                >
                  Resend Code
                </Text>
              </Pressable>
            </View>

            <Pressable
              disabled={!otpCode || otpCode.length < 4}
              onPress={onContinue}
              style={{
                marginTop: 24,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#0C1F4A',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: (!otpCode || otpCode.length < 4) ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Continue to Payment
              </Text>
            </Pressable>
          </View>

          {/* Bottom Help */}
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Pressable onPress={() => router.back()}>
              <Text
                style={{
                  color: '#5A4B3D',
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}
              >
                Change Email Address
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
