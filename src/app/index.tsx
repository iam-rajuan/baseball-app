import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { LogoMark } from '@/components/logo-mark';

export default function SplashRoute() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient className="flex-1" colors={['#081736', '#0C1F4A', '#06112A']}>
      <View className="flex-1 items-center justify-center px-10">
        <View className="absolute inset-x-[-40px] top-28 h-72 rounded-full bg-[#133061]/70" />
        <LogoMark height={118} width={118} />
        <Text className="mt-7 text-center text-[18px] font-semibold uppercase tracking-[6px] text-[#F3A75F]">
          Marietta
        </Text>
        <Text className="mt-1 text-center text-[54px] font-bold uppercase tracking-[4px] text-surface">
          Baseball
        </Text>
        <Text className="mt-2 text-center text-[16px] font-semibold uppercase tracking-[5px] text-[#F3A75F]">
          Academy
        </Text>
        <View className="mt-12 h-1.5 w-44 overflow-hidden rounded-full bg-[#1A315E]">
          <View className="h-full w-28 rounded-full bg-orange" />
        </View>
      </View>
    </LinearGradient>
  );
}
