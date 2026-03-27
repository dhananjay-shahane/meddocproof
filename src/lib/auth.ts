import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";
import { randomInt } from "crypto";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is not set in production!");
    }
    if (process.env.NODE_ENV === "test") {
      return new TextEncoder().encode("test-secret-key-do-not-use");
    }
    console.warn("[Auth] JWT_SECRET not set — using insecure dev-only fallback");
    return new TextEncoder().encode("meddocproof-secret-key-dev-only");
  }
  return new TextEncoder().encode(secret);
}

const JWT_EXPIRY = "7d";

export interface JWTPayload {
  id: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  type: "admin" | "doctor" | "user";
}

const VALID_TYPES = new Set(["admin", "doctor", "user"]);

function isJWTPayload(value: unknown): value is JWTPayload {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.role === "string" &&
    typeof obj.type === "string" &&
    VALID_TYPES.has(obj.type)
  );
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
    if (!isJWTPayload(payload)) return null;
    return payload;
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
 * Generate a random OTP using cryptographically secure random numbers
 */
export function generateOTP(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10).toString();
  }
  return otp;
}
