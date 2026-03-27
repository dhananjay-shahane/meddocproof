import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) {
      console.log("Doctor applications auth error:", auth.status);
      return auth;
    }

    const doctorId = auth.doctorUser.id;
    console.log("Doctor applications request from:", doctorId);
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const tab = searchParams.get("tab") || "pending"; // "pending" or "completed"
    const certificateType = searchParams.get("certificateType") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const where: Prisma.ApplicationWhereInput = { assignedDoctorId: doctorId };

    // Filter by tab
    if (tab === "pending") {
      where.status = {
        in: [
          "assigned",
          "doctor_assigned",
          "pending_doctor_review",
          "under_review",
          "consultation_scheduled",
        ],
      };
    } else if (tab === "completed") {
      where.status = {
        in: ["completed", "delivered", "certificate_delivered", "rejected"],
      };
    }

    if (status) {
      where.status = status;
    }

    if (certificateType) {
      where.certificateType = certificateType;
    }

    if (search) {
      where.OR = [
        { applicationId: { contains: search, mode: "insensitive" } },
        { certificateNumber: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { phoneNumber: { contains: search } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get stats counts
    const [
      totalApplications,
      pendingReview,
      completedCount,
      medicalAssessmentCount,
    ] = await Promise.all([
      prisma.application.count({ where: { assignedDoctorId: doctorId } }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: {
            in: [
              "assigned",
              "doctor_assigned",
              "pending_doctor_review",
              "under_review",
              "consultation_scheduled",
            ],
          },
        },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: { in: ["completed", "delivered", "certificate_delivered"] },
        },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          hasMedicalAssessment: true,
        },
      }),
    ]);

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              fullName: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    // Calculate age from dateOfBirth string
    const calculateAge = (dobString: string | null | undefined): number | null => {
      if (!dobString) return null;
      try {
        const today = new Date();
        const birthDate = new Date(dobString);
        if (isNaN(birthDate.getTime())) return null;
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      } catch {
        return null;
      }
    };

    const items = applications.map((app) => {
      // Extract form data fields
      const formData = app.formData as Record<string, unknown> | null;
      
      // Get age from formData - either as direct age or calculated from DOB
      const dobString = (formData?.dateOfBirth as string) ?? (formData?.dob as string) ?? null;
      const directAge = formData?.age ? Number(formData.age) : null;
      const calculatedAge = calculateAge(dobString);
      
      return {
        id: app.id,
        applicationId: app.applicationId,
        applicationDisplayId: app.applicationId,
        certificateType: app.certificateType,
        certificateNumber: app.certificateNumber,
        status: app.status,
        
        // User info
        userName: app.user?.fullName ?? (formData?.fullName as string) ?? "Unknown",
        userPhone: app.user?.phoneNumber ?? (formData?.phone as string) ?? "",
        userEmail: app.user?.email ?? (formData?.email as string) ?? "",
        userGender: (formData?.gender as string) ?? null,
        userAge: directAge ?? calculatedAge,
        
        // Form data fields
        organization: (formData?.organizationName as string) ?? (formData?.institution as string) ?? (formData?.company as string) ?? null,
        leaveReason: (formData?.symptoms as string) ?? (formData?.reason as string) ?? (formData?.medicalCondition as string) ?? null,
        leavePeriodFrom: (formData?.startDate as string) ?? (formData?.leaveStartDate as string) ?? null,
        leavePeriodTo: (formData?.endDate as string) ?? (formData?.leaveEndDate as string) ?? null,
        location: formData?.city && formData?.state 
          ? `${formData.city}, ${formData.state}` 
          : (formData?.address as string) ?? null,
        
        // Consultation info
        consultationDate: app.consultationDate?.toISOString() ?? null,
        consultationNotes: app.consultationNotes,
        consultationCompleted: app.consultationCompleted,
        
        // Assessment status
        hasMedicalAssessment: app.hasMedicalAssessment,
        
        // Dates
        assignedAt: app.assignedAt?.toISOString() ?? null,
        createdAt: app.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          totalApplications,
          pendingReview,
          completed: completedCount,
          medicalAssessment: medicalAssessmentCount,
        },
      },
    });
  } catch (error) {
    console.error("Doctor applications list error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", errorMessage);
    console.error("Stack trace:", errorStack);
    return NextResponse.json(
      { success: false, message: `Failed to load applications: ${errorMessage}` },
      { status: 500 }
    );
  }
}
