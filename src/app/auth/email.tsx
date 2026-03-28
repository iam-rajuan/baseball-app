import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

import { Button } from '@/components/button';
import { Input } from '@/components/form/input';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { authService } from '@/services';
import { useAppStore } from '@/store/app-store';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function EmailScreen() {
  const setAuthEmail = useAppStore((state) => state.setAuthEmail);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: FormValues) => {
    await authService.sendCode(email);
    setAuthEmail(email);
    router.push('/auth/otp');
  };

  return (
    <Screen header={<PageHeader title="Drill Category" />} contentClassName="pt-8">
      <Text className="text-[42px] font-bold leading-[46px] text-navy">Enter Your Email</Text>
      <Text className="mt-2 text-lg text-navyMuted">We’ll send a verification code to continue</Text>
      <View className="mt-8 gap-5">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.email?.message}
              icon={<Ionicons color="#C7C4BE" name="mail-outline" size={22} />}
              keyboardType="email-address"
              label="Email Address"
              onChangeText={onChange}
              placeholder="example@email.com"
              value={value}
            />
          )}
        />
        <Button label="Send Code" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>
    </Screen>
  );
}
