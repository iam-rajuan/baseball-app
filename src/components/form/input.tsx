import type { ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';

type InputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  secureTextEntry?: boolean;
  icon?: ReactNode;
  multiline?: boolean;
  error?: string;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  icon,
  multiline = false,
  error,
}: InputProps) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-bold uppercase tracking-[1.4px] text-[#918A85]">{label}</Text>
      <View className="rounded-[22px] border border-[#ECE5DA] bg-surface px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TextInput
            className={`flex-1 text-base text-navy ${multiline ? 'min-h-[112px]' : ''}`}
            keyboardType={keyboardType}
            multiline={multiline}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#C5C0B8"
            secureTextEntry={secureTextEntry}
            textAlignVertical={multiline ? 'top' : 'center'}
            value={value}
          />
          {icon}
        </View>
      </View>
      {error ? <Text className="text-sm text-[#C24F33]">{error}</Text> : null}
    </View>
  );
}
