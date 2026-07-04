// Admin auth API — POST /api/auth
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
const getAdminEmail = () => process.env.ADMIN_EMAIL || "toptamiltricks@gmail.com";
const getAdminPassword = () => process.env.ADMIN_PASSWORD || "TopTamil@Admin#2025";
const COOKIE_NAME = "ttt_admin_token";

export async function POST(req: NextRequest) {
  const { action, email, password, token } = await req.json() as { 
    action: string; 
    email?: string; 
    password?: string; 
    token?: string; 
  };

  const secret = getSecret();
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  if (action === "login") {
    console.log("Login attempt - Email:", email, "Expected Email:", adminEmail);
    if (!email || !password || email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }
    const jwt = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  }

  if (action === "verify") {
    const cookieStore = await cookies();
    const cookieToken = token || cookieStore.get(COOKIE_NAME)?.value;
    if (!cookieToken) return NextResponse.json({ authenticated: false });
    try {
      await jwtVerify(cookieToken, secret);
      return NextResponse.json({ authenticated: true });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  }

  if (action === "logout") {
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return res;
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ authenticated: false });
  try {
    await jwtVerify(token, getSecret());
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

