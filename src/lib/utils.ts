import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number into Bangladeshi Taka currency format (e.g., ৳ 1,450)
 */
export function formatBDT(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

/**
 * Validates Bangladesh Phone Number format (e.g., 01712345678 or +8801712345678)
 */
export function isValidBDPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return bdPhoneRegex.test(cleaned);
}

/**
 * Standardizes BD phone number format to 01XXXXXXXXX
 */
export function normalizeBDPhone(phone: string): string {
  let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  if (cleaned.startsWith("+88")) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith("88")) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Generates URL-friendly slug from title
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

/**
 * Generates unique readable Order Number (e.g. SCBD-2026-8942)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SCBD-${year}-${randomDigits}`;
}
