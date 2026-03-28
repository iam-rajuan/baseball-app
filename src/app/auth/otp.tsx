import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { OTPInput } from '@/components/form/otp-input';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { authService } from '@/services';
import { useAppStore } from '@/store/app-store';

export default function OtpScreen() {
  const authEmail = useAppStore((state) => state.authEmail);
  const otpCode = useAppStore((state) => state.otpCode);
  const setOtpCode = useAppStore((state) => state.setOtpCode);

  const onContinue = async () => {
    await authService.verifyCode(authEmail, otpCode || '8284');
    router.push('/payment');
  };

  return (
    <Screen header={<PageHeader title="Drill Category" />} contentClassName="pt-8">
      <Text className="text-[40px] font-bold leading-[44px] text-navy">Verify Code</Text>
      <Text className="mt-2 text-lg text-navyMuted">Enter the 4-digit code sent to your email</Text>
      <View className="mt-8">
        <OTPInput length={4} onChange={setOtpCode} value={otpCode} />
      </View>
      <Text className="mt-5 text-center text-sm text-navyMuted">Didn’t receive the code? Resend</Text>
      <View className="mt-6">
        <Button label="Continue" onPress={onContinue} />
      </View>
    </Screen>
  );
}
