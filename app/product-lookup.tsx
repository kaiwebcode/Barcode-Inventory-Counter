import { Ionicons } from "@expo/vector-icons";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getProductByBarcode } from "@/services/product-service";
import type { Product } from "@/types/product";

export default function ProductLookupScreen() {
  const router = useRouter();

  const [permission, requestPermission] =
    useCameraPermissions();

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showScanner, setShowScanner] =
    useState(false);

  const [scanned, setScanned] = useState(false);

  // Prevent the camera callback from firing twice
  // before React updates the scanned state.
  const scanLockRef = useRef(false);

  async function handleLookup(value?: string) {
    const cleanedBarcode = (
      value ?? barcode
    ).trim();

    if (!cleanedBarcode) {
      setProduct(null);
      setError("Enter a barcode to search.");
      return;
    }

    setLoading(true);
    setError("");
    setProduct(null);

    try {
      const result =
        await getProductByBarcode(
          cleanedBarcode
        );

      if (!result) {
        setError(
          "Product not found. You can add this product manually."
        );
        return;
      }

      setProduct(result);
    } catch (lookupError) {
      console.error(
        "Product lookup failed:",
        lookupError
      );

      setError(
        "Unable to look up the product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleBarcodeScanned(
    result: BarcodeScanningResult
  ) {
    if (
      scanLockRef.current ||
      loading
    ) {
      return;
    }

    const scannedBarcode =
      result.data?.trim();

    if (!scannedBarcode) {
      return;
    }

    scanLockRef.current = true;

    console.log(
      "========== BARCODE SCANNED =========="
    );
    console.log(
      "Barcode:",
      scannedBarcode
    );
    console.log(
      "====================================="
    );

    setScanned(true);
    setBarcode(scannedBarcode);
    setShowScanner(false);
    setError("");

    try {
      await handleLookup(
        scannedBarcode
      );
    } finally {
      scanLockRef.current = false;
    }
  }

  async function openScanner() {
    setError("");

    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const response =
        await requestPermission();

      if (!response.granted) {
        setError(
          "Camera permission is required to scan a barcode."
        );

        return;
      }
    }

    setScanned(false);
    scanLockRef.current = false;
    setShowScanner(true);
  }

  function closeScanner() {
    setShowScanner(false);
    setScanned(false);
    scanLockRef.current = false;
  }

  function handleManualBarcodeChange(
    value: string
  ) {
    setBarcode(value);
    setProduct(null);
    setError("");
    setScanned(false);
    scanLockRef.current = false;
  }

  function openCountScreen() {
    if (!product) {
      return;
    }

    router.push({
      pathname: "/inventory-count",
      params: {
        barcode: product.barcode,
        name: product.name,
        expected: String(
          product.expectedQuantity
        ),
      },
    });
  }

  function openAddProductScreen() {
    const cleanedBarcode =
      barcode.trim();

    if (!cleanedBarcode) {
      setError(
        "Barcode is missing. Please scan or enter a barcode first."
      );

      return;
    }

    router.push({
      pathname: "/add-product",
      params: {
        barcode: cleanedBarcode,
      },
    });
  }

  function useSampleBarcode() {
    setBarcode("8901234567890");
    setProduct(null);
    setError("");
    setScanned(false);
    scanLockRef.current = false;
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
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Link
              href="/inventory"
              asChild
            >
              <Pressable
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

            <View>
              <Text className="text-2xl font-bold text-slate-900">
                Product Lookup
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Scan or enter a barcode
              </Text>
            </View>
          </View>
        </View>

        {/* Scanner */}
        {showScanner ? (
          <View className="mb-5 overflow-hidden rounded-3xl bg-black">
            <View className="h-[360px] w-full">
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: [
                    "ean13",
                    "ean8",
                    "upc_a",
                    "upc_e",
                    "code128",
                    "code39",
                    "code93",
                    "itf14",
                    "codabar",
                    "qr",
                  ],
                }}
                onBarcodeScanned={
                  scanned
                    ? undefined
                    : handleBarcodeScanned
                }
              />

              <View className="absolute inset-0 items-center justify-center">
                <View
                  className="h-52 w-[78%] rounded-2xl border-2 border-white"
                  style={{
                    backgroundColor:
                      "transparent",
                  }}
                />

                <View className="absolute bottom-7 rounded-full bg-black/70 px-5 py-2">
                  <Text className="text-center text-sm font-medium text-white">
                    Point the camera at a barcode
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={closeScanner}
                className="absolute right-4 top-4 h-11 w-11 items-center justify-center rounded-full bg-black/60"
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Barcode Input Card */}
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
          <View className="mb-4">
            <Text className="text-base font-bold text-slate-900">
              Barcode
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Enter the barcode manually or scan it
              using your camera.
            </Text>
          </View>

          <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <Ionicons
              name="barcode-outline"
              size={22}
              color="#64748B"
            />

            <TextInput
              value={barcode}
              onChangeText={
                handleManualBarcodeChange
              }
              placeholder="Enter barcode"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              autoCapitalize="none"
              className="ml-3 flex-1 py-4 text-base text-slate-900"
              editable={!loading}
            />
          </View>

          {/* Scan */}
          <Pressable
            onPress={openScanner}
            disabled={
              loading ||
              showScanner
            }
            className="mt-3 flex-row items-center justify-center rounded-2xl bg-slate-900 py-4 active:opacity-80"
          >
            <Ionicons
              name="scan-outline"
              size={21}
              color="white"
            />

            <Text className="ml-2 text-base font-bold text-white">
              {showScanner
                ? "Scanner Open"
                : "Scan Barcode"}
            </Text>
          </Pressable>

          {/* Find */}
          <Pressable
            onPress={() =>
              handleLookup()
            }
            disabled={
              loading ||
              !barcode.trim()
            }
            className={`mt-3 flex-row items-center justify-center rounded-2xl py-4 ${
              loading ||
              !barcode.trim()
                ? "bg-blue-300"
                : "bg-blue-600 active:bg-blue-700"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons
                  name="search-outline"
                  size={21}
                  color="white"
                />

                <Text className="ml-2 text-base font-bold text-white">
                  Find Product
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Error / Not Found */}
        {error ? (
          <View className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 p-5">
            <View className="flex-row items-start">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-100">
                <Ionicons
                  name="cube-outline"
                  size={23}
                  color="#EA580C"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-orange-900">
                  Product Not Found
                </Text>

                <Text className="mt-1 text-sm leading-5 text-orange-700">
                  This barcode isn't available in
                  your product database. You can add
                  it manually.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={
                openAddProductScreen
              }
              disabled={loading}
              className="mt-4 flex-row items-center justify-center rounded-2xl bg-orange-600 py-4 active:bg-orange-700"
            >
              <Ionicons
                name="add-circle-outline"
                size={21}
                color="white"
              />

              <Text className="ml-2 text-base font-bold text-white">
                Add New Product
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Product Found */}
        {product ? (
          <View
            className="mt-5 rounded-3xl bg-white p-5"
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
            <View className="mb-4 flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                <Ionicons
                  name="checkmark-circle"
                  size={27}
                  color="#16A34A"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-green-600">
                  Product Found
                </Text>

                <Text
                  className="mt-1 text-lg font-bold text-slate-900"
                  numberOfLines={2}
                >
                  {product.name}
                </Text>
              </View>
            </View>

            <View className="rounded-2xl bg-slate-50 p-4">
              <View className="flex-row justify-between">
                <Text className="text-sm text-slate-500">
                  Barcode
                </Text>

                <Text className="text-sm font-semibold text-slate-900">
                  {product.barcode}
                </Text>
              </View>

              <View className="my-3 h-px bg-slate-200" />

              <View className="flex-row justify-between">
                <Text className="text-sm text-slate-500">
                  Expected Quantity
                </Text>

                <Text className="text-sm font-bold text-slate-900">
                  {product.expectedQuantity}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={
                openCountScreen
              }
              className="mt-4 flex-row items-center justify-center rounded-2xl bg-blue-600 py-4 active:bg-blue-700"
            >
              <Ionicons
                name="clipboard-outline"
                size={21}
                color="white"
              />

              <Text className="ml-2 text-base font-bold text-white">
                Count Inventory
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Sample Barcode */}
        {!product &&
        !showScanner &&
        !error ? (
          <Pressable
            onPress={
              useSampleBarcode
            }
            disabled={loading}
            className="mt-5 flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white py-4 active:bg-slate-100"
          >
            <Ionicons
              name="flask-outline"
              size={19}
              color="#64748B"
            />

            <Text className="ml-2 text-sm font-semibold text-slate-600">
              Use Sample Barcode
            </Text>
          </Pressable>
        ) : null}

        {/* Information */}
        <View className="mt-6 flex-row items-start px-2">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#64748B"
          />

          <Text className="ml-2 flex-1 text-xs leading-5 text-slate-500">
            The scanner supports common retail
            barcodes such as EAN, UPC, Code 128,
            Code 39, and QR codes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}