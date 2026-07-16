import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'default',
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerTintColor: '#1F3A5F',
        headerTitleAlign: 'center',
        headerTransparent: Platform.OS === 'ios',
        headerBlurEffect: Platform.OS === 'ios' ? 'systemChromeMaterial' : undefined,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="support" options={{ title: 'Help & Support' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="terms" options={{ title: 'Terms & Conditions' }} />
      <Stack.Screen name="about" options={{ title: 'About Us' }} />
    </Stack>
  );
}
