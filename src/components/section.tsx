import type { PropsWithChildren, ReactNode } from 'react';
import { Text, View } from 'react-native';

type SectionProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}>;

export function Section({ eyebrow, title, action, children }: SectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-end justify-between">
        <View className="flex-1">
          {eyebrow ? (
            <Text className="mb-1 text-[10px] font-bold uppercase tracking-[1.6px] text-[#B39D7A]">
              {eyebrow}
            </Text>
          ) : null}
          <Text className="text-[28px] font-bold leading-8 text-navy">{title}</Text>
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}
