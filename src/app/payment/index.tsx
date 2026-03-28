import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/form/input';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
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
    <Screen header={<PageHeader title="Payment" />} contentClassName="pt-5">
      <Card>
        <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
          Selected Plan
        </Text>
        <View className="mt-3 flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-[40px] font-bold leading-[42px] text-navy">Unlock All Drills</Text>
          <Badge label="Elite Access" tone="premium" />
        </View>
        <Text className="mt-3 text-[36px] font-bold text-navy">$99</Text>
        <Text className="-mt-1 text-sm text-navyMuted">/ lifetime access</Text>
        <View className="mt-4 gap-3">
          {[
            'Full access to 150+ pro-level baseball drills',
            'Personalized performance tracking',
            'Direct scouting reports access',
          ].map((item) => (
            <Text key={item} className="text-sm leading-6 text-navy">
              • {item}
            </Text>
          ))}
        </View>
      </Card>

      <View className="mt-6 gap-4">
        <Text className="text-[11px] font-bold uppercase tracking-[1.4px] text-[#B49E81]">
          Payment Information
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.email?.message}
              label="Email Address"
              onChangeText={onChange}
              placeholder="coach@academy.com"
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="cardNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.cardNumber?.message}
              icon={<Ionicons color="#7C869B" name="card-outline" size={22} />}
              keyboardType="number-pad"
              label="Card Number"
              onChangeText={onChange}
              placeholder="4242 4242 4242 4242"
              value={value}
            />
          )}
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="expiry"
              render={({ field: { onChange, value } }) => (
                <Input
                  error={errors.expiry?.message}
                  keyboardType="number-pad"
                  label="Expiry"
                  onChangeText={onChange}
                  placeholder="MM / YY"
                  value={value}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="cvv"
              render={({ field: { onChange, value } }) => (
                <Input
                  error={errors.cvv?.message}
                  keyboardType="number-pad"
                  label="CVV"
                  onChangeText={onChange}
                  placeholder="123"
                  value={value}
                />
              )}
            />
          </View>
        </View>
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.country?.message}
              label="Country or Region"
              onChangeText={onChange}
              placeholder="United States"
              value={value}
            />
          )}
        />
        <Button label="Pay $99" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        <Text className="text-center text-sm text-navyMuted">Secure payment powered by Stripe</Text>
      </View>
    </Screen>
  );
}
