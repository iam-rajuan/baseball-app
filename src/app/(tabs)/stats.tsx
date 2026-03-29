import { Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { Screen } from '@/components/layout/screen';
import { Section } from '@/components/section';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <Screen contentClassName="pt-4" contentStyle={{ paddingTop: insets.top + 16 }}>
      <Section eyebrow="Performance Tracking" title="Stats">
        <Text className="text-sm leading-6 text-navyMuted">
          Placeholder analytics styled to match the academy dashboard until live backend metrics are connected.
        </Text>
      </Section>
      <View className="mt-6 gap-4">
        {[
          ['Reaction Grade', '92%'],
          ['Situation Accuracy', '87%'],
          ['Premium Drill Progress', '14 / 50'],
        ].map(([label, value]) => (
          <Card key={label}>
            <Text className="text-sm uppercase tracking-[1.3px] text-[#A08E73]">{label}</Text>
            <Text className="mt-2 text-[36px] font-bold text-navy">{value}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
