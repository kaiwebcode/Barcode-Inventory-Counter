import type { InventoryCount } from "@/types/inventory";

type SubmitInventoryResponse = {
  success: boolean;
  message: string;
  submittedAt: string;
};

export async function submitInventoryCount(
  count: InventoryCount
): Promise<SubmitInventoryResponse> {
  // Simulate network/API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Basic mock API validation
  if (!count.barcode || !count.productName) {
    throw new Error("Invalid inventory data.");
  }

  if (count.actualQuantity < 0) {
    throw new Error("Quantity cannot be negative.");
  }

  // Simulated successful API response
  return {
    success: true,
    message: "Inventory count submitted successfully.",
    submittedAt: new Date().toISOString(),
  };
}