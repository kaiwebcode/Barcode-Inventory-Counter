import * as SQLite from "expo-sqlite";

import type { InventoryCount } from "@/types/inventory";

const DATABASE_NAME = "inventory.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function initializeInventoryDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      barcode TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      expected_quantity INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory_counts (
      id TEXT PRIMARY KEY NOT NULL,
      barcode TEXT NOT NULL UNIQUE,
      product_name TEXT NOT NULL,
      expected_quantity INTEGER NOT NULL,
      actual_quantity INTEGER NOT NULL,
      difference INTEGER NOT NULL,
      expiry_date TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export async function saveInventoryCount(count: InventoryCount): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      INSERT INTO inventory_counts (
        id,
        barcode,
        product_name,
        expected_quantity,
        actual_quantity,
        difference,
        expiry_date,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(barcode) DO UPDATE SET
        product_name = excluded.product_name,
        expected_quantity = excluded.expected_quantity,
        actual_quantity = excluded.actual_quantity,
        difference = excluded.difference,
        expiry_date = excluded.expiry_date,
        status = excluded.status,
        created_at = excluded.created_at;
    `,
    count.id,
    count.barcode,
    count.productName,
    count.expectedQuantity,
    count.actualQuantity,
    count.difference,
    count.expiryDate,
    count.status,
    count.createdAt,
  );
}

export async function getInventoryCounts(): Promise<InventoryCount[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    id: string;
    barcode: string;
    product_name: string;
    expected_quantity: number;
    actual_quantity: number;
    difference: number;
    expiry_date: string;
    status: InventoryCount["status"];
    created_at: string;
  }>(
    `
      SELECT
        id,
        barcode,
        product_name,
        expected_quantity,
        actual_quantity,
        difference,
        expiry_date,
        status,
        created_at
      FROM inventory_counts
      ORDER BY created_at DESC;
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    barcode: row.barcode,
    productName: row.product_name,
    expectedQuantity: row.expected_quantity,
    actualQuantity: row.actual_quantity,
    difference: row.difference,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function getInventoryCountByBarcode(
  barcode: string,
): Promise<InventoryCount | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    id: string;
    barcode: string;
    product_name: string;
    expected_quantity: number;
    actual_quantity: number;
    difference: number;
    expiry_date: string;
    status: InventoryCount["status"];
    created_at: string;
  }>(
    `
      SELECT
        id,
        barcode,
        product_name,
        expected_quantity,
        actual_quantity,
        difference,
        expiry_date,
        status,
        created_at
      FROM inventory_counts
      WHERE barcode = ?
      LIMIT 1;
    `,
    barcode,
  );

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    barcode: row.barcode,
    productName: row.product_name,
    expectedQuantity: row.expected_quantity,
    actualQuantity: row.actual_quantity,
    difference: row.difference,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function updateInventoryStatus(
  id: string,
  status: InventoryCount["status"],
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE inventory_counts
      SET status = ?
      WHERE id = ?;
    `,
    status,
    id,
  );
}

export async function deleteInventoryCount(id: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM inventory_counts
      WHERE id = ?;
    `,
    id,
  );
}
