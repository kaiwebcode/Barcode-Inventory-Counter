import "react-native-reanimated";
import "./global.css";

import { Stack } from "expo-router";
import { useEffect } from "react";

import { initializeInventoryDatabase } from "@/database/inventory-db";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  useEffect(() => {
    initializeInventoryDatabase().catch((error) => {
      console.error(
        "Failed to initialize inventory database:",
        error
      );
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash / Entry screen */}
      <Stack.Screen name="index" />

      {/* Main application */}
      <Stack.Screen name="(tabs)" />

      {/* Modal */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}