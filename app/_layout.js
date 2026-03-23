import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { theme } from '../styles/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cardapio" />
        <Stack.Screen name="pagamento" />
        <Stack.Screen name="pedido-final" />
        <Stack.Screen name="conta" />
      </Stack>
    </>
  );
}
