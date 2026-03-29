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
          backgroundColor: '#FFFDFC',
          borderRadius: 30,
          borderWidth: 1.5,
          borderColor: '#D9D1C3',
          paddingHorizontal: 24,
          paddingTop: 22,
          paddingBottom: 24,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
          opacity: pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        {/* Category Icon */}
        <Ionicons color="#A34712" name={iconName as any} size={30} />

        {/* Drill Count Badge */}
        <View style={{ backgroundColor: '#546686', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
            {`${item.numberOfDrills} drills`}
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#1E1A17', fontFamily: typography.family.serif, marginBottom: 10 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 15, lineHeight: 22, color: '#665C4E', fontWeight: '400', maxWidth: '96%' }}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
