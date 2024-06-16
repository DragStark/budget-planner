import { Stack } from "expo-router";

import { useEffect, useCallback } from "react";
import "react-native-reanimated";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="budget-plan" options={{ headerShown: false }} />
      <Stack.Screen name="plan-tracking" options={{ headerShown: false }} />
      <Stack.Screen
        name="installment-tracking"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="installment" options={{ headerShown: false }} />
    </Stack>
  );
}
