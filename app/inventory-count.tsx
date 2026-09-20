import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getInventoryCountByBarcode,
  saveInventoryCount,
} from "@/database/inventory-db";
import type { InventoryCount } from "@/types/inventory";
import { validateExpiryDate } from "@/utils/inventory-validation";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function parseStoredDate(value: string) {
  if (!value) {
    return new Date();
  }

  // Supports DD/MM/YYYY
  const parts = value.split("/");

  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    const parsed = new Date(year, month, day);

    // Make sure JavaScript did not auto-correct an invalid date.
    if (
      !Number.isNaN(parsed.getTime()) &&
      parsed.getDate() === day &&
      parsed.getMonth() === month &&
      parsed.getFullYear() === year
    ) {
      return parsed;
    }
  }

  // Fallback for ISO dates.
  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default function InventoryCountScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    barcode?: string;
    name?: string;
    expected?: string;
  }>();

  const barcode = String(params.barcode ?? "").trim();
  const productName = String(params.name ?? "").trim();

  const expectedQuantity = useMemo(() => {
    const value = Number(params.expected);

    return Number.isFinite(value) && value >= 0 ? value : 0;
  }, [params.expected]);

  const [actualQuantity, setActualQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [loadingExisting, setLoadingExisting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadExistingCount = useCallback(async () => {
    if (!barcode) {
      setLoadingExisting(false);
      return;
    }

    try {
      setError("");

      const existing = await getInventoryCountByBarcode(barcode);

      if (existing) {
        setActualQuantity(String(existing.actualQuantity));

        if (existing.expiryDate) {
          const parsedDate = parseStoredDate(existing.expiryDate);

          setSelectedDate(parsedDate);
          setExpiryDate(formatDate(parsedDate));
        }
      }
    } catch (error) {
      console.error("Failed to load existing inventory count:", error);

      setError(
        "Unable to load the existing inventory count. Please try again.",
      );
    } finally {
      setLoadingExisting(false);
    }
  }, [barcode]);

  useEffect(() => {
    loadExistingCount();
  }, [loadExistingCount]);

  const actual = Number(actualQuantity);

  const difference =
    actualQuantity.trim() === "" || !Number.isFinite(actual)
      ? 0
      : actual - expectedQuantity;

  const differenceColor =
    difference < 0
      ? "text-red-700"
      : difference > 0
        ? "text-green-700"
        : "text-slate-700";

  function handleActualQuantityChange(value: string) {
    // Allow numbers only.
    const cleaned = value.replace(/[^0-9]/g, "");

    setActualQuantity(cleaned);
    setError("");
  }

  function openDatePicker() {
    if (saving) {
      return;
    }

    setError("");
    setShowDatePicker(true);
  }

  function handleDateValueChange(_event: unknown, date?: Date) {
    if (!date) {
      return;
    }

    setSelectedDate(date);
    setExpiryDate(formatDate(date));
    setError("");

    // Android picker closes after selecting a date.
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  }

  function handleDateDismiss() {
    setShowDatePicker(false);
  }

  async function handleSave() {
    // Validate product information.
    if (!barcode || !productName) {
      setError(
        "Product information is missing. Please go back and look up the product again.",
      );
      return;
    }

    // Validate actual quantity.
    if (actualQuantity.trim() === "") {
      setError("Enter the actual quantity.");
      return;
    }

    const parsedActualQuantity = Number(actualQuantity);

    if (!Number.isInteger(parsedActualQuantity) || parsedActualQuantity < 0) {
      setError("Actual quantity must be a valid whole number.");
      return;
    }

    // Validate expiry date exists.
    if (!expiryDate) {
      setError("Select the expiry date.");
      return;
    }

    // Validate expiry date format and make sure it is not expired.
    const expiryValidation = validateExpiryDate(expiryDate);

    if (!expiryValidation.valid) {
      setError(expiryValidation.message);
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Check whether this barcode already has an inventory record.
      const existing = await getInventoryCountByBarcode(barcode);

      const inventoryCount: InventoryCount = {
        id: existing?.id ?? `${Date.now()}-${barcode}`,
        barcode,
        productName,
        expectedQuantity,
        actualQuantity: parsedActualQuantity,
        difference: parsedActualQuantity - expectedQuantity,
        expiryDate: expiryValidation.value,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await saveInventoryCount(inventoryCount);

      // Go back to inventory after successful save.
      router.replace("/inventory");
    } catch (error) {
      console.error("Failed to save inventory count:", error);

      setError("Unable to save the inventory count. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Loading existing inventory record.
  if (loadingExisting) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="small" color="#2563EB" />

          <Text className="mt-3 text-sm text-slate-500">
            Loading inventory count...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View className="flex-row items-center py-3">
            <Pressable
              onPress={() => router.back()}
              disabled={saving}
              className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={21} color="#0F172A" />
            </Pressable>

            <View className="ml-3 flex-1">
              <Text className="text-[22px] font-extrabold text-slate-900">
                Inventory Count
              </Text>

              <Text className="mt-0.5 text-xs text-slate-500">
                Record the actual stock quantity
              </Text>
            </View>
          </View>

          {/* ERROR */}
          {error ? (
            <View className="mb-4 flex-row rounded-2xl border border-red-200 bg-red-50 p-3.5">
              <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />

              <Text className="ml-2 flex-1 text-sm leading-5 text-red-700">
                {error}
              </Text>
            </View>
          ) : null}

          {/* PRODUCT INFORMATION */}
          <View className="rounded-[20px] border border-slate-200 bg-white p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <Ionicons name="cube-outline" size={24} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Product
                </Text>

                <Text
                  className="mt-1 text-[17px] font-extrabold text-slate-900"
                  numberOfLines={2}
                >
                  {productName || "Unknown product"}
                </Text>
              </View>
            </View>

            <View className="mt-5 border-t border-slate-100 pt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-slate-500">Barcode</Text>

                <Text
                  className="ml-4 flex-1 text-right text-xs font-bold text-slate-800"
                  numberOfLines={1}
                >
                  {barcode || "—"}
                </Text>
              </View>
            </View>
          </View>

          {/* EXPECTED QUANTITY  */}
          <View className="mt-4 rounded-[20px] border border-blue-100 bg-blue-50 p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-semibold text-blue-700">
                  Expected Quantity
                </Text>

                <Text className="mt-1 text-[30px] font-extrabold text-blue-900">
                  {expectedQuantity}
                </Text>
              </View>

              <View className="h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Ionicons name="layers-outline" size={22} color="#2563EB" />
              </View>
            </View>
          </View>

          {/* ACTUAL QUANTITY */}
          <View className="mt-4 rounded-[20px] border border-slate-200 bg-white p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-bold text-slate-900">
                  Actual Quantity
                </Text>

                <Text className="mt-1 text-xs text-slate-500">
                  Enter the quantity you physically counted.
                </Text>
              </View>

              <View className="h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                <Ionicons name="calculator-outline" size={18} color="#475569" />
              </View>
            </View>

            <TextInput
              value={actualQuantity}
              onChangeText={handleActualQuantityChange}
              placeholder="0"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              editable={!saving}
              className="mt-4 h-[58px] rounded-2xl border border-slate-300 bg-slate-50 px-4 text-[20px] font-bold text-slate-900"
              accessibilityLabel="Actual quantity"
            />
          </View>

          {/* DIFFERENCE */}
          <View className="mt-4 flex-row items-center justify-between rounded-[18px] border border-slate-200 bg-white px-5 py-4">
            <View>
              <Text className="text-xs font-semibold text-slate-500">
                Difference
              </Text>

              <Text
                className={`mt-1 text-[25px] font-extrabold ${differenceColor}`}
              >
                {difference > 0 ? "+" : ""}
                {difference}
              </Text>
            </View>

            <View
              className={`h-11 w-11 items-center justify-center rounded-xl ${
                difference < 0
                  ? "bg-red-50"
                  : difference > 0
                    ? "bg-green-50"
                    : "bg-slate-100"
              }`}
            >
              <Ionicons
                name={
                  difference < 0
                    ? "arrow-down"
                    : difference > 0
                      ? "arrow-up"
                      : "remove"
                }
                size={21}
                color={
                  difference < 0
                    ? "#DC2626"
                    : difference > 0
                      ? "#16A34A"
                      : "#64748B"
                }
              />
            </View>
          </View>

          {/* EXPIRY DATE */}
          <View className="mt-4 rounded-[20px] border border-slate-200 bg-white p-5">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Ionicons name="calendar-outline" size={20} color="#2563EB" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-sm font-bold text-slate-900">
                  Expiry Date
                </Text>

                <Text className="mt-0.5 text-xs text-slate-500">
                  Select the product expiry date.
                </Text>
              </View>
            </View>

            {/* Date Picker Trigger */}
            <Pressable
              onPress={openDatePicker}
              disabled={saving}
              className={`mt-4 h-[56px] flex-row items-center justify-between rounded-2xl border px-4 ${
                expiryDate
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-300 bg-slate-50"
              }`}
              accessibilityRole="button"
              accessibilityLabel="Select expiry date"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar"
                  size={20}
                  color={expiryDate ? "#2563EB" : "#64748B"}
                />

                <Text
                  className={`ml-3 text-[16px] font-semibold ${
                    expiryDate ? "text-blue-900" : "text-slate-400"
                  }`}
                >
                  {expiryDate || "Select expiry date"}
                </Text>
              </View>

              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </Pressable>

            {/* Native Date Picker */}
            {showDatePicker ? (
              <View className="mt-3 overflow-hidden rounded-2xl bg-slate-50">
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onValueChange={handleDateValueChange}
                  onDismiss={handleDateDismiss}
                  accentColor="#2563EB"
                  themeVariant="light"
                />
              </View>
            ) : null}

            {/* Selected Date Confirmation */}
            {expiryDate ? (
              <View className="mt-3 flex-row items-center rounded-xl bg-green-50 px-3 py-2.5">
                <Ionicons name="checkmark-circle" size={17} color="#16A34A" />

                <Text className="ml-2 text-xs font-semibold text-green-700">
                  Expiry date selected
                </Text>
              </View>
            ) : null}
          </View>

          {/* ==================== SAVE BUTTON ==================== */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`mt-6 h-[56px] flex-row items-center justify-center rounded-2xl bg-blue-600 ${
              saving ? "opacity-60" : "active:opacity-80"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Save inventory count"
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text className="ml-2 text-[15px] font-bold text-white">
                  Saving...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text className="ml-2 text-[15px] font-bold text-white">
                  Save Inventory Count
                </Text>
              </>
            )}
          </Pressable>

          {/* LOCAL STORAGE INFO  */}
          <View className="mt-3 flex-row items-center justify-center px-4">
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color="#64748B"
            />

            <Text className="ml-1.5 text-center text-[11px] text-slate-500">
              Your count is saved locally and can sync when you're online.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
