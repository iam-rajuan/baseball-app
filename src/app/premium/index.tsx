import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';

export default function PremiumScreen() {
  return (
    <Screen header={<PageHeader title="Purchase Premium" />} contentClassName="pt-8">
      <Card>
        <View className="items-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-orange">
            <Text className="text-2xl text-surface">🔒</Text>
          </View>
          <Text className="mt-5 text-center text-[36px] font-bold leading-10 text-navy">
            Unlock All{'\n'}Premium Drills
          </Text>
          <Text className="mt-3 text-center text-sm leading-6 text-navyMuted">
            Unlock every premium drill across all categories for $99.99.
          </Text>
          <View className="mt-4">
            <Badge label="Elite Access" tone="premium" />
          </View>
        </View>
        <View className="mt-6 gap-4">
          {[
            'Full access to 150+ pro-level baseball drills',
            'Personalized performance tracking',
            'Direct scouting reports access',
          ].map((item) => (
            <Text key={item} className="text-base leading-6 text-navy">
              • {item}
            </Text>
          ))}
        </View>
      </Card>

      <View className="mt-6 gap-3">
        <Button label="Continue" onPress={() => router.push('/auth/email')} />
        <Button label="Restore Purchase" variant="secondary" />
      </View>
    </Screen>
  );
}
