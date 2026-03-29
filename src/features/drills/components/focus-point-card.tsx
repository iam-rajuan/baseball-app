import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type FocusPointCardProps = {
  title: string;
  description: string;
};

export function FocusPointCard({ title, description }: FocusPointCardProps) {
  return (
    <View className="overflow-hidden rounded-[20px] bg-[#F4F7FB] border border-[#E9EEF4] shadow-sm mb-1">
      <View className="flex-row">
        <View className="w-1.5 bg-orange" />
        <View className="flex-1 p-5 px-6">
          <Text className="text-[16px] font-bold text-navy">{title}</Text>
          <Text className="mt-1.5 text-[14px] font-medium leading-[22px] text-navyMuted">{description}</Text>
        </View>
      </View>
    </View>
  );
}
