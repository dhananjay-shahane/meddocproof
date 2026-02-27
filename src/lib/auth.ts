import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET environment variable is not set in production!");
  }
  return new TextEncoder().encode(secret || "meddocproof-secret-key-dev-only");
}

const JWT_EXPIRY = "7d";

export interface JWTPayload {
  id: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  type: "admin" | "doctor" | "user";
}

/**
 * Create a JWT token
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRY)
    .setIssuedAt()
    .sign(getJwtSecret());
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.substring(7);
}

/**
 * Generate a random OTP
 */
export function generateOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
