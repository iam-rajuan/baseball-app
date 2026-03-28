import { Text, View } from 'react-native';

type FieldDiagramProps = {
  variant?: 'infield' | 'outfield';
};

export function FieldDiagram({ variant = 'infield' }: FieldDiagramProps) {
  const outfield = variant === 'outfield';

  return (
    <View className="items-center">
      <View className="relative h-52 w-72 items-center justify-end overflow-hidden rounded-t-[140px] rounded-b-[36px] border-[8px] border-[#2F7A36] bg-[#4FAE57]">
        <View className="absolute bottom-8 h-28 w-28 rotate-45 rounded-[18px] border-[6px] border-[#D8B07C] bg-[#C98D4A]" />
        <View className="absolute bottom-5 h-6 w-6 rounded-full bg-[#F4E9D6]" />
        {['LF', 'CF', 'RF'].map((label, index) => (
          <View
            key={label}
            className="absolute rounded-full bg-[#173D1E] px-2 py-1"
            style={{
              top: outfield ? 24 : 36,
              left: index === 0 ? 40 : index === 1 ? 126 : 210,
            }}
          >
            <Text className="text-[10px] font-bold text-surface">{label}</Text>
          </View>
        ))}
        {['3B', 'SS', '2B', '1B', 'P', 'C'].map((label, index) => (
          <View
            key={label}
            className="absolute rounded-full bg-[#173D1E] px-2 py-1"
            style={{
              top: [118, 96, 96, 118, 145, 182][index],
              left: [64, 96, 160, 192, 128, 128][index],
            }}
          >
            <Text className="text-[10px] font-bold text-surface">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
