import { Image, Text, View } from 'react-native';

import { PlaceholderBanner } from '@/features/drills/components/placeholder-banner';

type DrillBannerProps = {
  title: string;
  subtitle: string;
  categoryId: string;
};

export function DrillBanner({ title, subtitle, categoryId }: DrillBannerProps) {
  if (categoryId !== 'hitting') {
    return <PlaceholderBanner title={title} subtitle={subtitle} />;
  }

  return (
    <View className="h-[130px] w-full bg-navy">
      <Image
        source={require('@/assets/images/hitting-drill-banner.png')}
        className="h-full w-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 justify-end bg-black/20 px-5 py-4">
        <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#E8DDCB]">
          {subtitle}
        </Text>
        <Text className="mt-1 text-[26px] font-black text-white">{title}</Text>
      </View>
    </View>
  );
}
