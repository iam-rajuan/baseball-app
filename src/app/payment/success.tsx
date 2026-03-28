import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';

export default function PaymentSuccessScreen() {
  return (
    <Screen header={<PageHeader title="Payment" />} contentClassName="pt-10">
      <Card>
        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#DDF5E8]">
            <Text className="text-4xl text-success">✓</Text>
          </View>
          <Text className="mt-5 text-center text-[40px] font-bold leading-[42px] text-navy">
            Unlocked{'\n'}Successfully
          </Text>
          <Text className="mt-3 text-center text-base leading-7 text-navyMuted">
            You now have full access to all drills.
          </Text>
          <View className="mt-5">
            <Badge label="Elite Performance Drills" tone="success" />
          </View>
        </View>
      </Card>
      <View className="mt-6">
        <Button label="Continue" onPress={() => router.replace('/(tabs)/drills')} />
      </View>
    </Screen>
  );
}
