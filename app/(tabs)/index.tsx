import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getInventoryCounts } from "@/database/inventory-db";
import type { InventoryCount } from "@/types/inventory";

function ActionButton({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4"
      >
        <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Ionicons name={icon} size={21} color="#2563EB" />
        </View>

        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-gray-900">
            {title}
          </Text>

          <Text className="mt-1 text-xs text-gray-500">
            {subtitle}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={19} color="#9CA3AF" />
      </Pressable>
    </Animated.View>
  );
}

function OverviewCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4">
      <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name={icon} size={18} color="#2563EB" />
      </View>

      <Text className="text-2xl font-bold text-gray-900">
        {value}
      </Text>

      <Text className="mt-1 text-sm font-semibold text-gray-800">
        {title}
      </Text>

      <Text className="mt-1 text-[11px] leading-4 text-gray-400">
        {subtitle}
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();

  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getInventoryCounts();

      setCounts(data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload every time the dashboard becomes active.
  // This means adding/deleting/submitting inventory
  // will automatically update the dashboard.
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const totalProducts = counts.length;

  const pendingCounts = counts.filter(
    (item) => item.status === "pending"
  ).length;

  const submittedCounts = counts.filter(
    (item) => item.status === "submitted"
  ).length;

  const expiredCounts = counts.filter((item) => {
    if (!item.expiryDate) return false;

    const expiry = new Date(item.expiryDate);
    const today = new Date();

    expiry.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    return expiry < today;
  }).length;

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-[#F6F8FC]"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-5 pt-8">
          <View>
            <Text className="text-2xl font-bold text-gray-950">
              Inventory Counter
            </Text>

            <Text className="mt-1 text-sm text-gray-500">
              Manage your stock with ease
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white">
            <Ionicons
              name="person-outline"
              size={21}
              color="#374151"
            />
          </View>
        </View>

        {/* Scan Card */}
        <View className="mx-5 mt-6 overflow-hidden rounded-3xl bg-blue-600 p-5">
          <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500 opacity-40" />
          <View className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-blue-700 opacity-40" />

          <View className="relative">
            <View className="mt-4 mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons
                name="barcode-outline"
                size={27}
                color="white"
              />
            </View>

            <Text className="text-xl font-bold text-white">
              Count Inventory
            </Text>

            <Text className="mt-2 max-w-[290px] text-sm leading-5 text-blue-100">
              Scan a barcode or enter it manually to start counting.
            </Text>

            <Pressable
              onPress={() => router.push("/product-lookup")}
              className="mt-5 flex-row items-center justify-center rounded-2xl bg-white px-5 py-3.5"
            >
              <Ionicons
                name="scan-outline"
                size={19}
                color="#2563EB"
              />

              <Text className="ml-2 font-bold text-blue-600">
                Start Scanning
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#2563EB"
                style={{ marginLeft: 7 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Today's Overview */}
        <View className="px-5 pt-12">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Today&apos;s Overview
              </Text>

              <Text className="mt-1 text-xs text-gray-400">
                Live data from your local inventory
              </Text>
            </View>

            <View className="flex-row items-center rounded-full bg-green-50 px-3 py-1.5">
              <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />

              <Text className="text-[11px] font-semibold text-green-600">
                {loading ? "Updating" : "Live"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <OverviewCard
              icon="cube-outline"
              title="Products"
              value={totalProducts}
              subtitle="Inventory records"
            />

            <OverviewCard
              icon="time-outline"
              title="Pending"
              value={pendingCounts}
              subtitle="Need submission"
            />
          </View>

          <View className="mt-4 flex-row gap-3">
            <OverviewCard
              icon="checkmark-circle-outline"
              title="Submitted"
              value={submittedCounts}
              subtitle="Completed counts"
            />

            <OverviewCard
              icon="alert-circle-outline"
              title="Expired"
              value={expiredCounts}
              subtitle="Expired products"
            />
          </View>
        </View>

        {/* Product Lookup */}
        <View className="px-5 pt-14">
          <Text className="mb-2 text-lg font-bold text-gray-900">
            Product Lookup
          </Text>

          <Pressable
            onPress={() => router.push("/product-lookup")}
            className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-4"
          >
            <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
              <Ionicons
                name="search-outline"
                size={21}
                color="#374151"
              />
            </View>

            <View className="flex-1">
              <Text className="text-[15px] font-semibold text-gray-900">
                Find a Product
              </Text>

              <Text className="mt-1 text-xs text-gray-500">
                Search using a barcode
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View className="px-5 pt-10">
          <Text className="mb-4 text-lg font-bold text-gray-900">
            Quick Actions
          </Text>

          <ActionButton
            icon="create-outline"
            title="Manual Entry"
            subtitle="Enter a barcode manually"
            onPress={() => router.push("/product-lookup")}
          />

          <ActionButton
            icon="list-outline"
            title="Inventory Records"
            subtitle={`${totalProducts} record${
              totalProducts === 1 ? "" : "s"
            } saved locally`}
            onPress={() => router.push("/(tabs)/inventory")}
          />

          <ActionButton
            icon="time-outline"
            title="Pending Counts"
            subtitle={`${pendingCounts} count${
              pendingCounts === 1 ? "" : "s"
            } waiting for submission`}
            onPress={() => router.push("/(tabs)/inventory")}
          />
        </View>

        {/* Footer */}
        <View className="items-center px-5 pt-10">
          <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color="#2563EB"
            />
          </View>

          <Text className="text-xs font-medium text-gray-500">
            Your inventory is saved locally
          </Text>

          <Text className="mt-1 text-[10px] text-gray-400">
            Works offline and syncs when available
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}