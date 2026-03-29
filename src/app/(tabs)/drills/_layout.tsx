import { Stack } from 'expo-router';

export default function DrillsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="category/[slug]" />
      <Stack.Screen name="detail/[id]" />
    </Stack>
  );
}
