import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (doctor.status !== "approved") {
      return NextResponse.json(
        { success: false, message: `Your account is ${doctor.status}. Please contact admin.` },
        { status: 403 }
      );
    }

    if (!doctor.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated" },
        { status: 403 }
      );
    }

    const isValid = await comparePassword(password, doctor.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: doctor.id,
      email: doctor.email,
      role: "doctor" as never,
      type: "doctor",
    });

    // Update last active
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { lastActive: new Date() },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        status: doctor.status,
        isActive: doctor.isActive,
        specialization: doctor.specialization,
        registrationNumber: doctor.registrationNumber,
        type: "doctor",
      },
    });

    // Set httpOnly cookie — separate from user/admin
    response.cookies.set("doctor_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Doctor login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
