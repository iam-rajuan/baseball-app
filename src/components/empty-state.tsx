import { Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="rounded-[28px] border border-dashed border-border bg-surface px-5 py-8">
      <Text className="text-center text-xl font-bold text-navy">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-6 text-navyMuted">{description}</Text>
    </View>
  );
}
