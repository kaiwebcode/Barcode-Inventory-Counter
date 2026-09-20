import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { exportInventoryToCsv } from "@/services/inventory-export";
import { isInventoryExpiryExpired } from "@/utils/inventory-validation";
import { useNetworkStatus } from "@/hooks/use-network-status";

import {
  getInventoryCounts,
  updateInventoryStatus,
} from "@/database/inventory-db";
import { submitInventoryCount } from "@/services/inventory-service";
import type { InventoryCount } from "@/types/inventory";

export default function InventoryScreen() {
  const router = useRouter();
  const isOnline = useNetworkStatus();

  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Prevent multiple automatic retry processes
  const retryingRef = useRef(false);

  const loadInventory = useCallback(async () => {
    try {
      const records = await getInventoryCounts();
      setCounts(records);
    } catch (error) {
      console.error("Failed to load inventory:", error);

      Alert.alert(
        "Loading failed",
        "Unable to load your inventory records. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [loadInventory]),
  );

  /**
   * Submit one pending inventory record.
   */
  const submitSingleInventory = useCallback(async (count: InventoryCount) => {
    try {
      const response = await submitInventoryCount(count);

      if (!response.success) {
        throw new Error(response.message || "Submission failed.");
      }

      await updateInventoryStatus(count.id, "submitted");

      return true;
    } catch (error) {
      console.error(`Failed to submit inventory ${count.barcode}:`, error);

      return false;
    }
  }, []);

  /**
   * Automatically retry pending records when internet comes back.
   */
  const retryPendingSubmissions = useCallback(async () => {
    if (retryingRef.current) {
      return;
    }

    retryingRef.current = true;

    try {
      const networkState = await NetInfo.fetch();

      const online =
        networkState.isConnected === true &&
        networkState.isInternetReachable !== false;

      if (!online) {
        return;
      }

      const records = await getInventoryCounts();

      const pendingRecords = records.filter(
        (record) => record.status === "pending",
      );

      if (pendingRecords.length === 0) {
        return;
      }

      let changed = false;

      for (const record of pendingRecords) {
        const success = await submitSingleInventory(record);

        if (success) {
          changed = true;
        }
      }

      if (changed) {
        await loadInventory();
      }
    } catch (error) {
      console.error("Automatic inventory retry failed:", error);
    } finally {
      retryingRef.current = false;
    }
  }, [loadInventory, submitSingleInventory]);

  /**
   * Watch network changes.
   */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online =
        state.isConnected === true && state.isInternetReachable !== false;

      if (online) {
        retryPendingSubmissions();
      }
    });

    return unsubscribe;
  }, [retryPendingSubmissions]);

  /**
   * Pull-to-refresh.
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadInventory();

    if (isOnline) {
      await retryPendingSubmissions();
    }
  }, [isOnline, loadInventory, retryPendingSubmissions]);

  /**
   * Manually submit one inventory record.
   */
  const handleSubmit = useCallback(
    async (count: InventoryCount) => {
      if (count.status === "submitted") {
        return;
      }

      if (!isOnline) {
        Alert.alert(
          "You're offline",
          "This inventory count is saved locally and will be submitted automatically when you're back online.",
        );

        return;
      }

      if (submittingId) {
        return;
      }

      setSubmittingId(count.id);

      try {
        const success = await submitSingleInventory(count);

        if (!success) {
          throw new Error("Inventory submission failed.");
        }

        await loadInventory();

        Alert.alert(
          "Submitted",
          `${count.productName} was submitted successfully.`,
        );
      } catch (error) {
        console.error("Failed to submit inventory:", error);

        Alert.alert(
          "Submission failed",
          "The inventory record could not be submitted. It will remain pending.",
        );
      } finally {
        setSubmittingId(null);
      }
    },
    [isOnline, loadInventory, submittingId, submitSingleInventory],
  );

  const pendingCount = counts.filter(
    (count) => count.status === "pending",
  ).length;

  const submittedCount = counts.filter(
    (count) => count.status === "submitted",
  ).length;

  const handleExportCsv = useCallback(async () => {
    if (counts.length === 0) {
      Alert.alert(
        "Nothing to export",
        "Add at least one inventory record before exporting.",
      );
      return;
    }

    try {
      await exportInventoryToCsv(counts);

      Alert.alert("Export complete", "Your inventory CSV is ready to share.");
    } catch (error) {
      console.error("Inventory CSV export failed:", error);

      Alert.alert(
        "Export failed",
        "Unable to create the inventory CSV. Please try again.",
      );
    }
  }, [counts]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Offline Banner */}
        {!isOnline && (
          <View className="mb-4 mt-2 flex-row items-center rounded-2xl border border-orange-200 bg-orange-50 p-3.5">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
              <Ionicons
                name="cloud-offline-outline"
                size={19}
                color="#C2410C"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-orange-800">
                You're offline
              </Text>

              <Text className="mt-0.5 text-xs leading-4 text-orange-700">
                New inventory stays saved locally and will sync when you're back
                online.
              </Text>
            </View>
          </View>
        )}

        {/* Header */}
        <View className="flex-row items-center justify-between pb-6 pt-2">
          <View className="flex-1 pr-4">
            <Text className="text-[28px] font-extrabold tracking-tight text-slate-900">
              Inventory
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Manage your inventory counts
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={handleExportCsv}
              disabled={loading || counts.length === 0}
              className={`h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white ${
                loading || counts.length === 0
                  ? "opacity-40"
                  : "active:opacity-70"
              }`}
              accessibilityRole="button"
              accessibilityLabel="Export inventory CSV"
            >
              <Ionicons name="download-outline" size={21} color="#2563EB" />
            </Pressable>

            <Pressable
              onPress={() => router.push("/product-lookup")}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Add inventory"
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-6 flex-row gap-3">
          <SummaryCard
            label="Total"
            value={counts.length}
            icon="cube-outline"
            iconBackground="bg-blue-50"
            iconColor="#2563EB"
          />

          <SummaryCard
            label="Pending"
            value={pendingCount}
            icon="time-outline"
            iconBackground="bg-orange-50"
            iconColor="#EA580C"
          />

          <SummaryCard
            label="Submitted"
            value={submittedCount}
            icon="checkmark-circle-outline"
            iconBackground="bg-green-50"
            iconColor="#16A34A"
          />
        </View>

        {/* Loading */}
        {loading && (
          <View className="items-center justify-center rounded-[20px] border border-slate-200 bg-white px-6 py-10">
            <ActivityIndicator size="small" color="#2563EB" />

            <Text className="mt-3 text-sm text-slate-500">
              Loading inventory...
            </Text>
          </View>
        )}

        {/* Empty */}
        {!loading && counts.length === 0 && (
          <View className="items-center rounded-[22px] border border-dashed border-slate-300 bg-white px-6 py-10">
            <View className="mb-4 h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-blue-50">
              <Ionicons name="cube-outline" size={34} color="#2563EB" />
            </View>

            <Text className="text-lg font-extrabold text-slate-900">
              No inventory records
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
              Scan or enter a product barcode to start recording your inventory.
            </Text>

            <Pressable
              onPress={() => router.push("/product-lookup")}
              className="mt-5 min-h-[48px] flex-row items-center justify-center rounded-2xl bg-blue-600 px-5 active:opacity-80"
            >
              <Ionicons name="barcode-outline" size={19} color="#FFFFFF" />

              <Text className="ml-2 text-sm font-bold text-white">
                Add Inventory
              </Text>
            </Pressable>
          </View>
        )}

        {/* Records */}
        {!loading && counts.length > 0 && (
          <View>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-extrabold text-slate-900">
                Inventory Records
              </Text>

              <Text className="text-xs font-semibold text-slate-500">
                {counts.length} {counts.length === 1 ? "record" : "records"}
              </Text>
            </View>

            {counts.map((count) => (
              <InventoryCard
                key={count.id}
                count={count}
                isOnline={isOnline}
                isSubmitting={submittingId === count.id}
                onSubmit={handleSubmit}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

type SummaryCardProps = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackground: string;
  iconColor: string;
};

function SummaryCard({
  label,
  value,
  icon,
  iconBackground,
  iconColor,
}: SummaryCardProps) {
  return (
    <View className="flex-1 rounded-[18px] border border-slate-200 bg-white p-3.5">
      <View
        className={`mb-3 h-9 w-9 items-center justify-center rounded-xl ${iconBackground}`}
      >
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>

      <Text className="text-[21px] font-extrabold text-slate-900">{value}</Text>

      <Text className="mt-0.5 text-xs font-medium text-slate-500">{label}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Inventory Card                                                             */
/* -------------------------------------------------------------------------- */

type InventoryCardProps = {
  count: InventoryCount;
  isOnline: boolean;
  isSubmitting: boolean;
  onSubmit: (count: InventoryCount) => void;
};

function InventoryCard({
  count,
  isOnline,
  isSubmitting,
  onSubmit,
}: InventoryCardProps) {
  const isSubmitted = count.status === "submitted";
  const expired = isInventoryExpiryExpired(count.expiryDate);

  const differenceClass =
    count.difference < 0
      ? "text-red-700"
      : count.difference > 0
        ? "text-green-700"
        : "text-slate-500";

  return (
    <View className="mb-3.5 rounded-[20px] border border-slate-200 bg-white p-4">
      {/* Product */}
      <View className="flex-row items-start">
        <View className="h-11 w-11 items-center justify-center rounded-[13px] bg-blue-50">
          <Ionicons name="cube-outline" size={21} color="#2563EB" />
        </View>

        <View className="ml-3 flex-1 pr-2">
          <Text
            className="text-[15px] font-extrabold text-slate-900"
            numberOfLines={1}
          >
            {count.productName}
          </Text>

          <Text className="mt-1 text-[11px] text-slate-500" numberOfLines={1}>
            Barcode: {count.barcode}
          </Text>
        </View>

        <View
          className={`rounded-full px-2.5 py-1.5 ${
            isSubmitted ? "bg-green-50" : "bg-orange-50"
          }`}
        >
          <Text
            className={`text-[10px] font-extrabold ${
              isSubmitted ? "text-green-700" : "text-orange-700"
            }`}
          >
            {isSubmitted ? "Submitted" : "Pending"}
          </Text>
        </View>
      </View>

      {/* Quantities */}
      <View className="mt-4 flex-row gap-2 border-t border-slate-100 pt-3.5">
        <QuantityItem label="Expected" value={count.expectedQuantity} />

        <QuantityItem label="Actual" value={count.actualQuantity} />

        <QuantityItem
          label="Difference"
          value={`${count.difference > 0 ? "+" : ""}${count.difference}`}
          valueClassName={differenceClass}
        />
      </View>

      {/* Expiry */}
      <View className="mt-4 flex-row items-center">
        <View
          className={`h-8 w-8 items-center justify-center rounded-lg ${
            expired ? "bg-red-50" : "bg-slate-50"
          }`}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={expired ? "#DC2626" : "#64748B"}
          />
        </View>

        <View className="ml-2 flex-1">
          <Text className="text-[10px] text-slate-400">Expiry</Text>

          <Text
            className={`mt-0.5 text-xs font-semibold ${
              expired ? "text-red-700" : "text-slate-700"
            }`}
          >
            {count.expiryDate}
          </Text>
        </View>

        {expired ? (
          <View className="rounded-full bg-red-50 px-2.5 py-1">
            <Text className="text-[10px] font-bold text-red-700">EXPIRED</Text>
          </View>
        ) : null}
      </View>

      {/* Submit */}
      {!isSubmitted && (
        <View className="mt-4 border-t border-slate-100 pt-3.5">
          {isSubmitting ? (
            <View className="h-11 flex-row items-center justify-center rounded-xl bg-blue-600">
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text className="ml-2 text-[13px] font-bold text-white">
                Submitting...
              </Text>
            </View>
          ) : isOnline ? (
            <Pressable
              onPress={() => onSubmit(count)}
              className="h-11 flex-row items-center justify-center rounded-xl bg-blue-600 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel={`Submit ${count.productName}`}
            >
              <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />

              <Text className="ml-2 text-[13px] font-bold text-white">
                Submit Inventory
              </Text>
            </Pressable>
          ) : (
            <View className="h-11 flex-row items-center justify-center rounded-xl bg-slate-100">
              <Ionicons
                name="cloud-offline-outline"
                size={18}
                color="#64748B"
              />

              <Text className="ml-2 text-[13px] font-bold text-slate-500">
                Waiting for connection
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Quantity Item                                                              */
/* -------------------------------------------------------------------------- */

type QuantityItemProps = {
  label: string;
  value: string | number;
  valueClassName?: string;
};

function QuantityItem({
  label,
  value,
  valueClassName = "text-slate-900",
}: QuantityItemProps) {
  return (
    <View className="flex-1 rounded-xl bg-slate-50 px-3 py-2.5">
      <Text className="text-[10px] text-slate-500" numberOfLines={1}>
        {label}
      </Text>

      <Text
        className={`mt-1 text-[17px] font-extrabold ${valueClassName}`}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}
