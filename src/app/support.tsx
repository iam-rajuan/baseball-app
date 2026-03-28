import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/button';
import { Input } from '@/components/form/input';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';

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
    <Screen header={<PageHeader title="Help & support" />} contentClassName="pt-8">
      <View className="items-center">
        <View className="h-40 w-56 items-center justify-center rounded-[32px] bg-orangeSoft">
          <Text className="text-center text-5xl">🧑‍💻</Text>
          <Text className="mt-3 text-center text-base font-semibold text-orange">
            Hello, how can we assist you?
          </Text>
        </View>
      </View>
      <View className="mt-8 gap-5">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.title?.message}
              label="Title"
              onChangeText={onChange}
              placeholder="Enter the title of your issue"
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, value } }) => (
            <Input
              error={errors.body?.message}
              label="Write in bellow box"
              multiline
              onChangeText={onChange}
              placeholder="Write here..."
              value={value}
            />
          )}
        />
        <Button
          label="Submit"
          onPress={handleSubmit(() => {
            reset();
          })}
        />
      </View>
    </Screen>
  );
}
