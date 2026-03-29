import { Platform } from 'react-native';

export const typography = {
  family: {
    serif: Platform.select({ ios: 'Times New Roman', android: 'serif' }),
    sans: Platform.select({ ios: 'System', android: 'sans-serif' }),
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  sizes: {
    hero: 42,
    h1: 34,
    h2: 26,
    h3: 20,
    h4: 18,
    body: 14,
    caption: 12,
    eyebrow: 11,
    tiny: 10,
  },
  lineHeights: {
    hero: 44,
    h1: 36,
    h2: 30,
    h3: 26,
    h4: 24,
    body: 20,
    caption: 16,
    eyebrow: 14,
    tiny: 12,
  }
};
