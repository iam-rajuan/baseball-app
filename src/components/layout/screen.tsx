import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  header?: ReactNode;
  scrollable?: boolean;
  contentClassName?: string;
}>;

export function Screen({
  children,
  header,
  scrollable = true,
  contentClassName = '',
}: ScreenProps) {
  const content = (
    <View className={`flex-1 bg-background px-5 pb-8 ${contentClassName}`.trim()}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {header}
      {scrollable ? <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}
