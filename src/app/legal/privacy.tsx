import { Text, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { legalPages } from '@/mock/data';

export default function PrivacyScreen() {
  return (
    <Screen header={<PageHeader title="Privacy Policy" />} contentClassName="pt-8">
      <View className="gap-6">
        {legalPages.privacyPolicy.map((item, index) => (
          <Text key={item} className="text-base leading-7 text-navy">
            {index + 1}. {item}
          </Text>
        ))}
      </View>
    </Screen>
  );
}
