import { Stack, usePathname } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { auth, firestore } from '@/configs/firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { registerForPushNotificationsAsync } from '@/utils/pushNotifications';

export default function RootLayout() {
  const pathname = usePathname();

  const noSharedLayoutPaths = ['/auth/login', '/auth/register'];
  const isAuthPage = noSharedLayoutPaths.includes(pathname);

  const testDatabase = async () => {
    try {
      await setDoc(doc(firestore, 'users', 'test'), {
        firstName: 'test1',
        lastName: 'test2',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const testNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();

      if (token) {
        console.log(token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    testNotifications();
  }, []);

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