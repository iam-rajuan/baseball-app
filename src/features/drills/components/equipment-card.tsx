import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type EquipmentCardProps = {
  equipment: string[];
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <View className="rounded-[24px] bg-surface p-6 shadow-sm">
      <View className="flex-row items-center gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-[8px] bg-[#FFF2E9]">
          <MaterialCommunityIcons name="cube-outline" size={18} color={colors.orange} />
        </View>
        <Text className="text-[15px] font-bold text-navy">Equipment Needed</Text>
      </View>
      <View className="mt-6 gap-3.5 ml-1">
        {equipment.map((item, index) => (
          <View key={index} className="flex-row items-center gap-3">
            <View className="h-1.5 w-1.5 rounded-full bg-orange" />
            <Text className="text-[14px] text-navy font-medium leading-[20px]">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
