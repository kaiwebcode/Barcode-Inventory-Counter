import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { initializeInventoryDatabase } from "@/database/inventory-db";
import { saveProduct } from "@/database/product-db";

export default function AddProductScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    barcode?: string;
  }>();

  const barcode = useMemo(
    () => String(params.barcode ?? "").trim(),
    [params.barcode]
  );

  const [productName, setProductName] = useState("");
  const [expectedQuantity, setExpectedQuantity] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleProductNameChange(value: string) {
    setProductName(value);
    setError("");
  }

  function handleExpectedQuantityChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, "");

    setExpectedQuantity(cleaned);
    setError("");
  }

  async function handleSaveProduct() {
    const cleanedName = productName.trim();

    if (!barcode) {
      setError(
        "Barcode is missing. Please go back and scan the product again."
      );
      return;
    }

    if (!cleanedName) {
      setError("Enter the product name.");
      return;
    }

    const parsedExpectedQuantity =
      expectedQuantity.trim() === ""
        ? 0
        : Number(expectedQuantity);

    if (
      !Number.isInteger(parsedExpectedQuantity) ||
      parsedExpectedQuantity < 0
    ) {
      setError(
        "Expected quantity must be a valid whole number."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Make sure the database and products table exist.
      await initializeInventoryDatabase();

      await saveProduct({
        barcode,
        name: cleanedName,
        expectedQuantity: parsedExpectedQuantity,
        createdAt: new Date().toISOString(),
      });

      console.log(
        "Product saved successfully:",
        {
          barcode,
          name: cleanedName,
          expectedQuantity: parsedExpectedQuantity,
        }
      );

      // Continue directly to inventory counting.
      router.replace({
        pathname: "/inventory-count",
        params: {
          barcode,
          name: cleanedName,
          expected: String(
            parsedExpectedQuantity
          ),
        },
      });
    } catch (saveError) {
      console.error(
        "Failed to save product:",
        saveError
      );

      setError(
        "Unable to save the product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center">
          <Link href="/product-lookup" asChild>
            <Pressable
              disabled={saving}
              className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white"
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color="#0F172A"
              />
            </Pressable>
          </Link>

          <View className="flex-1">
            <Text className="text-2xl font-bold text-slate-900">
              Add Product
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Save this product to your inventory
            </Text>
          </View>
        </View>

        {/* Info */}
        <View className="mb-5 flex-row items-start rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#2563EB"
          />

          <Text className="ml-3 flex-1 text-sm leading-5 text-blue-700">
            This barcode was not found in the product
            database. Add the product details once and
            it will be available locally for future scans.
          </Text>
        </View>

        {/* Form */}
        <View
          className="rounded-3xl bg-white p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          {/* Barcode */}
          <View>
            <Text className="text-base font-bold text-slate-900">
              Barcode
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              This barcode was detected automatically.
            </Text>

            <View className="mt-3 flex-row items-center rounded-2xl border border-slate-200 bg-slate-100 px-4">
              <Ionicons
                name="barcode-outline"
                size={22}
                color="#64748B"
              />

              <Text
                className="ml-3 flex-1 py-4 text-base font-semibold text-slate-700"
                numberOfLines={1}
              >
                {barcode || "No barcode"}
              </Text>

              <Ionicons
                name="checkmark-circle"
                size={21}
                color="#16A34A"
              />
            </View>
          </View>

          {/* Product Name */}
          <View className="mt-5">
            <Text className="text-base font-bold text-slate-900">
              Product Name
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Enter the name printed on the product.
            </Text>

            <View className="mt-3 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Ionicons
                name="cube-outline"
                size={21}
                color="#64748B"
              />

              <TextInput
                value={productName}
                onChangeText={handleProductNameChange}
                placeholder="Enter product name"
                placeholderTextColor="#94A3B8"
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                editable={!saving}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Expected Quantity */}
          <View className="mt-5">
            <Text className="text-base font-bold text-slate-900">
              Expected Quantity
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Optional. You can leave this as 0.
            </Text>

            <View className="mt-3 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Ionicons
                name="layers-outline"
                size={21}
                color="#64748B"
              />

              <TextInput
                value={expectedQuantity}
                onChangeText={
                  handleExpectedQuantityChange
                }
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                editable={!saving}
              />
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View className="mt-4 flex-row items-start rounded-2xl border border-red-200 bg-red-50 p-4">
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color="#DC2626"
              />

              <Text className="ml-3 flex-1 text-sm leading-5 text-red-700">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Save */}
          <Pressable
            onPress={handleSaveProduct}
            disabled={saving}
            className={`mt-5 flex-row items-center justify-center rounded-2xl py-4 ${
              saving
                ? "bg-blue-300"
                : "bg-blue-600 active:bg-blue-700"
            }`}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons
                  name="save-outline"
                  size={21}
                  color="white"
                />

                <Text className="ml-2 text-base font-bold text-white">
                  Save Product
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Bottom information */}
        <View className="mt-6 flex-row items-start px-2">
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color="#64748B"
          />

          <Text className="ml-2 flex-1 text-xs leading-5 text-slate-500">
            Product information is stored locally on your
            device so this barcode can be recognized even
            when you are offline.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}