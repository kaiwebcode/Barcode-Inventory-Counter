import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    barcode: "8901234567890",
    name: "Coca Cola 500ml",
    expectedQuantity: 50,
  },
  {
    barcode: "8901234567891",
    name: "Pepsi 500ml",
    expectedQuantity: 30,
  },
  {
    barcode: "8901234567892",
    name: "Lays Classic 50g",
    expectedQuantity: 40,
  },
  {
    barcode: "8901234567893",
    name: "Parle-G Biscuits",
    expectedQuantity: 25,
  },
  {
    barcode: "8901234567894",
    name: "Tata Salt 1kg",
    expectedQuantity: 20,
  },
];