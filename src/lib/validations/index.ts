import { z } from "zod";

/**
 * Bangladesh Phone Number Regex: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
 */
const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

/**
 * Customer Register & Login Schemas
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(bdPhoneRegex, "Enter a valid 11-digit BD phone number (e.g., 01700000000)"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Admin Login Schema
 */
export const adminLoginSchema = z.object({
  phoneOrEmail: z.string().min(1, "Phone number or email is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Checkout Address & Order Schema
 */
export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Full name is required"),
  customerPhone: z
    .string()
    .transform((val) => val.replace(/\s+/g, "").replace(/-/g, ""))
    .pipe(z.string().regex(bdPhoneRegex, "Enter valid 11-digit BD phone number (e.g. 01712345678)")),
  customerEmail: z.union([z.string().trim().email("Invalid email address"), z.literal(""), z.null()]).optional(),
  division: z.string().min(1, "Select division"),
  district: z.string().min(1, "Select district"),
  upazila: z.string().trim().min(1, "Select upazila/area"),
  streetAddress: z.string().trim().min(3, "Enter detailed street address"),
  deliveryNote: z.union([z.string(), z.literal(""), z.null()]).optional(),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "CARD"]).default("COD"),
  couponCode: z.union([z.string(), z.literal(""), z.null()]).optional(),
});

/**
 * Admin Phone Brand Schema
 */
export const brandSchema = z.object({
  name: z.string().min(2, "Brand name is required"),
  logo: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  status: z.boolean().default(true),
});

/**
 * Admin Series Schema
 */
export const seriesSchema = z.object({
  brandId: z.string().min(1, "Select brand"),
  name: z.string().min(1, "Series name is required"),
  sortOrder: z.coerce.number().default(0),
  status: z.boolean().default(true),
});

/**
 * Admin Phone Model Schema
 */
export const phoneModelSchema = z.object({
  seriesId: z.string().min(1, "Select series"),
  name: z.string().min(1, "Phone model name is required"),
  image: z.string().optional(),
  releaseYear: z.coerce.number().optional(),
  sortOrder: z.coerce.number().default(0),
  status: z.boolean().default(true),
});

/**
 * Admin Product Creation Schema
 */
export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  categoryId: z.string().min(1, "Select category"),
  brandId: z.string().min(1, "Select phone brand"),
  phoneModelId: z.string().min(1, "Select compatible phone model"),
  description: z.string().min(10, "Provide a descriptive product overview"),
  shortDescription: z.string().optional(),
  basePrice: z.coerce.number().positive("Base price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional().nullable(),
  costPrice: z.coerce.number().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  material: z.string().min(1, "Select material"),
  color: z.string().optional(),
  finish: z.string().optional(),
  magSafeCompatible: z.boolean().default(false),
  warrantyInfo: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(z.string()).min(1, "At least 1 product image is required"),
});

/**
 * Admin Coupon Schema
 */
export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 chars").toUpperCase(),
  discountType: z.enum(["FIXED", "PERCENTAGE"]),
  discountValue: z.coerce.number().positive("Discount value must be positive"),
  minOrderValue: z.coerce.number().default(0),
  maxDiscountAmount: z.coerce.number().optional().nullable(),
  usageLimit: z.coerce.number().optional().nullable(),
  perUserLimit: z.coerce.number().default(1),
  endDate: z.string().optional().nullable(),
  status: z.boolean().default(true),
});

/**
 * Review Submission Schema
 */
export const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID required"),
  userName: z.string().min(2, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
});
