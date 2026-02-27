import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";
import { Prisma, CertificateType } from "@prisma/client";
import { createNotification } from "@/lib/notifications";

/**
 * Generate a human-readable application ID.
 * Format: MDP-DDMMYYYY-LAST4PHONE-SEQNUM
 * e.g.  MDP-21022026-7478-0003
 */
async function generateApplicationId(phone: string): Promise<string> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const datePart = `${dd}${mm}${yyyy}`;
  const phoneLast4 = phone.replace(/\D/g, "").slice(-4) || "0000";
  const prefix = `MDP-${datePart}-${phoneLast4}`;

  // Count existing applications today with same prefix
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const count = await prisma.application.count({
    where: {
      createdAt: { gte: todayStart, lt: todayEnd },
    },
  });

  const seq = String(count + 1).padStart(4, "0");
  return `${prefix}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { certificateType, formData } = body as {
      certificateType: string;
      formData: Record<string, unknown>;
    };

    if (!certificateType || !formData) {
      return NextResponse.json(
        { success: false, message: "Certificate type and form data are required" },
        { status: 400 }
      );
    }

    // Validate certificate type
    const validTypes = [
      "sick_leave", "fitness", "work_from_home", "caretaker",
      "recovery", "fit_to_fly", "unfit_to_work", "unfit_to_travel",
      "medical_diagnosis",
    ];
    if (!validTypes.includes(certificateType)) {
      return NextResponse.json(
        { success: false, message: "Invalid certificate type" },
        { status: 400 }
      );
    }

    // Validate required personal fields
    const requiredFields = [
      "firstName", "lastName", "phoneNumber", "email",
      "gender", "dateOfBirth", "street", "city", "state",
      "postalCode", "country", "guardianRelationship", "guardianName",
      "organizationName", "organizationLocatedIn",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate human-readable application ID
    const phone = (formData.phoneNumber as string) || "0000";
    const appDisplayId = await generateApplicationId(phone);

    // Create application with Phase 4 columns
    const application = await prisma.application.create({
      data: {
        applicationId: appDisplayId,
        userId: auth.user.id,
        certificateType: certificateType as CertificateType,
        formData: formData as Prisma.InputJsonValue,
        status: "submitted",
        paymentTier: (formData.paymentTier as string) || null,
        documentFormat: (formData.documentFormat as string) || null,
        specialFormatRequested: Boolean(formData.specialFormatAttestation),
        specialFormatFee: formData.specialFormatAttestation ? 250 : 0,
        termsAcceptedAt: formData.termsAccepted ? new Date() : null,
        otpVerifiedPhone: formData.otpVerified
          ? (formData.phoneNumber as string)
          : null,
        organizationLocatedIn:
          (formData.organizationLocatedIn as string) || null,
      },
    });

    // Note: Uploaded file URLs are stored in formData JSON.
    // The Document model is used by doctors/admin for application documents,
    // not for user-uploaded proof files which live in form data.

    // Notify admin about new application
    await createNotification(prisma, {
      adminId: "system",
      type: "new_application",
      title: "New Application Submitted",
      message: `New ${certificateType.replace(/_/g, " ")} certificate application #${application.applicationId} submitted`,
      metadata: {
        applicationId: application.applicationId,
        certificateType,
        userId: auth.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        applicationId: application.applicationId,
        certificateType: application.certificateType,
        status: application.status,
        createdAt: application.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Certificate apply error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 }
    );
  }
}
