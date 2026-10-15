import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AlunosProvider } from '../context/AlunosContext';

function Rotas() {
  const { usuario } = useAuth();
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="index" />
        </Stack.Protected>
        <Stack.Protected guard={!!usuario}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AlunosProvider>
        <Rotas />
      </AlunosProvider>
    </AuthProvider>
  );
}
