import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/layout/page-header';
import { type PaymentPackageOption, paymentService } from '@/services';
import { useAppStore } from '@/store/app-store';

export default function PaymentScreen() {
  const isPremium = useAppStore((state) => state.isPremium);
  const setPremium = useAppStore((state) => state.setPremium);
  const [lifetimePackage, setLifetimePackage] = useState<PaymentPackageOption | null>(null);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [screenMessage, setScreenMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      try {
        setIsLoadingPackages(true);
        setScreenError(null);
        const lifetime = await paymentService.getLifetimePackage();

        if (!isMounted) {
          return;
        }

        setLifetimePackage(lifetime);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setScreenError(error instanceof Error ? error.message : 'Unable to load the lifetime purchase option.');
      } finally {
        if (isMounted) {
          setIsLoadingPackages(false);
        }
      }
    };

    void loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  const activatePremiumAccess = async (action: () => Promise<Awaited<ReturnType<typeof paymentService.purchasePackage>>>) => {
    setScreenError(null);
    setScreenMessage(null);

    const result = await action();

    if (result.status === 'success') {
      setPremium(true);
      router.replace('/payment/success');
      return;
    }

    if (result.status === 'cancelled') {
      setScreenMessage(result.message ?? 'Purchase cancelled.');
      return;
    }

    setScreenError(result.message ?? 'Premium access is not active yet.');
  };

  const handlePurchase = async () => {
    if (isPremium) {
      setScreenMessage('Your lifetime premium access is already active.');
      setScreenError(null);
      return;
    }

    if (!lifetimePackage) {
      setScreenError('The lifetime purchase option is not available right now.');
      return;
    }

    try {
      setIsProcessingPurchase(true);
      await activatePremiumAccess(() => paymentService.purchasePackage(lifetimePackage.package));
    } catch (error) {
      setScreenError(
        error instanceof Error ? error.message : 'Purchase could not be completed. Please try again.',
      );
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoringPurchases(true);
      await activatePremiumAccess(() => paymentService.restorePurchase());
    } catch (error) {
      setScreenError(
        error instanceof Error ? error.message : 'Restore could not be completed. Please try again.',
      );
    } finally {
      setIsRestoringPurchases(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4E7D5' }} edges={['left', 'right']}>
      <PageHeader title="Membership" variant="section" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        style={{ flex: 1, backgroundColor: '#F4E7D5' }}
      >
        {/* Selected Plan Card */}
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#F0E8DB',
            paddingHorizontal: 22,
            paddingVertical: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 10.5, fontWeight: '700', letterSpacing: 1.4, color: '#B49E81', textTransform: 'uppercase' }}>
              Selected Plan
            </Text>
            <View
              style={{
                backgroundColor: '#FFF3E6',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#E35D21', letterSpacing: 1, textTransform: 'uppercase' }}>
                Elite Access
              </Text>
            </View>
          </View>

          <Text
            style={{
              marginTop: 14,
              fontSize: 28,
              fontWeight: '800',
              color: '#0C1F4A',
              lineHeight: 32,
            }}
          >
            Lifetime Premium{'\n'}Access
          </Text>

          <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: '#5A4B3D' }}>
            Unlock all premium drills with a one-time purchase.
          </Text>

          <View style={{ marginTop: 20, gap: 12 }}>
            {[
              'Access every premium drill and position-specific training pack',
              'Restore your purchase any time on a new device',
              'Premium status stays in sync with your App Store or Google Play account',
            ].map((item) => (
              <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <Ionicons name="checkmark-circle" size={20} color="#E35D21" style={{ marginTop: 1 }} />
                <Text style={{ fontSize: 14, lineHeight: 20, color: '#3A3F50', flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.6,
              color: '#0C1F4A',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            One-time purchase
          </Text>

          {isLoadingPackages ? (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#F0E8DB',
                paddingHorizontal: 16,
                paddingVertical: 24,
                alignItems: 'center',
              }}
            >
              <ActivityIndicator color="#E35D21" />
              <Text style={{ marginTop: 12, fontSize: 14, color: '#5A4B3D', fontWeight: '600' }}>
                Loading purchase option...
              </Text>
            </View>
          ) : screenError && !lifetimePackage ? (
            <View style={{ marginBottom: 24 }}>
              <EmptyState
                title="Purchase unavailable"
                description={screenError}
              />
            </View>
          ) : lifetimePackage ? (
            <View style={{ gap: 14, marginBottom: 24 }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: '#E35D21',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  shadowColor: '#D97706',
                  shadowOpacity: 0.08,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#FFF5E8',
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginBottom: 14,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#D66A1D', letterSpacing: 1, textTransform: 'uppercase' }}>
                        Lifetime Access
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '800',
                        color: '#0C1F4A',
                        lineHeight: 23,
                      }}
                    >
                      {lifetimePackage.title}
                    </Text>
                    <Text style={{ marginTop: 8, fontSize: 13, color: '#7C869B', fontWeight: '700' }}>
                      {lifetimePackage.billingLabel}
                    </Text>
                    <Text style={{ marginTop: 14, fontSize: 15, lineHeight: 22, color: '#5A4B3D' }}>
                      {lifetimePackage.description}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', flexShrink: 0, maxWidth: '48%' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#B49E81',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}
                    >
                      Price
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '900',
                        color: '#0C1F4A',
                        textAlign: 'right',
                        lineHeight: 24,
                      }}
                      numberOfLines={2}
                    >
                      {lifetimePackage.priceString}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {screenError && lifetimePackage ? (
            <View
              style={{
                marginBottom: 16,
                backgroundColor: '#FFF3F0',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#F7C9BC',
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <Ionicons name="alert-circle" size={18} color="#C24F33" style={{ marginTop: 1 }} />
              <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: '#8A3822', fontWeight: '600' }}>
                {screenError}
              </Text>
            </View>
          ) : null}

          {screenMessage ? (
            <View
              style={{
                marginBottom: 16,
                backgroundColor: '#FFF7ED',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#FFEDD5',
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <Ionicons name="information-circle" size={18} color="#C2410C" style={{ marginTop: 1 }} />
              <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: '#9A3412', fontWeight: '600' }}>
                {screenMessage}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={() => {
              void handlePurchase();
            }}
            disabled={
              isPremium ||
              isLoadingPackages ||
              isProcessingPurchase ||
              isRestoringPurchases ||
              !lifetimePackage
            }
            style={{
              backgroundColor: isPremium ? '#2F9E44' : '#F28C28',
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity:
                isPremium ||
                isLoadingPackages ||
                isProcessingPurchase ||
                isRestoringPurchases ||
                !lifetimePackage
                  ? 0.6
                  : 1,
            }}
          >
            {isProcessingPurchase ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF' }}>
                {isPremium
                  ? 'Lifetime Premium Active'
                  : lifetimePackage
                    ? 'Buy Lifetime Premium Access'
                    : 'Unavailable'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              void handleRestore();
            }}
            disabled={isLoadingPackages || isProcessingPurchase || isRestoringPurchases}
            style={{
              marginTop: 14,
              borderRadius: 28,
              paddingVertical: 15,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: '#D0C7B9',
              backgroundColor: '#FFFFFF',
              opacity: isLoadingPackages || isProcessingPurchase || isRestoringPurchases ? 0.6 : 1,
            }}
          >
            {isRestoringPurchases ? (
              <ActivityIndicator color="#0C1F4A" />
            ) : (
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#0C1F4A' }}>
                Restore Previous Purchase
              </Text>
            )}
          </Pressable>

          <View style={{ alignItems: 'center', marginTop: 22 }}>
            <Text style={{ fontSize: 12.5, color: '#7C869B', fontWeight: '500', textAlign: 'center', lineHeight: 18 }}>
              Your purchase is managed by the App Store or Google Play. Restore anytime if you reinstall the app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
