import {
  getDifference,
  parseInventoryDate,
  validateExpiryDate,
  validateQuantity,
} from "@/utils/inventory-validation";

describe("Inventory quantity validation", () => {
  it("accepts a valid whole number", () => {
    expect(validateQuantity("10")).toEqual({
      valid: true,
      value: 10,
    });
  });

  it("rejects an empty quantity", () => {
    expect(validateQuantity("")).toEqual({
      valid: false,
      message: "Enter the actual quantity.",
    });
  });

  it("rejects decimal quantities", () => {
    expect(validateQuantity("10.5")).toEqual({
      valid: false,
      message: "Quantity must be a whole number.",
    });
  });

  it("rejects negative quantities", () => {
    expect(validateQuantity("-1")).toEqual({
      valid: false,
      message: "Quantity cannot be negative.",
    });
  });
});

describe("Inventory difference", () => {
  it("calculates shortage correctly", () => {
    expect(getDifference(10, 7)).toBe(-3);
  });

  it("calculates surplus correctly", () => {
    expect(getDifference(10, 12)).toBe(2);
  });

  it("returns zero when quantities match", () => {
    expect(getDifference(10, 10)).toBe(0);
  });
});

describe("Inventory date validation", () => {
  it("parses DD/MM/YYYY correctly", () => {
    const date = parseInventoryDate("25/12/2026");

    expect(date).not.toBeNull();
    expect(date?.getDate()).toBe(25);
    expect(date?.getMonth()).toBe(11);
    expect(date?.getFullYear()).toBe(2026);
  });

  it("rejects impossible dates", () => {
    expect(parseInventoryDate("31/02/2026")).toBeNull();
  });

  it("rejects malformed dates", () => {
    expect(parseInventoryDate("2026-12-25")).toBeNull();
  });

  it("rejects an expired date", () => {
    expect(validateExpiryDate("01/01/2020").valid).toBe(false);
  });

  it("accepts a future expiry date", () => {
    expect(validateExpiryDate("25/12/2099")).toEqual({
      valid: true,
      value: "25/12/2099",
    });
  });
});