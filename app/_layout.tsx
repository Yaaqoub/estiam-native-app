import { Stack, usePathname } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  const pathname = usePathname();

  const noSharedLayoutPaths = ['/auth/login', '/auth/register'];

  const isAuthPage = noSharedLayoutPaths.includes(pathname);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false}}>
        {
          isAuthPage ? (
            <Stack.Screen name="auth" />
          ) : (
            <Stack.Screen name="(dashboard)" />
          )
        }
      </Stack>
    </AuthProvider>
  );
}