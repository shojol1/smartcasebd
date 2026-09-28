import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminToken } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid credentials input" }, { status: 400 });
    }

    const { phoneOrEmail, password } = validation.data;

    // Find User by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
      },
    });

    if (!user || !user.status) {
      return NextResponse.json({ error: "Invalid credentials or inactive account" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"].includes(user.role)) {
      return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate Admin JWT Token
    const token = await signAdminToken({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role as any,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set HttpOnly Cookie
    response.cookies.set("smartcasebd_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal server error during login" }, { status: 500 });
  }
}
