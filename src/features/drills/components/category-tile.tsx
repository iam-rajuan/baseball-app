import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import type { DrillCategory } from '@/types';

type CategoryTileProps = {
  item: DrillCategory;
  onPress: () => void;
};

export function CategoryTile({ item, onPress }: CategoryTileProps) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View className="flex-row items-center gap-4">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-orangeSoft">
            <Ionicons color="#F46A12" name={item.accentIcon as never} size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-navy">{item.name}</Text>
            <Text className="mt-1 text-sm leading-5 text-navyMuted">{item.subtitle}</Text>
          </View>
          <View className="items-end gap-2">
            <Badge label={`${item.numberOfDrills} drills`} />
            {item.accessLevel === 'premium' ? <Badge label="locked" tone="default" /> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
