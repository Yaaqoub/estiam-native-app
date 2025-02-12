import {Stack, usePathname} from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();

  const noSharedLayoutPaths = ['/auth/login', '/auth/register'];

  const isAuthPage = noSharedLayoutPaths.includes(pathname);

  return isAuthPage ? (<Stack />) : (
    <Stack>
      <Stack.Screen name="(dashboard)" options={{ title: 'Test App' }} />
    </Stack>
  );
}