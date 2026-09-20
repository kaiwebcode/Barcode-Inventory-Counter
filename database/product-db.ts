import * as SQLite from "expo-sqlite";

export type LocalProduct = {
  barcode: string;
  name: string;
  expectedQuantity: number;
  createdAt: string;
};

const DATABASE_NAME = "inventory.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function saveProduct(
  product: LocalProduct
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      INSERT INTO products (
        barcode,
        name,
        expected_quantity,
        created_at
      )
      VALUES (?, ?, ?, ?)
      ON CONFLICT(barcode) DO UPDATE SET
        name = excluded.name,
        expected_quantity = excluded.expected_quantity,
        created_at = excluded.created_at;
    `,
    product.barcode,
    product.name,
    product.expectedQuantity,
    product.createdAt
  );
}

export async function getProductByBarcode(
  barcode: string
): Promise<LocalProduct | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    barcode: string;
    name: string;
    expected_quantity: number;
    created_at: string;
  }>(
    `
      SELECT
        barcode,
        name,
        expected_quantity,
        created_at
      FROM products
      WHERE barcode = ?
      LIMIT 1;
    `,
    barcode
  );

  if (!row) {
    return null;
  }

  return {
    barcode: row.barcode,
    name: row.name,
    expectedQuantity: row.expected_quantity,
    createdAt: row.created_at,
  };
}

export async function getProducts(): Promise<LocalProduct[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    barcode: string;
    name: string;
    expected_quantity: number;
    created_at: string;
  }>(
    `
      SELECT
        barcode,
        name,
        expected_quantity,
        created_at
      FROM products
      ORDER BY created_at DESC;
    `
  );

  return rows.map((row) => ({
    barcode: row.barcode,
    name: row.name,
    expectedQuantity: row.expected_quantity,
    createdAt: row.created_at,
  }));
}

export async function deleteProduct(
  barcode: string
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM products
      WHERE barcode = ?;
    `,
    barcode
  );
}