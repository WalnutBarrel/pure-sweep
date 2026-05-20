import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(amount);
}

export function serialize<T>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Dates
  if (data instanceof Date) {
    return data.toISOString() as any;
  }

  // Handle Prisma Decimals
  if (
    typeof data === "object" &&
    (data.constructor?.name === "Decimal" ||
      data.constructor?.name === "Decimal2" ||
      typeof data.toNumber === "function")
  ) {
    return data.toNumber();
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serialize(item)) as any;
  }

  // Handle Objects
  if (typeof data === "object") {
    const serializedObj: any = {};
    for (const key of Object.keys(data)) {
      serializedObj[key] = serialize(data[key]);
    }
    return serializedObj;
  }

  return data;
}
