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
        profilePhotoUrl: true,
        gender: true,
        dateOfBirth: true,
        bio: true,
        registrationNumber: true,
        medicalCouncil: true,
        registrationYear: true,
        specialization: true,
        qualification: true,
        experience: true,
        hospitalAffiliation: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        signatureUrl: true,
        status: true,
        isActive: true,
        isEmailVerified: true,
        avgRating: true,
        totalRatings: true,
        completedCertificates: true,
        createdAt: true,
        updatedAt: true,
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
      profilePhotoUrl,
      gender,
      dateOfBirth,
      bio,
      medicalCouncil,
      registrationYear,
      specialization,
      qualification,
      experience,
      hospitalAffiliation,
      address,
      city,
      state,
      pincode,
      signatureUrl,
    } = body;

    const updated = await prisma.doctor.update({
      where: { id: auth.doctorUser.id },
      data: {
        ...(fullName && { fullName }),
        ...(phoneNumber !== undefined && { phoneNumber: phoneNumber || null }),
        ...(profilePhotoUrl !== undefined && { profilePhotoUrl: profilePhotoUrl || null }),
        ...(gender !== undefined && { gender: gender || null }),
        ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(medicalCouncil !== undefined && { medicalCouncil: medicalCouncil || null }),
        ...(registrationYear !== undefined && { registrationYear: registrationYear ? (parseInt(registrationYear) || null) : null }),
        ...(specialization && { specialization }),
        ...(qualification && { qualification }),
        ...(experience !== undefined && { experience: parseInt(experience) || 0 }),
        ...(hospitalAffiliation !== undefined && { hospitalAffiliation: hospitalAffiliation || null }),
        ...(address !== undefined && { address: address || null }),
        ...(city !== undefined && { city: city || null }),
        ...(state !== undefined && { state: state || null }),
        ...(pincode !== undefined && { pincode: pincode || null }),
        ...(signatureUrl !== undefined && { signatureUrl: signatureUrl || null }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        profilePhotoUrl: true,
        gender: true,
        dateOfBirth: true,
        bio: true,
        registrationNumber: true,
        medicalCouncil: true,
        registrationYear: true,
        specialization: true,
        qualification: true,
        experience: true,
        hospitalAffiliation: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        signatureUrl: true,
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
