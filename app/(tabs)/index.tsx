import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between pt-2">
          <View className="flex-1 pr-4">
            <Text className="text-[26px] font-extrabold tracking-tight text-slate-900">
              Inventory Counter
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Keep your stock count accurate.
            </Text>
          </View>

          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-blue-50 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#2563EB"
            />
          </Pressable>
        </View>

        {/* Scan Card */}
        <View className="mb-7 overflow-hidden rounded-[24px] bg-blue-600 p-[22px]">
          <View className="mb-[18px] h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-white/15">
            <Ionicons
              name="barcode-outline"
              size={30}
              color="#FFFFFF"
            />
          </View>

          <Text className="text-[22px] font-extrabold text-white">
            Scan Barcode
          </Text>

          <Text className="mt-2 text-sm leading-[21px] text-blue-100">
            Scan a product barcode to quickly find its expected quantity and
            start an inventory count.
          </Text>

          <Pressable
            onPress={() => router.push("/product-lookup")}
            className="mt-5 h-[52px] flex-row items-center justify-center gap-2 rounded-[15px] bg-white active:opacity-80"
          >
            <Ionicons
              name="scan-outline"
              size={19}
              color="#1D4ED8"
            />

            <Text className="text-[15px] font-bold text-blue-700">
              Start Scanning
            </Text>
          </Pressable>
        </View>

        {/* Overview */}
        <Text className="mb-3 text-lg font-extrabold text-slate-900">
          Today's Overview
        </Text>

        <View className="mb-7 flex-row gap-3">
          {/* Products */}
          <View className="flex-1 rounded-[18px] border border-slate-200 bg-white p-4">
            <View className="mb-3.5 h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-blue-50">
              <Ionicons
                name="cube-outline"
                size={21}
                color="#2563EB"
              />
            </View>

            <Text className="text-2xl font-extrabold text-slate-900">
              0
            </Text>

            <Text className="mt-0.5 text-[13px] text-slate-500">
              Products
            </Text>
          </View>

          {/* Pending */}
          <View className="flex-1 rounded-[18px] border border-slate-200 bg-white p-4">
            <View className="mb-3.5 h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-orange-50">
              <Ionicons
                name="time-outline"
                size={21}
                color="#EA580C"
              />
            </View>

            <Text className="text-2xl font-extrabold text-slate-900">
              0
            </Text>

            <Text className="mt-0.5 text-[13px] text-slate-500">
              Pending
            </Text>
          </View>
        </View>

        {/* Product Lookup */}
        <Link href="/product-lookup" asChild>
          <Pressable className="mb-7 flex-row items-center justify-center rounded-[14px] border border-blue-100 bg-blue-50 px-4 py-3 active:opacity-70">
            <Ionicons
              name="search-outline"
              size={18}
              color="#2563EB"
            />

            <Text className="ml-2 text-sm font-semibold text-blue-700">
              Open Product Lookup
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color="#2563EB"
              style={{ marginLeft: 6 }}
            />
          </Pressable>
        </Link>

        {/* Quick Actions */}
        <Text className="mb-3 text-lg font-extrabold text-slate-900">
          Quick Actions
        </Text>

        {/* Manual Entry */}
        <Pressable
          onPress={() => router.push("/product-lookup")}
          className="mb-2.5 min-h-[72px] flex-row items-center rounded-[18px] border border-slate-200 bg-white px-[15px] active:opacity-70"
        >
          <View className="h-11 w-11 items-center justify-center rounded-[13px] bg-blue-50">
            <Ionicons
              name="create-outline"
              size={22}
              color="#2563EB"
            />
          </View>

          <View className="ml-[13px] flex-1">
            <Text className="text-[15px] font-bold text-slate-900">
              Manual Entry
            </Text>

            <Text className="mt-0.5 text-xs text-slate-500">
              Enter a barcode manually
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </Pressable>

        {/* Pending Counts */}
        <Pressable
          onPress={() => router.push("/(tabs)/inventory")}
          className="min-h-[72px] flex-row items-center rounded-[18px] border border-slate-200 bg-white px-[15px] active:opacity-70"
        >
          <View className="h-11 w-11 items-center justify-center rounded-[13px] bg-orange-50">
            <Ionicons
              name="cloud-upload-outline"
              size={22}
              color="#EA580C"
            />
          </View>

          <View className="ml-[13px] flex-1">
            <Text className="text-[15px] font-bold text-slate-900">
              Pending Counts
            </Text>

            <Text className="mt-0.5 text-xs text-slate-500">
              View unsent inventory records
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}