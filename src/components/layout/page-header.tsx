import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PageHeaderProps = {
  title: string;
  rightSlot?: ReactNode;
  showBack?: boolean;
};

export function PageHeader({ title, rightSlot, showBack = true }: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  return (
    <View
      style={{
        paddingTop: statusBarHeight,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#EFE7D9',
        zIndex: 100,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 10,
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
              <Ionicons color="#0C1F4A" name="arrow-back" size={24} />
            </Pressable>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#0C1F4A',
            fontFamily: 'serif',
          }}
        >
          {title}
        </Text>
        <View style={{ minWidth: 36, alignItems: 'flex-end' }}>{rightSlot}</View>
      </View>
    </View>
  );
}
