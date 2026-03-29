import { Text, View } from 'react-native';

type StepDirectionProps = {
  index: number;
  text: string;
};

export function StepDirection({ index, text }: StepDirectionProps) {
  return (
    <View className="flex-row items-start gap-4">
      <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-navy mt-[-3px]">
        <Text className="text-[12px] font-bold text-surface">{index}</Text>
      </View>
      <Text className="flex-1 text-[15px] font-medium leading-[24px] text-navy">
        {text}
      </Text>
    </View>
  );
}
