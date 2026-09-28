import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const CUSTOMER_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "smartcasebd_jwt_secret_key_2026_flagship_secure_hash"
);

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "smartcasebd_admin_secret_key_2026_rbac_access_hash"
);

export interface JWTPayload {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EDITOR" | "CUSTOMER";
}

/**
 * Password Hashing
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * JWT Token Generation
 */
export async function signCustomerToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(CUSTOMER_JWT_SECRET);
}

export async function signAdminToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(ADMIN_JWT_SECRET);
}

/**
 * JWT Token Verification
 */
export async function verifyCustomerToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, CUSTOMER_JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, ADMIN_JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get current session user from cookies
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("smartcasebd_token")?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

export async function getCurrentAdmin(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("smartcasebd_admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
