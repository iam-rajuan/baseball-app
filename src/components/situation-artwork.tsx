import { Image } from 'expo-image';
import { View } from 'react-native';

import { FieldDiagram } from '@/features/playbook/components/field-diagram';

type SituationArtworkProps = {
  imageUri?: string | null;
  diagramVariant: 'infield' | 'outfield';
  roundedClassName?: string;
};

export function SituationArtwork({
  imageUri,
  diagramVariant,
  roundedClassName = 'rounded-[28px]',
}: SituationArtworkProps) {
  if (imageUri) {
    return (
      <View className={`overflow-hidden border border-[#E7DEC9] bg-[#F3EEE4] ${roundedClassName}`}>
        <Image
          contentFit="contain"
          source={{ uri: imageUri }}
          style={{ width: '100%', aspectRatio: 1 }}
        />
      </View>
    );
  }

  return (
    <View className={`overflow-hidden ${roundedClassName}`}>
      <FieldDiagram variant={diagramVariant} />
    </View>
  );
}
