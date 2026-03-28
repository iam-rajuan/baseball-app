import { Text, View } from 'react-native';

type BadgeProps = {
  label: string;
  tone?: 'default' | 'premium' | 'success';
};

export function Badge({ label, tone = 'default' }: BadgeProps) {
  const tones = {
    default: 'bg-[#E8EDF6] text-navyMuted',
    premium: 'bg-orangeSoft text-orange',
    success: 'bg-[#DCF6E7] text-success',
  };

  return (
    <View className={`self-start rounded-full px-3 py-1 ${tones[tone].split(' ')[0]}`}>
      <Text className={`text-[10px] font-bold uppercase tracking-[1.2px] ${tones[tone].split(' ')[1]}`}>
        {label}
      </Text>
    </View>
  );
}
