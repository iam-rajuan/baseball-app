import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Platform, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { typography } from '@/constants/typography';

type PageHeaderProps = {
  title: string;
  rightSlot?: ReactNode;
  showBack?: boolean;
  variant?: 'default' | 'settings';
};

export function PageHeader({
  title,
  rightSlot,
  showBack = true,
  variant = 'default',
}: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const isSettings = variant === 'settings';
  const statusBarHeight = isSettings
    ? Platform.OS === 'android'
      ? StatusBar.currentHeight ?? 0
      : 0
    : insets.top;

  return (
    <View
      style={{
        paddingTop: statusBarHeight,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: isSettings ? 0 : 1,
        borderColor: '#EFE7D9',
        zIndex: 100,
      }}
    >
      <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: isSettings ? 16 : 20,
        paddingVertical: isSettings ? 4 : 10,
      }}
      >
        <View style={{ width: 36 }}>
          {showBack ? (
            <Pressable
              style={{
                height: 36,
                width: 36,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 18,
              }}
              onPress={() => router.back()}
            >
              <Ionicons
                color={isSettings ? '#1F3A5F' : '#0C1F4A'}
                name={isSettings ? 'chevron-back' : 'arrow-back'}
                size={24}
              />
            </Pressable>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: isSettings ? '#1F3A5F' : '#0C1F4A',
            fontFamily: isSettings ? typography.family.serif : 'serif',
          }}
        >
          {title}
        </Text>
        <View style={{ minWidth: 36, alignItems: 'flex-end' }}>{rightSlot}</View>
      </View>
    </View>
  );
}
