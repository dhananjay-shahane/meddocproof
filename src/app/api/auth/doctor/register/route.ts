import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      password,
      phoneNumber,
      registrationNumber,
      specialization,
      qualification,
      experience,
    } = body;

    // Validate required fields
    if (!fullName || !email || !password || !registrationNumber || !specialization || !qualification || !experience) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "A doctor with this email already exists" },
        { status: 409 }
      );
    }

    // Check if registration number already exists
    const existingRegNumber = await prisma.doctor.findUnique({
      where: { registrationNumber },
    });

    if (existingRegNumber) {
      return NextResponse.json(
        { success: false, message: "A doctor with this registration number already exists" },
        { status: 409 }
      );
    }

    // Check if phone number already exists (if provided)
    if (phoneNumber) {
      const existingPhone = await prisma.doctor.findUnique({
        where: { phoneNumber },
      });

      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: "A doctor with this phone number already exists" },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create doctor with pending status
    const doctor = await prisma.doctor.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        registrationNumber,
        specialization,
        qualification,
        experience: parseInt(experience, 10),
        status: "pending",
        isActive: false,
        isEmailVerified: false,
      },
    });

    // Create their wallet
    await prisma.doctorWallet.create({
      data: {
        doctorId: doctor.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully. You will be notified once your account is approved by an admin.",
        doctor: {
          id: doctor.id,
          fullName: doctor.fullName,
          email: doctor.email,
          status: doctor.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Doctor registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
