import { DefaultTheme } from '@react-navigation/native';

import { colors } from '@/constants/theme';

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.orange,
    text: colors.navy,
    border: colors.border,
    notification: colors.orange,
  },
};
