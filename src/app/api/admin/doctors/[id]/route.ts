import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        // Profile
        profilePhotoUrl: true,
        gender: true,
        dateOfBirth: true,
        bio: true,
        // Professional credentials
        registrationNumber: true,
        medicalCouncil: true,
        registrationYear: true,
        specialization: true,
        qualification: true,
        experience: true,
        hospitalAffiliation: true,
        // Address
        address: true,
        city: true,
        state: true,
        pincode: true,
        // Documents
        medicalLicenseUrl: true,
        govtIdProofUrl: true,
        degreeCertificateUrl: true,
        signatureUrl: true,
        // Terms
        termsAcceptedAt: true,
        ethicsAcceptedAt: true,
        dataProtectionAcceptedAt: true,
        platformTermsAcceptedAt: true,
        // Status
        status: true,
        isActive: true,
        isEmailVerified: true,
        // Metrics
        avgRating: true,
        totalRatings: true,
        responseRate: true,
        avgCompletionTime: true,
        completedCertificates: true,
        consultationCount: true,
        certificatesByType: true,
        lastActive: true,
        // Timestamps
        createdAt: true,
        updatedAt: true,
        // Relations
        wallet: {
          select: {
            balance: true,
            totalEarnings: true,
            totalWithdrawn: true,
            pendingWithdrawals: true,
          },
        },
        _count: {
          select: {
            applications: true,
            withdrawals: true,
            payouts: true,
          },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Admin doctor detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctor details" },
      { status: 500 }
    );
  }
}
