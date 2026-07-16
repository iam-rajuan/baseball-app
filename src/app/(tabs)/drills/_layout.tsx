import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function DrillsLayout() {
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
      <Stack.Screen name="category/[slug]" options={{ title: 'Drills' }} />
      <Stack.Screen name="detail/[id]" options={{ title: 'Drill Details' }} />
    </Stack>
  );
}
