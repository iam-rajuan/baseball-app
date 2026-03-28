import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const classes = {
    primary: 'bg-orange',
    secondary: 'border border-border bg-surface',
    ghost: 'bg-transparent',
  };

  const textClasses = {
    primary: 'text-surface',
    secondary: 'text-navy',
    ghost: 'text-orange',
  };

  return (
    <Pressable
      className={`items-center justify-center rounded-full px-6 py-4 ${classes[variant]} ${
        disabled ? 'opacity-60' : ''
      }`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#0C1F4A'} />
      ) : (
        <Text className={`text-base font-semibold tracking-[0.6px] ${textClasses[variant]}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
