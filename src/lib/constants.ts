export const SITE_CONFIG = {
  name: "SMARTCASEBD",
  tagline: "Premium Protection for Flagship Devices",
  description: "Bangladesh's premier store for luxury & protective smartphone cases for iPhone, Samsung Galaxy, Pixel, OnePlus, Xiaomi flagships.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://smartcasebd.com",
  phone: "+880 1700-000000",
  email: "support@smartcasebd.com",
  address: "Level 4, Jamuna Future Park, Kuril, Dhaka-1229, Bangladesh",
  freeShippingThreshold: 2500, // Free delivery for orders >= 2500 BDT
};

export const DELIVERY_RATES = {
  INSIDE_DHAKA: 60,
  OUTSIDE_DHAKA: 120,
};

export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

export const BD_DISTRICTS: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Faridpur", "Manikganj", "Munshiganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Noakhali", "Brahmanbaria"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Naogaon", "Natore", "Sirajganj"],
  Khulna: ["Khulna", "Jeshore", "Kushtia", "Satkhira", "Bagerhat"],
  Barishal: ["Barishal", "Bhola", "Patuakhali", "Pirojpur"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  CONFIRMED: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  PROCESSING: { label: "Processing", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  PACKED: { label: "Packed", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  SHIPPED: { label: "Shipped", color: "text-cyan-700", bg: "bg-cyan-50 border-cyan-200" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  DELIVERED: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  CANCELLED: { label: "Cancelled", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  RETURNED: { label: "Returned", color: "text-slate-700", bg: "bg-slate-100 border-slate-300" },
  REFUNDED: { label: "Refunded", color: "text-pink-700", bg: "bg-pink-50 border-pink-200" },
};

export const CASE_MATERIALS = [
  "Aramid Fiber (Kevlar)",
  "MagSafe Armor Polycarbonate",
  "Premium Genuine Leather",
  "Soft Liquid Silicone",
  "Anti-Yellowing Crystal Clear",
  "Shockproof TPU & Carbon",
] as const;
