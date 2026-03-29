import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { PageHeader } from '@/components/layout/page-header';

const supportImage = require('../../../../assets/images/support-illustration.png');

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  body: z.string().min(10, 'Add more detail'),
});

type FormValues = z.infer<typeof schema>;

export default function SupportScreen() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: '', body: '' },
    resolver: zodResolver(schema),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF4EA' }} edges={['top', 'left', 'right']}>
      <PageHeader title="Help & support" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        style={{ flex: 1, backgroundColor: '#FAF4EA' }}
      >
        {/* Illustration */}
        <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 4 }}>
          <Image
            source={supportImage}
            style={{ width: 220, height: 180 }}
            contentFit="contain"
          />
          <Text
            style={{
              marginTop: 8,
              fontSize: 15,
              fontWeight: '700',
              color: '#F5CA7B',
              textAlign: 'center',
            }}
          >
            Hello, how can we assist you?
          </Text>
        </View>

        {/* Form */}
        <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
          {/* Title Field */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: '#0C1F4A',
                    marginBottom: 10,
                  }}
                >
                  Title
                </Text>
                <TextInput
                  onChangeText={onChange}
                  placeholder="Enter the title of your issue"
                  placeholderTextColor="#B0B8C5"
                  value={value}
                  style={{
                    fontSize: 15,
                    color: '#0C1F4A',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E8DFD1',
                    paddingBottom: 12,
                    paddingTop: 4,
                  }}
                />
                {errors.title ? (
                  <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>
                    {errors.title.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Body Field */}
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: '#0C1F4A',
                    marginBottom: 10,
                  }}
                >
                  Write in bellow box
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#E8A94E',
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    minHeight: 140,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <TextInput
                    onChangeText={onChange}
                    placeholder="Write here..."
                    placeholderTextColor="#B0B8C5"
                    value={value}
                    multiline
                    textAlignVertical="top"
                    style={{
                      fontSize: 15,
                      color: '#0C1F4A',
                      flex: 1,
                      minHeight: 110,
                    }}
                  />
                </View>
                {errors.body ? (
                  <Text style={{ fontSize: 12, color: '#C24F33', marginTop: 4 }}>
                    {errors.body.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
