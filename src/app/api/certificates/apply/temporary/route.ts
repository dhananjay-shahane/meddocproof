/**
 * POST /api/certificates/apply/temporary
 *
 * Called the instant a user selects a certificate type (Step 0).
 * Creates an Application record with status=in_progress so admins
 * can see it immediately in the Temporary Applications panel.
 *
 * Returns { id, applicationId } so the client can use the id
 * for subsequent progress updates.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";
import { CertificateType } from "@prisma/client";
import { emitToAdmins } from "@/lib/socket-server";
import { SOCKET_EVENTS } from "@/lib/socket-events";

const VALID_CERT_TYPES = [
  "sick_leave", "fitness", "work_from_home", "caretaker",
  "recovery", "fit_to_fly", "unfit_to_work", "unfit_to_travel",
  "medical_diagnosis",
];

async function generateTempApplicationId(): Promise<string> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const datePart = `${dd}${mm}${yyyy}`;
  const prefix = `TMP-${datePart}`;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const count = await prisma.application.count({
    where: { createdAt: { gte: todayStart, lt: todayEnd } },
  });
  const seq = String(count + 1).padStart(4, "0");
  return `${prefix}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const certificateType = body?.certificateType as string | undefined;

    if (!certificateType || !VALID_CERT_TYPES.includes(certificateType)) {
      return NextResponse.json(
        { success: false, message: "Valid certificate type is required" },
        { status: 400 }
      );
    }

    const applicationId = await generateTempApplicationId();

    const application = await prisma.application.create({
      data: {
        applicationId,
        userId: auth.user.id,
        certificateType: certificateType as CertificateType,
        formData: {},
        status: "in_progress",
        currentStep: 0,
        lastActiveAt: new Date(),
      },
      include: {
        user: { select: { id: true, fullName: true, phoneNumber: true, email: true } },
      },
    });

    // Emit to all connected admins
    emitToAdmins(SOCKET_EVENTS.TEMPORARY_CREATED, {
      id: application.id,
      applicationId: application.applicationId,
      certificateType: application.certificateType,
      currentStep: application.currentStep,
      lastActiveAt: application.lastActiveAt.toISOString(),
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      formData: {},
      user: application.user,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        applicationId: application.applicationId,
      },
    });
  } catch (error) {
    console.error("[temporary] Error creating temp application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create temporary application" },
      { status: 500 }
    );
  }
}
