import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

export function Card({ children }: PropsWithChildren) {
  return (
    <View className="rounded-[28px] border border-[#F0E8DB] bg-surface p-4 shadow-card">
      {children}
    </View>
  );
}
