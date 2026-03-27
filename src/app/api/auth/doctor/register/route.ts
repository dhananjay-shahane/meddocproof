import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";
import { createNotification } from "@/lib/notifications";
import { emitToAdmins } from "@/lib/socket-server";
import { SOCKET_EVENTS } from "@/lib/socket-events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Required fields
      fullName,
      email,
      password,
      registrationNumber,
      specialization,
      qualification,
      experience,
      // New optional fields
      phoneNumber,
      profilePhotoUrl,
      gender,
      dateOfBirth,
      bio,
      medicalCouncil,
      registrationYear,
      hospitalAffiliation,
      address,
      city,
      state,
      pincode,
      medicalLicenseUrl,
      govtIdProofUrl,
      degreeCertificateUrl,
      signatureUrl,
      termsAccepted,
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

    // Prepare terms acceptance timestamps
    const now = termsAccepted ? new Date() : null;

    // Create doctor with pending status
    const doctor = await prisma.doctor.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        // Profile fields
        profilePhotoUrl: profilePhotoUrl || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        bio: bio || null,
        // Professional credentials
        registrationNumber,
        medicalCouncil: medicalCouncil || null,
        registrationYear: registrationYear ? parseInt(registrationYear, 10) : null,
        specialization,
        qualification,
        experience: parseInt(experience, 10),
        hospitalAffiliation: hospitalAffiliation || null,
        // Address
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        // Documents
        medicalLicenseUrl: medicalLicenseUrl || null,
        govtIdProofUrl: govtIdProofUrl || null,
        degreeCertificateUrl: degreeCertificateUrl || null,
        signatureUrl: signatureUrl || null,
        // Terms timestamps
        termsAcceptedAt: now,
        ethicsAcceptedAt: now,
        dataProtectionAcceptedAt: now,
        platformTermsAcceptedAt: now,
        // Status
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

    // Notify admin about new doctor registration
    await createNotification(prisma, {
      adminId: "system",
      type: "doctor_registered",
      title: "New Doctor Registration",
      message: `Dr. ${doctor.fullName} has registered (${doctor.specialization}) — pending approval`,
      metadata: { doctorId: doctor.id, specialization: doctor.specialization },
    });
    emitToAdmins(SOCKET_EVENTS.DOCTOR_REGISTERED, {
      doctorId: doctor.id,
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      createdAt: doctor.createdAt.toISOString(),
    });

    // Send confirmation email to the doctor
    const emailTemplate = emailTemplates.doctorRegistrationConfirmation(
      doctor.fullName,
      doctor.email
    );
    await sendEmail({
      to: doctor.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
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
