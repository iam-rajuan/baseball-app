import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { PageHeader } from '@/components/layout/page-header';
import { paymentService } from '@/services';
import { useAppStore } from '@/store/app-store';

const schema = z.object({
  email: z.string().email(),
  cardNumber: z.string().min(16, 'Enter a valid card number'),
  expiry: z.string().min(4, 'MM/YY required'),
  cvv: z.string().min(3, 'CVV required'),
  country: z.string().min(2, 'Country is required'),
});

type FormValues = z.infer<typeof schema>;

export default function PaymentScreen() {
  const authEmail = useAppStore((state) => state.authEmail);
  const unlockPremium = useAppStore((state) => state.unlockPremium);
  const completeAuth = useAppStore((state) => state.completeAuth);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: authEmail || 'coach@academy.com',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/29',
      cvv: '123',
      country: 'United States',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    const result = await paymentService.submitMockPayment();
    if (result.success) {
      unlockPremium();
      completeAuth();
      router.replace('/payment/success');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4E7D5' }} edges={['top', 'left', 'right']}>
      <PageHeader title="Payment" />
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
            Unlock All Drills
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 10 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#0C1F4A' }}>$99</Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#5A4B3D', marginLeft: 4 }}>/ lifetime access</Text>
          </View>

          <View style={{ marginTop: 20, gap: 12 }}>
            {[
              'Full access to 150+ pro-level\nbaseball drills',
              'Personalized performance tracking',
              'Direct scouting reports access',
            ].map((item) => (
              <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <Ionicons name="checkmark-circle" size={20} color="#E35D21" style={{ marginTop: 1 }} />
                <Text style={{ fontSize: 14, lineHeight: 20, color: '#3A3F50', flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Information */}
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
            Payment Information
          </Text>

          {/* Email Address */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#3A3F50', marginBottom: 8 }}>
                  Email Address
                </Text>
                <View
                  style={{
                    backgroundColor: '#F5F1EA',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }}
                >
                  <TextInput
                    onChangeText={onChange}
                    placeholder="coach@academy.com"
                    placeholderTextColor="#B0B8C5"
                    value={value}
                    keyboardType="email-address"
                    style={{ fontSize: 15, color: '#0C1F4A' }}
                  />
                </View>
                {errors.email ? (
                  <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>{errors.email.message}</Text>
                ) : null}
              </View>
            )}
          />

          {/* Card Details Card */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              borderWidth: 1,
              borderColor: '#F0E8DB',
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 18,
            }}
          >
            {/* Card Number */}
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#5A4B3D', marginBottom: 6 }}>
                    Card Number
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="card-outline" size={20} color="#7C869B" />
                    <TextInput
                      onChangeText={onChange}
                      placeholder="4242 4242 4242 4242"
                      placeholderTextColor="#B0B8C5"
                      value={value}
                      keyboardType="number-pad"
                      style={{ fontSize: 15, color: '#0C1F4A', flex: 1 }}
                    />
                  </View>
                  {errors.cardNumber ? (
                    <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>{errors.cardNumber.message}</Text>
                  ) : null}
                </View>
              )}
            />

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: '#EDE6D9', marginVertical: 14 }} />

            {/* Expiry + CVV Row */}
            <View style={{ flexDirection: 'row' }}>
              <Controller
                control={control}
                name="expiry"
                render={({ field: { onChange, value } }) => (
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#5A4B3D', marginBottom: 6 }}>
                      Expiry
                    </Text>
                    <TextInput
                      onChangeText={onChange}
                      placeholder="MM / YY"
                      placeholderTextColor="#B0B8C5"
                      value={value}
                      keyboardType="number-pad"
                      style={{ fontSize: 15, color: '#0C1F4A' }}
                    />
                    {errors.expiry ? (
                      <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>{errors.expiry.message}</Text>
                    ) : null}
                  </View>
                )}
              />
              <View style={{ width: 1, backgroundColor: '#EDE6D9', marginHorizontal: 16 }} />
              <Controller
                control={control}
                name="cvv"
                render={({ field: { onChange, value } }) => (
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#5A4B3D', marginBottom: 6 }}>
                      CVV
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        onChangeText={onChange}
                        placeholder="123"
                        placeholderTextColor="#B0B8C5"
                        value={value}
                        keyboardType="number-pad"
                        secureTextEntry
                        style={{ fontSize: 15, color: '#0C1F4A', flex: 1 }}
                      />
                      <Ionicons name="help-circle-outline" size={18} color="#B0B8C5" />
                    </View>
                    {errors.cvv ? (
                      <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>{errors.cvv.message}</Text>
                    ) : null}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Country */}
          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#3A3F50', marginBottom: 8 }}>
                  Country or Region
                </Text>
                <View
                  style={{
                    backgroundColor: '#F5F1EA',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    onChangeText={onChange}
                    placeholder="United States"
                    placeholderTextColor="#B0B8C5"
                    value={value}
                    style={{ fontSize: 15, color: '#0C1F4A', flex: 1 }}
                  />
                  <Ionicons name="chevron-down" size={18} color="#7C869B" />
                </View>
                {errors.country ? (
                  <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>{errors.country.message}</Text>
                ) : null}
              </View>
            )}
          />

          {/* Pay Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={{
              backgroundColor: '#F28C28',
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF' }}>
              Pay $99
            </Text>
          </Pressable>

          {/* Secure Footer */}
          <View style={{ alignItems: 'center', marginTop: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="lock-closed" size={14} color="#7C869B" />
              <Text style={{ fontSize: 12.5, color: '#7C869B', fontWeight: '500' }}>
                Secure payment powered by Stripe
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
              <Ionicons name="card-outline" size={20} color="#9CAAC0" />
              <Ionicons name="business-outline" size={20} color="#9CAAC0" />
              <Ionicons name="globe-outline" size={20} color="#9CAAC0" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
