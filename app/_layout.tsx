import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack>
      <Stack.Screen name="(dashboard)" options={{ title: 'Test App' }} />
    </Stack>
  );
}