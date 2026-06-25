import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { EquipmentItem } from '@/types';

type EquipmentCardProps = {
  equipment: Array<string | EquipmentItem>;
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
        {equipment.map((item, index) => {
          const parsedItem = typeof item === 'string'
            ? { name: item, link: null }
            : { name: item.name, link: item.link };

          const hasLink = Boolean(parsedItem.link);
          const handlePress = async () => {
            if (parsedItem.link) {
              try {
                await Linking.openURL(parsedItem.link);
              } catch (err) {
                console.error('Failed to open URL:', err);
              }
            }
          };

          return (
            <View key={index} className="flex-row items-center gap-3">
              <View className="h-1.5 w-1.5 rounded-full bg-orange" />
              {hasLink ? (
                <Pressable onPress={handlePress} className="flex-row items-center active:opacity-70">
                  <Text className="text-[14px] text-navy font-semibold leading-[20px] underline decoration-navy">
                    {parsedItem.name}
                  </Text>
                  <MaterialCommunityIcons name="open-in-new" size={14} color={colors.navy} style={{ marginLeft: 4 }} />
                </Pressable>
              ) : (
                <Text className="text-[14px] text-navy font-medium leading-[20px]">{parsedItem.name}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
