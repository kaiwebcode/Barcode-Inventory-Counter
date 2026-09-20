import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";

function CustomTabButton(props: any) {
  return (
    <HapticTab
      {...props}
      style={({ pressed }: { pressed: boolean }) => ({
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
          marginBottom: 0,
        },

        tabBarStyle: {
          position: "absolute",

          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 10),

          height: 72,

          paddingTop: 7,
          paddingBottom: Platform.OS === "ios" ? 7 : 6,

          borderRadius: 24,

          backgroundColor: "#FFFFFF",

          borderWidth: 1,
          borderColor: "#EEF0F4",

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.08,
          shadowRadius: 18,

          elevation: 10,
        },

        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },

        tabBarButton: CustomTabButton,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={23}
              color={focused ? "#2563EB" : "#9CA3AF"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",

          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "cube" : "cube-outline"}
              size={30}
              color={focused ? "#2563EB" : "#9CA3AF"}
            />
          ),
        }}
      />
    </Tabs>
  );
}