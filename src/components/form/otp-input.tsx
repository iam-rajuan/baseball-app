import { useRef } from 'react';
import { TextInput, View } from 'react-native';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export function OTPInput({ value, onChange, length = 4 }: OtpInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);
  const values = Array.from({ length }, (_, index) => value[index] ?? '');

  return (
    <View className="flex-row justify-between gap-3">
      {values.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            refs.current[index] = ref;
          }}
          className="h-16 flex-1 rounded-[16px] border border-[#F0E8DB] bg-[#FFFFFF] text-center text-2xl font-black text-[#0C1F4A]"
          underlineColorAndroid="transparent"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(nextDigit) => {
            const next = value.split('');
            next[index] = nextDigit.replace(/[^0-9]/g, '');
            const merged = next.join('').slice(0, length);
            onChange(merged);

            if (nextDigit && index < length - 1) {
              refs.current[index + 1]?.focus();
            }
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          value={digit}
        />
      ))}
    </View>
  );
}
