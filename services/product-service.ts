import { MOCK_PRODUCTS } from "@/data/mock-products";
import {
  getProductByBarcode as getLocalProductByBarcode,
  saveProduct,
} from "@/database/product-db";
import { initializeInventoryDatabase } from "@/database/inventory-db";

import type { Product } from "@/types/product";

type OpenFoodFactsResponse = {
  code?: string;
  status?: string;
  product?: {
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    quantity?: string;
  };
  result?: {
    id?: string;
    name?: string;
  };
};

export async function getProductByBarcode(
  barcode: string
): Promise<Product | null> {
  const cleanedBarcode = barcode.trim();

  if (!cleanedBarcode) {
    return null;
  }

  console.log("========== PRODUCT LOOKUP ==========");
  console.log("Looking up barcode:", cleanedBarcode);

  try {
    // Make sure SQLite tables exist.
    await initializeInventoryDatabase();

    // --------------------------------------------------
    // 1. CHECK LOCAL SQLITE DATABASE
    // --------------------------------------------------

    const localProduct =
      await getLocalProductByBarcode(cleanedBarcode);

    if (localProduct) {
      console.log(
        "Product found in local SQLite:",
        localProduct
      );

      return {
        barcode: localProduct.barcode,
        name: localProduct.name,
        expectedQuantity: localProduct.expectedQuantity,
      };
    }

    console.log("Product not found in local SQLite.");

    // --------------------------------------------------
    // 2. CHECK MOCK PRODUCTS
    // --------------------------------------------------

    const mockProduct = MOCK_PRODUCTS.find(
      (item) => item.barcode === cleanedBarcode
    );

    if (mockProduct) {
      console.log(
        "Product found in MOCK_PRODUCTS:",
        mockProduct
      );

      // Save mock product locally too.
      await saveProduct({
        barcode: mockProduct.barcode,
        name: mockProduct.name,
        expectedQuantity: mockProduct.expectedQuantity,
        createdAt: new Date().toISOString(),
      });

      return mockProduct;
    }

    console.log("Product not found in MOCK_PRODUCTS.");

    // --------------------------------------------------
    // 3. CHECK OPEN FOOD FACTS
    // --------------------------------------------------

    const url =
      `https://world.openfoodfacts.org/api/v3/product/` +
      `${encodeURIComponent(cleanedBarcode)}` +
      `?product_type=all&fields=product_name,product_name_en,brands,quantity`;

    console.log("Open Food Facts URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Barcode-Inventory-Counter/1.0",
      },
    });

    console.log(
      "Open Food Facts status:",
      response.status
    );

    const data =
      (await response.json()) as OpenFoodFactsResponse;

    console.log(
      "Open Food Facts response:",
      JSON.stringify(data)
    );

    if (!response.ok) {
      console.log(
        "Product was not found in Open Food Facts."
      );

      return null;
    }

    const productName =
      data.product?.product_name_en?.trim() ||
      data.product?.product_name?.trim();

    const brand = data.product?.brands?.trim();

    if (!productName) {
      console.log(
        "Product exists but does not have a usable product name."
      );

      return null;
    }

    const product: Product = {
      barcode: cleanedBarcode,
      name: brand
        ? `${brand} ${productName}`
        : productName,
      expectedQuantity: 0,
    };

    // --------------------------------------------------
    // 4. SAVE API PRODUCT LOCALLY
    // --------------------------------------------------

    await saveProduct({
      barcode: product.barcode,
      name: product.name,
      expectedQuantity: product.expectedQuantity,
      createdAt: new Date().toISOString(),
    });

    console.log(
      "Open Food Facts product saved locally:",
      product
    );

    return product;
  } catch (error) {
    console.error(
      "Product lookup failed:",
      error
    );

    return null;
  }
}