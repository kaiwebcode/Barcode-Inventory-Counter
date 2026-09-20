import { Stack } from "expo-router";
import "react-native-reanimated";
import "./global.css";
import { useEffect } from "react";
import { initializeInventoryDatabase } from "@/database/inventory-db";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    initializeInventoryDatabase().catch((error) => {
      console.error("Failed to initialize inventory database:", error);
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
