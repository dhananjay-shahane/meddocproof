import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// GET — fetch doctor profile
export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctor = await prisma.doctor.findUnique({
      where: { id: auth.doctorUser.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        registrationNumber: true,
        specialization: true,
        qualification: true,
        experience: true,
        hospitalAffiliation: true,
        status: true,
        isActive: true,
        isEmailVerified: true,
        avgRating: true,
        totalRatings: true,
        completedCertificates: true,
        createdAt: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Fetch notification prefs from settings
    const notifPref = await prisma.setting.findUnique({
      where: { key: `doctor_notifications_${doctor.id}` },
    });

    // Fetch bank details from settings
    const bankDetailsSetting = await prisma.setting.findUnique({
      where: { key: `doctor_bank_details_${doctor.id}` },
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: doctor,
        bankDetails: bankDetailsSetting?.value ?? null,
        notificationPreferences: notifPref?.value ?? {
          emailNotifications: true,
          smsNotifications: true,
          newApplicationAlert: true,
          paymentAlert: true,
          withdrawalAlert: true,
        },
      },
    });
  } catch (error) {
    console.error("Doctor settings GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load settings" },
      { status: 500 }
    );
  }
}

// PUT — update doctor profile
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const {
      fullName,
      phoneNumber,
      specialization,
      qualification,
      experience,
      hospitalAffiliation,
    } = body;

    const updated = await prisma.doctor.update({
      where: { id: auth.doctorUser.id },
      data: {
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(specialization && { specialization }),
        ...(qualification && { qualification }),
        ...(experience !== undefined && { experience: parseInt(experience) }),
        ...(hospitalAffiliation !== undefined && { hospitalAffiliation }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        specialization: true,
        qualification: true,
        experience: true,
        hospitalAffiliation: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Doctor settings PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
