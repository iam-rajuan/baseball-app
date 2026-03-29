import { Image, View } from 'react-native';

export function DrillBanner() {
  return (
    <View className="h-[130px] w-full bg-navy">
      <Image
        source={require('@/assets/images/hitting-drill-banner.png')}
        className="h-full w-full"
        resizeMode="cover"
      />
    </View>
  );
}
