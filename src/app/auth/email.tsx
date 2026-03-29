import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { PageHeader } from '@/components/layout/page-header';
import { LogoMark } from '@/components/logo-mark';
import { authService } from '@/services';
import { useAppStore } from '@/store/app-store';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function EmailScreen() {
  const setAuthEmail = useAppStore((state) => state.setAuthEmail);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema),
  });

  const emailValue = watch('email');

  const onSubmit = async ({ email }: FormValues) => {
    await authService.sendCode(email);
    setAuthEmail(email);
    router.push('/auth/otp');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF4EA' }}>
      <PageHeader title="Sign In" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, paddingHorizontal: 18 }}>
            {/* Top Spacing + Logo */}
            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 24 }}>
              <LogoMark height={100} width={100} />
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 32,
                fontWeight: '900',
                color: '#0C1F4A',
                lineHeight: 38,
              }}
            >
              Enter Your{'\n'}Email Address
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                marginTop: 12,
                fontSize: 15,
                color: '#7D869A',
                lineHeight: 22,
              }}
            >
              We'll send a 4-digit verification code to your email to continue.
            </Text>

            {/* Email Input */}
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: '#9CAAC0',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 14,
                      paddingHorizontal: 16,
                      height: 54,
                      borderWidth: 1.5,
                      borderColor: errors.email
                        ? '#E35D21'
                        : value.length > 0
                          ? '#0C1F4A'
                          : '#E8DFD1',
                    }}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={value.length > 0 ? '#0C1F4A' : '#B0B8C5'}
                    />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="email"
                      autoFocus
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="example@email.com"
                      placeholderTextColor="#C5C9D2"
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        fontSize: 16,
                        color: '#0C1F4A',
                        fontWeight: '500',
                        paddingVertical: 0,
                      }}
                      value={value}
                    />
                    {value.length > 0 && (
                      <Pressable onPress={() => onChange('')}>
                        <Ionicons name="close-circle" size={20} color="#B0B8C5" />
                      </Pressable>
                    )}
                  </View>
                )}
              />

              {/* Error */}
              {errors.email && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
                  <Ionicons name="alert-circle" size={14} color="#E35D21" />
                  <Text style={{ fontSize: 13, color: '#E35D21', fontWeight: '600' }}>
                    {errors.email.message}
                  </Text>
                </View>
              )}

              {/* Live email preview */}
              {emailValue.length > 0 && !errors.email && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={14} color="#22A06B" />
                  <Text style={{ fontSize: 13, color: '#22A06B', fontWeight: '600' }}>
                    Code will be sent to{' '}
                    <Text style={{ fontWeight: '800' }}>{emailValue}</Text>
                  </Text>
                </View>
              )}
            </View>

            {/* Send Button */}
            <Pressable
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              style={{
                marginTop: 24,
                height: 56,
                borderRadius: 14,
                backgroundColor: '#0C1F4A',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    letterSpacing: 0.5,
                  }}
                >
                  Send Verification Code
                </Text>
              )}
            </Pressable>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 24,
                marginBottom: 20,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: '#E8DFD1' }} />
              <Text
                style={{
                  fontSize: 12,
                  color: '#B0B8C5',
                  fontWeight: '600',
                  marginHorizontal: 16,
                }}
              >
                OR
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E8DFD1' }} />
            </View>

            {/* Restore Button */}
            <Pressable
              onPress={() => { }}
              style={{
                height: 52,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: '#D0C7B9',
                backgroundColor: '#FFFFFF',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#0C1F4A',
                }}
              >
                Restore Previous Purchase
              </Text>
            </Pressable>

            {/* Footer Note */}
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="lock-closed" size={13} color="#B0B8C5" />
                <Text style={{ fontSize: 12, color: '#B0B8C5', fontWeight: '500' }}>
                  Your data is private and secure
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
