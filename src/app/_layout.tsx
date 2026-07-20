import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SofiaSansCondensed-Regular': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-Regular.ttf'),
    'SofiaSansCondensed-Bold': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-Bold.ttf'),
    'SofiaSansCondensed-SemiBold': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-SemiBold.ttf'),
    'SofiaSansCondensed-Medium': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-Medium.ttf'),
    'SofiaSansCondensed-Light': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-Light.ttf'),
    'SofiaSansCondensed-ExtraLight': require('../../assets/fonts/Sofia_Sans_Condensed/static/SofiaSansCondensed-ExtraLight.ttf'),
  });

  useEffect(() => {
    if (error) console.error("Font loading error:", error);
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}