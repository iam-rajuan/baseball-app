import { Text, View } from 'react-native';

import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { legalPages } from '@/mock/data';

export default function AboutScreen() {
  return (
    <Screen header={<PageHeader title="About Us" />} contentClassName="pt-8">
      <Text className="text-[42px] font-bold leading-[46px] text-navy">Marietta Baseball Academy</Text>
      <Text className="mt-4 text-lg font-semibold text-orange">{legalPages.aboutUs.headline}</Text>
      <Text className="mt-4 text-base leading-7 text-navy">{legalPages.aboutUs.body}</Text>

      <View className="mt-8">
        <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">Company</Text>
        <View className="mt-3 gap-2">
          {legalPages.aboutUs.company.map((line) => (
            <Text key={line} className="text-base text-navy">
              {line}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">Contact Us</Text>
        <View className="mt-3 gap-2">
          {legalPages.aboutUs.contact.map((line) => (
            <Text key={line} className="text-base text-navy">
              {line}
            </Text>
          ))}
        </View>
      </View>
    </Screen>
  );
}
