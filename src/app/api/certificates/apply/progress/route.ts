/**
 * PATCH /api/certificates/apply/progress
 *
 * Called each time the user advances a step in the certificate
 * application form.  Updates currentStep, merges partial formData,
 * and refreshes lastActiveAt.  Emits a socket event so the admin
 * Temporary Applications panel updates in real-time.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";
import { emitToAdmins } from "@/lib/socket-server";
import { SOCKET_EVENTS } from "@/lib/socket-events";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { temporaryAppId, currentStep, formData } = body as {
      temporaryAppId?: string;
      currentStep?: number;
      formData?: Record<string, unknown>;
    };

    if (!temporaryAppId) {
      return NextResponse.json(
        { success: false, message: "temporaryAppId is required" },
        { status: 400 }
      );
    }

    // Verify ownership — only the owning user can update their draft
    const existing = await prisma.application.findFirst({
      where: {
        id: temporaryAppId,
        userId: auth.user.id,
        status: "in_progress",
      },
      select: {
        id: true,
        applicationId: true,
        formData: true,
        currentStep: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Application not found or already submitted" },
        { status: 404 }
      );
    }

    // Merge incoming formData with existing JSON
    const existingFormData =
      (existing.formData as Record<string, unknown>) ?? {};
    const mergedFormData: Record<string, unknown> = {
      ...existingFormData,
      ...(formData ?? {}),
    };

    const updated = await prisma.application.update({
      where: { id: temporaryAppId },
      data: {
        currentStep: currentStep ?? existing.currentStep,
        lastActiveAt: new Date(),
        formData: mergedFormData as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    });

    // Build partial form-data snapshot for admin (only identity fields)
    const fd = mergedFormData as Record<string, string | undefined>;
    const partialFormData = {
      firstName: fd.firstName,
      lastName: fd.lastName,
      phoneNumber: fd.phoneNumber,
      email: fd.email,
    };

    emitToAdmins(SOCKET_EVENTS.TEMPORARY_STEP_UPDATED, {
      id: updated.id,
      applicationId: updated.applicationId,
      currentStep: updated.currentStep,
      lastActiveAt: updated.lastActiveAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      formData: partialFormData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[progress] Error updating progress:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update progress" },
      { status: 500 }
    );
  }
}
