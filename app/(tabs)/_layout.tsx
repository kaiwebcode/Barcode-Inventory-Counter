import { Ionicons } from "@expo/vector-icons";
import {
  // BottomTabBarButtonProps,
  Tabs,
} from "expo-router";
import { BottomTabBarButtonProps } from "expo-router/build/react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const SLATE = "#94A3B8";

function CustomTabButton({
  children,
  accessibilityState,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) {
  const focused = accessibilityState?.selected ?? false;

  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: focused ? -1 : 0,
      useNativeDriver: true,
      damping: 16,
      stiffness: 180,
      mass: 0.7,
    }).start();
  }, [focused, translateY]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.94,
        useNativeDriver: true,
        damping: 15,
        stiffness: 250,
        mass: 0.5,
      }),
      Animated.spring(translateY, {
        toValue: -2,
        useNativeDriver: true,
        damping: 15,
        stiffness: 250,
        mass: 0.5,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 220,
        mass: 0.6,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -1 : 0,
        useNativeDriver: true,
        damping: 14,
        stiffness: 220,
        mass: 0.6,
      }),
    ]).start();
  };

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="flex-1 items-center justify-center"
    >
      <Animated.View
        className="w-full items-center justify-center"
        style={{
          transform: [{ scale }, { translateY }],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

function HomeTabIcon({ focused }: { focused: boolean }) {
  return (
    <View
      className={`h-[55px] w-[94px] items-center justify-center rounded-[20px] ${
        focused ? "bg-white" : "bg-transparent"
      }`}
      style={
        focused
          ? {
              shadowColor: BLUE,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }
          : undefined
      }
    >
      <Ionicons
        name={focused ? "home" : "home-outline"}
        size={22}
        color={focused ? BLUE : SLATE}
      />

      <Text
        className={`mt-1 text-[11px] ${
          focused
            ? "font-bold text-blue-600"
            : "font-semibold text-slate-400"
        }`}
      >
        Home
      </Text>
    </View>
  );
}

function InventoryTabIcon({ focused }: { focused: boolean }) {
  return (
    <View
      className={`h-[58px] w-[112px] items-center justify-center rounded-[20px] ${
        focused ? "bg-white" : "bg-transparent"
      }`}
      style={
        focused
          ? {
              shadowColor: BLUE,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }
          : undefined
      }
    >
      <Ionicons
        name={focused ? "cube" : "cube-outline"}
        size={23}
        color={focused ? BLUE : SLATE}
      />

      <Text
        className={`mt-1 text-[11px] ${
          focused
            ? "font-bold text-blue-600"
            : "font-semibold text-slate-400"
        }`}
      >
        Inventory
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const bottom =
    Platform.OS === "ios"
      ? Math.max(insets.bottom, 10)
      : Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarActiveTintColor: BLUE,

        tabBarInactiveTintColor: SLATE,

        tabBarStyle: {
          position: "absolute",

          left: 16,
          right: 16,
          bottom,

          height: 78,
          backgroundColor: "#F8FAFF",

          borderTopWidth: 0,
          margin: 14,
          borderWidth: 1,
          borderColor: "#E3EBF7",

          borderRadius: 39,

          paddingHorizontal: 8,
          paddingVertical: 7,

          shadowColor: "#1E3A8A",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.12,
          shadowRadius: 18,

          elevation: 14,
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
            <HomeTabIcon focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",

          tabBarIcon: ({ focused }) => (
            <InventoryTabIcon focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}