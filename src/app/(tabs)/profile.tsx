import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/card';
import { LogoMark } from '@/components/logo-mark';
import { Screen } from '@/components/layout/screen';
import { useAppStore } from '@/store/app-store';

const menuItems = [
  { label: 'Help & support', route: '/support' as const },
  { label: 'Terms & Conditions', route: '/legal/terms' as const },
  { label: 'Privacy Policy', route: '/legal/privacy' as const },
  { label: 'About Us', route: '/about' as const },
];

export default function ProfileScreen() {
  const authEmail = useAppStore((state) => state.authEmail);
  const isPremium = useAppStore((state) => state.isPremium);

  return (
    <Screen contentClassName="pt-4">
      <View className="flex-row items-center gap-4">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-orange">
          <LogoMark height={58} width={58} />
        </View>
        <View className="flex-1">
          <Text className="text-[42px] font-bold text-orange">Settings</Text>
          <Text className="text-base text-navyMuted">Marietta Baseball Academy</Text>
          <Text className="mt-1 text-sm text-navyMuted">{authEmail || 'guest@academy.com'}</Text>
        </View>
      </View>

      <View className="mt-5">
        <Card>
          <Text className="text-center text-sm uppercase tracking-[1.6px] text-[#A08E73]">Version 0.0.0</Text>
          <Text className="mt-2 text-center text-2xl font-bold text-navy">
            {isPremium ? 'Elite Access Enabled' : 'Free Access'}
          </Text>
        </Card>
      </View>

      <View className="mt-5 gap-3">
        {menuItems.map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.route)}>
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-navy">{item.label}</Text>
                <Ionicons color="#7A859E" name="chevron-forward" size={22} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
