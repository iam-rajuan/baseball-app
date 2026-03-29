import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View, Image } from 'react-native';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '@/components/form/input';
import { Button } from '@/components/button';
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
    <Screen header={<PageHeader title="Help & support" />} contentClassName="pt-8 px-5 bg-[#F7F7F5]">
      <View className="items-center mb-8">
        <View className="h-44 w-full items-center justify-center">
            {/* Fallback support placeholder if image is not present */}
            <View className="h-32 w-32 rounded-full bg-[#FFEED9] items-center justify-center border-4 border-white shadow-xl">
               <Ionicons name="headset" size={64} color="#F28C28" />
            </View>
            <View className="absolute top-4 right-1/4 h-12 w-12 rounded-full bg-white items-center justify-center shadow-md">
               <Ionicons name="chatbubbles" size={24} color="#1E3A8A" />
            </View>
        </View>
        <Text className="mt-4 text-center text-[15px] font-bold text-[#FCF4D0]">
          Hello, how can we assist you?
        </Text>
      </View>

      <View className="gap-5">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
               <Input
                 label="Title"
                 error={errors.title?.message}
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
                   label="Write in bellow box"
                   error={errors.body?.message}
                   multiline
                   onChangeText={onChange}
                   placeholder="Write here..."
                   value={value}
                 />
          )}
        />
        <View className="mt-4">
             <Button
               label="Submit"
               onPress={handleSubmit(() => {
                 reset();
               })}
             />
        </View>
      </View>
    </Screen>
  );
}
