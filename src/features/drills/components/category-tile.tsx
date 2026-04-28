import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { typography } from '@/constants/typography';
import type { DrillCategory } from '@/types';

type CategoryTileProps = {
  item: DrillCategory;
  onPress: () => void;
};

/**
 * Pixel-Perfect Drill Category Tile (Reverted to White Card Spec)
 * - Brand Serif typography for headings
 * - Clean white card background with premium shadow
 * - High-round corners (36px) as per design spec
 */

const fallbackCategoryIcons = [
  'baseball-outline',
  'walk-outline',
  'speedometer-outline',
  'radio-button-on-outline',
  'locate-outline',
  'grid-outline',
  'aperture-outline',
  'shield-outline',
  'hand-left-outline',
  'barbell-outline',
  'fitness-outline',
  'stopwatch-outline',
  'eye-outline',
  'compass-outline',
  'analytics-outline',
  'trophy-outline',
  'flame-outline',
  'lock-closed-outline',
  'medkit-outline',
] as const;

const getFallbackIcon = (id: string) => {
  const hash = Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0);
  return fallbackCategoryIcons[hash % fallbackCategoryIcons.length] ?? 'baseball-outline';
};

export function CategoryTile({ item, onPress }: CategoryTileProps) {
  const iconName = item.accentIcon || getFallbackIcon(item.id);

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-[20px] p-5 mb-4 shadow-sm active:opacity-95 active:scale-[0.985]"
    >
      <View className="flex-row justify-between items-start mb-3">
        {/* Category Icon */}
        <Ionicons color="#C2410C" name={iconName as any} size={28} />

        {/* Drill Count Badge */}
        <View className="bg-[#3F4E6B] px-3 py-1 rounded-full">
          <Text className="text-white text-[12px] font-bold uppercase">
            {`${item.numberOfDrills} DRILLS`}
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ fontFamily: typography.family.serif }} className="text-[20px] font-semibold text-[#1F2937] mb-1">
          {item.name}
        </Text>
        <Text className="text-[14px] leading-[22px] text-[#6B7280]">
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
