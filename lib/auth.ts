// JWT-based admin auth — replaces Firebase Auth
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
const getAdminPassword = () => process.env.ADMIN_PASSWORD || "TopTamil@Admin#2025";
const COOKIE_NAME = "ttt_admin_token";

export async function createAdminToken(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

const getAdminEmail = () => process.env.ADMIN_EMAIL || "toptamiltricks@gmail.com";

export function checkAdminCredentials(email: string, password: string): boolean {
  return email === getAdminEmail() && password === getAdminPassword();
}

export function checkAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function getAdminToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getAdminToken();
  if (!token) return false;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };

