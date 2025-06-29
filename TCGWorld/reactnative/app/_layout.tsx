import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { GlobalContextProvider } from '@/context/GlobalContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalContextProvider>
     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[code]" />
        <Stack.Screen name="register/[code]" />
        <Stack.Screen name="item" options={{ headerShown: false }}/>
        <Stack.Screen name="item/[item_id]" />
        <Stack.Screen name="purchase/[store_id]" />
        <Stack.Screen name="+not-found" />
        

        </Stack>
       <StatusBar style="auto" />
      </ThemeProvider>
    </GlobalContextProvider>
  );
}
