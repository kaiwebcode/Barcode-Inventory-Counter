export type InventoryStatus = "pending" | "submitted";

export type InventoryCount = {
  id: string;
  barcode: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  difference: number;
  expiryDate: string;
  status: InventoryStatus;
  createdAt: string;
};