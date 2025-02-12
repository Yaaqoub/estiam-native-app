import { Stack, useNavigation } from 'expo-router';
import { Button } from 'react-native';

export default function AuthLayout() {
  const navigation = useNavigation();

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerLeft: () => (
            <Button title="Back" onPress={() => navigation.goBack()} />
          )
        }}
      />
    </Stack>
  );
}