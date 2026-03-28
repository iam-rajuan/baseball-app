/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FAF4EA',
        surface: '#FFFFFF',
        navy: '#0C1F4A',
        navyMuted: '#5A6987',
        orange: '#F46A12',
        orangeSoft: '#FFE4D2',
        border: '#E9E0D2',
        success: '#1C9C5C',
        muted: '#F2EEE6',
      },
      boxShadow: {
        card: '0px 10px 30px rgba(12, 31, 74, 0.08)',
      },
      borderRadius: {
        '4xl': '32px',
      },
      fontSize: {
        hero: ['42px', '46px'],
      },
    },
  },
  plugins: [],
};
