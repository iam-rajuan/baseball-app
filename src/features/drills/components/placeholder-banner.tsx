import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { LogoMark } from '@/components/logo-mark';

type PlaceholderBannerProps = {
  title: string;
  subtitle: string;
};

export function PlaceholderBanner({ title, subtitle }: PlaceholderBannerProps) {
  return (
    <LinearGradient
      className="overflow-hidden rounded-[28px]"
      colors={['#111F42', '#253A72', '#444444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="min-h-[140px] flex-row items-center justify-between px-4 py-5">
        <View className="max-w-[60%] gap-2">
          <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#D5DCEC]">
            {subtitle}
          </Text>
          <Text className="text-3xl font-bold leading-9 text-surface">{title}</Text>
        </View>
        <View className="rounded-[20px] bg-white/10 p-3">
          <LogoMark height={74} width={74} />
        </View>
      </View>
    </LinearGradient>
  );
}
