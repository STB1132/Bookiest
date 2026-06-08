import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    /* 
      Este comando 'headerShown: false' dille a Expo que apague 
      a barra superior de todas as pantallas da aplicación.
    */
    <Stack screenOptions={{ headerShown: false }} />
  );
}
