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

const iconMap: Record<string, string> = {
  hitting: 'baseball',
  'base-running': 'walk',
  pitching: 'speedometer-outline',
  infield: 'apps-outline',
  outfield: 'radio-outline',
  catcher: 'shield-outline',
};

export function CategoryTile({ item, onPress }: CategoryTileProps) {
  const iconName = iconMap[item.id] || 'fitness-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: '#FFFFFF', // Reverted to clean white as per original design
          borderRadius: 36,
          paddingHorizontal: 28,
          paddingVertical: 32,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOpacity: 0.045,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 8 },
          elevation: 3,
          opacity: pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        {/* Category Icon */}
        <Ionicons color="#8B340B" name={iconName as any} size={36} />

        {/* Drill Count Badge */}
        <View style={{ backgroundColor: '#4D5D7C', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {`${item.numberOfDrills} drills`}
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#1A1A1A', fontFamily: typography.family.serif, marginBottom: 8 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 15.5, lineHeight: 23, color: '#6A563E', fontWeight: '400', maxWidth: '95%' }}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
