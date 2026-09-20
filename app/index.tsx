import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0.65)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(20)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslate = useRef(new Animated.Value(15)).current;

  const creatorOpacity = useRef(new Animated.Value(0)).current;
  const creatorTranslate = useRef(new Animated.Value(15)).current;

  const lineWidth = useRef(new Animated.Value(0)).current;

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          speed: 12,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // App title
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Subtitle
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslate, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Loading line
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),

      // Creator
      Animated.parallel([
        Animated.timing(creatorOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(creatorTranslate, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Subtle continuous logo breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.035,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Move to dashboard after splash
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 4300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <View className="flex-1 items-center justify-between px-6">
        {/* Top brand */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslate }],
          }}
          className="items-center pt-8"
        >
          <View className="mb-2 flex-row items-center">
            <View className="mr-2 h-2 w-2 rounded-full bg-blue-600" />

            <Text className="text-[13px] font-bold uppercase tracking-[3px] text-slate-500">
              Inventory Management
            </Text>

            <View className="ml-2 h-2 w-2 rounded-full bg-blue-600" />
          </View>
        </Animated.View>

        {/* Main logo section */}
        <View
          style={{
            width,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { scale: pulse },
              ],
            }}
          >
            {/* Glow */}
            <View className="absolute -inset-7 rounded-[48px] bg-blue-100 opacity-50" />

            {/* Logo container */}
            <View className="h-[148px] w-[148px] items-center justify-center rounded-[42px] bg-blue-600 shadow-xl">
              {/* Barcode lines */}
              <View className="h-[72px] flex-row items-end justify-center">
                <View className="mx-[2px] h-[58px] w-[5px] rounded-full bg-white" />
                <View className="mx-[2px] h-[72px] w-[3px] rounded-full bg-white" />
                <View className="mx-[2px] h-[48px] w-[7px] rounded-full bg-white" />
                <View className="mx-[2px] h-[66px] w-[3px] rounded-full bg-white" />
                <View className="mx-[2px] h-[54px] w-[5px] rounded-full bg-white" />
                <View className="mx-[2px] h-[70px] w-[3px] rounded-full bg-white" />
                <View className="mx-[2px] h-[45px] w-[7px] rounded-full bg-white" />
              </View>

              {/* Scan line */}
              <View className="absolute left-[25px] right-[25px] top-[74px] h-[3px] rounded-full bg-blue-200" />

              {/* Check badge */}
              <View className="absolute -bottom-2 -right-2 h-[48px] w-[48px] items-center justify-center rounded-full border-[4px] border-[#F8FAFC] bg-emerald-500">
                <Ionicons
                  name="checkmark"
                  size={27}
                  color="#FFFFFF"
                />
              </View>
            </View>
          </Animated.View>

          {/* App name */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            }}
            className="mt-10 items-center px-5"
          >
            <Text className="text-center text-[30px] font-extrabold tracking-[-1px] text-slate-900">
              Barcode Inventory
            </Text>

            <Text className="text-center text-[30px] font-extrabold tracking-[-1px] text-blue-600">
              Counter
            </Text>
          </Animated.View>

          {/* Description */}
          <Animated.View
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslate }],
            }}
            className="mt-4 max-w-[330px]"
          >
            <Text className="text-center text-[15px] leading-6 text-slate-500">
              Scan products, count stock, track expiry,
              {"\n"}
              and keep your inventory organized.
            </Text>
          </Animated.View>

          {/* Loading animation */}
          <View className="mt-8 h-[4px] w-[180px] overflow-hidden rounded-full bg-slate-200">
            <Animated.View
              style={{
                width: lineWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
              className="h-full rounded-full bg-blue-600"
            />
          </View>
        </View>

        {/* Bottom creator section */}
        <Animated.View
          style={{
            opacity: creatorOpacity,
            transform: [{ translateY: creatorTranslate }],
          }}
          className="items-center pb-7"
        >
          <Text className="mb-1 text-[11px] font-medium uppercase tracking-[2px] text-slate-400">
            Designed & Developed by
          </Text>

          <Text className="text-[17px] font-bold text-slate-800">
            Kaif Qureshi
          </Text>

          <View className="mt-3 flex-row items-center">
            <View className="h-[1px] w-8 bg-slate-200" />

            <View className="mx-3 h-1.5 w-1.5 rounded-full bg-blue-500" />

            <Text className="text-[10px] font-semibold uppercase tracking-[1.5px] text-slate-400">
              Version 1.0
            </Text>

            <View className="mx-3 h-1.5 w-1.5 rounded-full bg-blue-500" />

            <View className="h-[1px] w-8 bg-slate-200" />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}