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
import { authService, getCustomerInfo, hasPremiumAccess, initRevenueCat } from '@/services';
import { useAppStore } from '@/store/app-store';
import { navigationTheme } from '@/theme';
import { CustomSplashScreen } from '@/components/custom-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => null);

export default function RootLayout() {
  const clearSession = useAppStore((state) => state.clearSession);
  const completeAuth = useAppStore((state) => state.completeAuth);
  const setPremium = useAppStore((state) => state.setPremium);
  const setSubscriptionReady = useAppStore((state) => state.setSubscriptionReady);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncRevenueCatState = async () => {
      try {
        await initRevenueCat();
        const customerInfo = await getCustomerInfo();

        if (!isMounted) {
          return;
        }

        setPremium(hasPremiumAccess(customerInfo));
      } catch {
        if (!isMounted) {
          return;
        }

        setPremium(false);
      } finally {
        if (isMounted) {
          setSubscriptionReady(true);
        }
      }
    };

    const bootstrapSession = async () => {
      // Hide the native splash immediately so our custom one shows
      await SplashScreen.hideAsync().catch(() => null);

      try {
        const token = await authService.getStoredToken();

        if (!token) {
          clearSession();
          return;
        }

        completeAuth();
      } catch {
        await authService.clearStoredToken().catch(() => null);
        clearSession();
      } finally {
        await syncRevenueCatState();

        // Wait a bit for the loading bar animation to complete
        setTimeout(() => {
          if (isMounted) {
            setIsReady(true);
          }
        }, 3200);
      }
    };

    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, completeAuth, setPremium, setSubscriptionReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');

       if (status === 'active') {
        void (async () => {
          try {
            const customerInfo = await getCustomerInfo();
            setPremium(hasPremiumAccess(customerInfo));
          } catch {
            setPremium(false);
          } finally {
            setSubscriptionReady(true);
          }
        })();
      }
    });

    return () => subscription.remove();
  }, [setPremium, setSubscriptionReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={isReady ? 'dark' : 'light'} backgroundColor={isReady ? '#FFFFFF' : '#0A1B40'} />
        {!isReady && <CustomSplashScreen />}
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
