import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import * as NavigationBar from 'expo-navigation-bar';
import { AppState, Platform } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { authService } from '@/services';
import { useAppStore } from '@/store/app-store';
import { navigationTheme } from '@/theme';
import { CustomSplashScreen } from '@/components/custom-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => null);

export default function RootLayout() {
  const hydrateSession = useAppStore((state) => state.hydrateSession);
  const clearSession = useAppStore((state) => state.clearSession);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrapSession = async () => {
      // Hide the native splash immediately so our custom one shows
      await SplashScreen.hideAsync().catch(() => null);

      try {
        const token = await authService.getStoredToken();

        if (!token) {
          clearSession();
          return;
        }

        const profile = await authService.getProfile();
        hydrateSession(profile);
      } catch {
        await authService.clearStoredToken().catch(() => null);
        clearSession();
      } finally {
        // Wait a bit for the loading bar animation to complete
        setTimeout(() => {
          setIsReady(true);
        }, 3200);
      }
    };

    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }

    void bootstrapSession();
  }, [clearSession, hydrateSession]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={isReady ? 'dark' : 'light'} backgroundColor={isReady ? '#FFFFFF' : '#0C1F4A'} />
        {!isReady && <CustomSplashScreen />}
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
