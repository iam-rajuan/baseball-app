import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { navigationTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => null);

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => null);

    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
