import type { PropsWithChildren, ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  header?: ReactNode;
  scrollable?: boolean;
  contentClassName?: string;
  contentStyle?: ViewStyle;
}>;

export function Screen({
  children,
  header,
  scrollable = true,
  contentClassName = '',
  contentStyle,
}: ScreenProps) {
  const content = (
    <View className={`flex-1 bg-background px-5 pb-8 ${contentClassName}`.trim()} style={contentStyle}>{children}</View>
  );

  return (
    <View className="flex-1 bg-background">
      {header}
      {scrollable ? <ScrollView showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
    </View>
  );
}
