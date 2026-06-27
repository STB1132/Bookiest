import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Isto evita que a pantalla de carga (splash screen) se esconda antes de tempo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Aquí cargas os teus arquivos de fontes e lles das un nome curto
   // 1. Aquí cargas os teus arquivos de fontes con dous saltos cara atrás (../../)
  const [loaded, error] = useFonts({
    'SofiaSansCondensed-Regular': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-Regular.ttf'),
    'SofiaSansCondensed-Bold': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-Bold.ttf'),
    'SofiaSansCondensed-SemiBold': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-SemiBold.ttf'),
  });


  // 2. Se hai un erro ou as fontes xa cargaron, dicímoslle á app que oculte a splash screen
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 3. Se as fontes aínda se están cargando, non amosamos nada aínda
  if (!loaded && !error) {
    return null;
  }

  // 4. Cando todo está listo, a app arranca coas túas pantallas
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

