import { Text, View, ScrollView } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';

export default function PrivacyPolicyScreen() {
  return (
    <Screen header={<PageHeader title="Privacy Policy" />} contentClassName="bg-[#F7F7F5]">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} className="flex-row mb-6">
            <Text className="text-[#3E4A5B] text-base leading-6">{item}. </Text>
            <Text className="text-[#3E4A5B] text-base leading-6 pr-4">
              Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
