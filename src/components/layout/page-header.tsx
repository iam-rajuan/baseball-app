import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PageHeaderProps = {
  title: string;
  rightSlot?: ReactNode;
  showBack?: boolean;
};

export function PageHeader({ title, rightSlot, showBack = true }: PageHeaderProps) {
  return (
    <View className="border-b border-[#EFE7D9] bg-surface px-5 py-4">
      <View className="flex-row items-center justify-between">
        <View className="w-10">
          {showBack ? (
            <Pressable className="h-10 w-10 items-center justify-center" onPress={() => router.back()}>
              <Ionicons color="#0C1F4A" name="arrow-back" size={22} />
            </Pressable>
          ) : null}
        </View>
        <Text className="text-xl font-bold text-navy">{title}</Text>
        <View className="min-w-10 items-end">{rightSlot}</View>
      </View>
    </View>
  );
}
