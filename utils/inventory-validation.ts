export type QuantityValidation =
  | {
      valid: true;
      value: number;
    }
  | {
      valid: false;
      message: string;
    };

export type ExpiryValidation =
  | {
      valid: true;
      value: string;
    }
  | {
      valid: false;
      message: string;
    };

export function validateQuantity(
  value: string,
): QuantityValidation {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: "Enter the actual quantity.",
    };
  }

  const quantity = Number(trimmed);

  if (!Number.isFinite(quantity)) {
    return {
      valid: false,
      message: "Enter a valid number.",
    };
  }

  if (!Number.isInteger(quantity)) {
    return {
      valid: false,
      message: "Quantity must be a whole number.",
    };
  }

  if (quantity < 0) {
    return {
      valid: false,
      message: "Quantity cannot be negative.",
    };
  }

  return {
    valid: true,
    value: quantity,
  };
}

export function getDifference(
  expected: number,
  actual: number,
): number {
  return actual - expected;
}

export function toDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isExpired(date: Date): boolean {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiry = new Date(date);

  expiry.setHours(0, 0, 0, 0);

  return expiry < today;
}

export function parseInventoryDate(
  value: string,
): Date | null {
  const trimmed = value.trim();

  const match = trimmed.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/,
  );

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);

  // Prevent JavaScript from accepting invalid dates
  // such as 31/02/2026 by automatically changing them.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function validateExpiryDate(
  value: string,
): ExpiryValidation {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: "Select an expiry date.",
    };
  }

  const date = parseInventoryDate(trimmed);

  if (!date) {
    return {
      valid: false,
      message: "Enter a valid expiry date.",
    };
  }

  if (isExpired(date)) {
    return {
      valid: false,
      message: "The expiry date cannot be in the past.",
    };
  }

  return {
    valid: true,
    value: trimmed,
  };
}

export function isInventoryExpiryExpired(
  value: string,
): boolean {
  const date = parseInventoryDate(value);

  if (!date) {
    return false;
  }

  return isExpired(date);
}