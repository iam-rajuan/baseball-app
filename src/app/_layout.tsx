import '../global.css';

import * as ScreenCapture from 'expo-screen-capture';
import { ThemeProvider } from '@react-navigation/native';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import * as NavigationBar from 'expo-navigation-bar';
import { AppState, LogBox, Platform } from 'react-native';

import { queryClient } from '@/lib/query-client';
import {
  addRevenueCatCustomerInfoListener,
  authService,
  hasPremiumAccess,
  identifyRevenueCatUser,
  initRevenueCat,
  refreshCustomerInfo,
} from '@/services';
import { useAppStore } from '@/store/app-store';
import { navigationTheme } from '@/theme';
import { CustomSplashScreen } from '@/components/custom-splash-screen';
import { ServerDownModal } from '@/components/server-down-modal';

// Toggle screenshot prevention globally (set to true to prevent screenshots, false to allow)
const SCREENSHOT_PREVENTION_ENABLED = true;

SplashScreen.preventAutoHideAsync().catch(() => null);
LogBox.ignoreLogs([
  "Passing an object as the argument to 'navigate' is deprecated. Use 'navigate(name, params, options)' instead.",
]);

export default function RootLayout() {
  const clearSession = useAppStore((state) => state.clearSession);
  const authEmail = useAppStore((state) => state.authEmail);
  const hydrateSession = useAppStore((state) => state.hydrateSession);
  const setPremium = useAppStore((state) => state.setPremium);
  const setSubscriptionReady = useAppStore((state) => state.setSubscriptionReady);
  const shouldShowServerDownNotice = useAppStore((state) => state.shouldShowServerDownNotice);
  const acknowledgeServerDownNotice = useAppStore((state) => state.acknowledgeServerDownNotice);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (SCREENSHOT_PREVENTION_ENABLED) {
      void ScreenCapture.preventScreenCaptureAsync();
    } else {
      void ScreenCapture.allowScreenCaptureAsync();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const applyCustomerInfo = (isPremiumActive: boolean) => {
      if (!isMounted) {
        return;
      }

      setPremium(isPremiumActive);
      setSubscriptionReady(true);
    };

    const syncRevenueCatState = async () => {
      try {
        await initRevenueCat();
        const customerInfo = await refreshCustomerInfo();
        applyCustomerInfo(hasPremiumAccess(customerInfo));
      } catch {
        applyCustomerInfo(false);
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

        const profile = await authService.getProfile();
        hydrateSession({ email: profile.email });
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

    const removeCustomerInfoListener = addRevenueCatCustomerInfoListener((customerInfo) => {
      applyCustomerInfo(hasPremiumAccess(customerInfo));
    });

    void bootstrapSession();

    return () => {
      isMounted = false;
      removeCustomerInfoListener();
    };
  }, [clearSession, hydrateSession, setPremium, setSubscriptionReady]);

  useEffect(() => {
    if (!authEmail) {
      return;
    }

    void (async () => {
      try {
        await identifyRevenueCatUser(authEmail);
        const customerInfo = await refreshCustomerInfo();
        setPremium(hasPremiumAccess(customerInfo));
      } catch {
        // Keep the app usable even if RevenueCat identity sync fails.
      } finally {
        setSubscriptionReady(true);
      }
    })();
  }, [authEmail, setPremium, setSubscriptionReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');

       if (status === 'active') {
        void (async () => {
          try {
            const customerInfo = await refreshCustomerInfo();
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
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen
            name="situations/[id]"
            options={{
              animation: 'default',
              headerShown: true,
              title: 'Situation',
              headerBackButtonDisplayMode: 'minimal',
              headerShadowVisible: false,
              headerTintColor: '#1F3A5F',
              headerTitleAlign: 'center',
              headerTransparent: Platform.OS === 'ios',
              headerBlurEffect: Platform.OS === 'ios' ? 'systemChromeMaterial' : undefined,
            }}
          />
        </Stack>
        <ServerDownModal
          visible={shouldShowServerDownNotice}
          onClose={acknowledgeServerDownNotice}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
