import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/components/layout/page-header';
import { LogoMark } from '@/components/logo-mark';

const menuItems = [
  {
    label: 'Help & support',
    route: '/(tabs)/settings/support' as const,
    icon: 'help-circle-outline' as const,
  },
  {
    label: 'Terms & Conditions',
    route: '/(tabs)/settings/terms' as const,
    icon: 'document-text-outline' as const,
  },
  {
    label: 'Privacy Policy',
    route: '/(tabs)/settings/privacy' as const,
    icon: 'shield-checkmark-outline' as const,
  },
  {
    label: 'About Us',
    route: '/(tabs)/settings/about' as const,
    icon: 'information-circle-outline' as const,
  },
];

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <PageHeader title="SETTINGS" variant="section" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Logo Section */}
        <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 10 }}>
          <LogoMark height={96} width={96} />

          <Text
            style={{
              marginTop: 20,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: '900',
              textTransform: 'uppercase',
              color: '#0C1F4A',
              lineHeight: 28,
              letterSpacing: 0.3,
            }}
          >
            Marietta Baseball{'\n'}Academy
          </Text>
          <Text
            style={{
              marginTop: 14,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 2.5,
              color: '#B0B8C5',
              textTransform: 'uppercase',
            }}
          >
            Version 0.0.0
          </Text>
        </View>

        {/* Divider */}
        <View style={{ marginTop: 28, marginHorizontal: 20, height: 1, backgroundColor: '#EDE6D9' }} />

        {/* Information & Legal Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text
            style={{
              fontSize: 11.5,
              fontWeight: '700',
              letterSpacing: 1.5,
              color: '#C25A10',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            Information & Legal
          </Text>

          <View style={{ gap: 14 }}>
            {menuItems.map((item) => (
              <Pressable key={item.label} onPress={() => router.push(item.route)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: '#F0E8DB',
                  }}
                >
                  <View
                    style={{
                      height: 42,
                      width: 42,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      backgroundColor: '#F5F3EE',
                    }}
                  >
                    <Ionicons color="#0C1F4A" name={item.icon} size={22} />
                  </View>
                  <Text
                    style={{
                      marginLeft: 16,
                      flex: 1,
                      fontSize: 15.5,
                      fontWeight: '700',
                      color: '#0C1F4A',
                    }}
                  >
                    {item.label}
                  </Text>
                  <Ionicons color="#D0C7B9" name="chevron-forward" size={18} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 2,
              color: '#C0C6CE',
              textTransform: 'uppercase',
            }}
          >
            Apex Athletics Performance Systems
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
