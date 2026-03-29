import { ScrollView, Text, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';

export default function PrivacyPolicyScreen() {
  return (
    <Screen header={<PageHeader title="Privacy Policy" variant="section" />}>
      <ScrollView
        style={{ backgroundColor: '#F4E7D5' }}
        contentContainerStyle={{ padding: 20, paddingBottom: 60, backgroundColor: '#F4E7D5' }}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} className="flex-row mb-6">
            <Text className="text-[#5A4B3D] text-base leading-6">{item}. </Text>
            <Text className="text-[#5A4B3D] text-base leading-6 pr-4">
              Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
