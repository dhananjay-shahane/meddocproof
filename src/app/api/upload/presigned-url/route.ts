import { NextRequest, NextResponse } from "next/server";
import { validateUserRequest, validateDoctorRequest, validateAdminRequest, isAuthError } from "@/lib/api-auth";
import { generateFileKey, validateFile, isStorageConfigured } from "@/lib/storage";

// POST - Generate a presigned upload URL
export async function POST(request: NextRequest) {
  try {
    // Accept auth from any role (user, doctor, admin)
    let userId = "";

    const userAuth = await validateUserRequest(request);
    if (!isAuthError(userAuth)) {
      userId = userAuth.user.id;
    } else {
      const doctorAuth = await validateDoctorRequest(request);
      if (!isAuthError(doctorAuth)) {
        userId = doctorAuth.doctorUser.id;
      } else {
        const adminAuth = await validateAdminRequest(request);
        if (!isAuthError(adminAuth)) {
          userId = adminAuth.adminUser.id;
        } else {
          return NextResponse.json(
            { success: false, message: "Authentication required" },
            { status: 401 }
          );
        }
      }
    }

    const body = await request.json();
    const { fileType, contentType, fileName, fileSize } = body;

    if (!fileType || !contentType || !fileName) {
      return NextResponse.json(
        { success: false, message: "fileType, contentType, and fileName are required" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(fileType, contentType, fileSize);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Generate file key
    const fileKey = generateFileKey(userId, fileType, fileName);

    if (isStorageConfigured()) {
      // In production: generate S3 presigned URL
      // For now, return a direct upload endpoint
      return NextResponse.json({
        success: true,
        data: {
          fileKey,
          uploadUrl: `/api/upload/direct`,
          method: "POST",
          fields: { key: fileKey, contentType },
        },
      });
    }

    // Development mode: use local file upload endpoint
    return NextResponse.json({
      success: true,
      data: {
        fileKey,
        uploadUrl: `/api/upload/direct`,
        method: "POST",
        fields: { key: fileKey, contentType },
      },
    });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
