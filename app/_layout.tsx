import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { CategoriesProvider } from "../context/CategoriesContext";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    r: require("../assets/fonts/Rubik-Black.ttf"),
    rb: require("../assets/fonts/Rubik-Bold.ttf"),
    rsb: require("../assets/fonts/Rubik-SemiBold.ttf"),
    reb: require("../assets/fonts/Rubik-ExtraBold.ttf"),
    rl: require("../assets/fonts/Rubik-Light.ttf"),
    rm: require("../assets/fonts/Rubik-Medium.ttf"),
    rr: require("../assets/fonts/Rubik-Regular.ttf"),
  });

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <ThemeProvider value={DefaultTheme}>
      <CategoriesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-new-category"
            options={{
              title: "Add New Category",
              headerShown: true,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="category-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="add-new-category-item"
            options={{
              title: "Add New Category",
              headerShown: true,
              presentation: "modal",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CategoriesProvider>
    </ThemeProvider>
  );
}
