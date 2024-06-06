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

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    r: require("../assets/fonts/Rubik-Black.ttf"),
    rb: require("../assets/fonts/Rubik-Bold.ttf"),
    rsb: require("../assets/fonts/Rubik-SemiBold.ttf"),
    reb: require("../assets/fonts/Rubik-ExtraBold.ttf"),
    rl: require("../assets/fonts/Rubik-Light.ttf"),
    rm: require("../assets/fonts/Rubik-Medium.ttf"),
    rr: require("../assets/fonts/Rubik-Regular.ttf"),
  });

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-new-category"
          options={{
            title: "Add New Category",
            headerShown: true,
            presentation: "containedModal",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
