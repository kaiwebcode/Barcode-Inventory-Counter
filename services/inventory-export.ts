import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import type { InventoryCount } from "@/types/inventory";

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export async function exportInventoryToCsv(
  counts: InventoryCount[],
): Promise<void> {
  if (counts.length === 0) {
    throw new Error("There are no inventory records to export.");
  }

  const headers = [
    "Barcode",
    "Product Name",
    "Expected Quantity",
    "Actual Quantity",
    "Difference",
    "Expiry Date",
    "Status",
    "Created At",
  ];

  const rows = counts.map((count) => [
    count.barcode,
    count.productName,
    count.expectedQuantity,
    count.actualQuantity,
    count.difference,
    count.expiryDate,
    count.status,
    count.createdAt,
  ]);

  const csv = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  const fileName = `inventory-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const sharingAvailable = await Sharing.isAvailableAsync();

  if (!sharingAvailable) {
    throw new Error("File sharing is not available on this device.");
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: "text/csv",
    dialogTitle: "Export Inventory CSV",
    UTI: "public.comma-separated-values-text",
  });
}