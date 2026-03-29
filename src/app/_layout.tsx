import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import * as NavigationBar from 'expo-navigation-bar';
import { Platform, View } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { navigationTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => null);

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => null);

    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#F7F7F5');
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="situations/index" />
          <Stack.Screen name="situations/[id]" />
          <Stack.Screen name="drills/category/[slug]" />
          <Stack.Screen name="drills/detail/[id]" />
          <Stack.Screen name="premium/index" />
          <Stack.Screen name="auth/email" />
          <Stack.Screen name="auth/otp" />
          <Stack.Screen name="payment/index" />
          <Stack.Screen name="payment/success" />
          <Stack.Screen name="support" />
          <Stack.Screen name="legal/terms" />
          <Stack.Screen name="legal/privacy" />
          <Stack.Screen name="about" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
