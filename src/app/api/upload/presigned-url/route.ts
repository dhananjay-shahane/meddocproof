import { NextRequest, NextResponse } from "next/server";
import { validateUserRequest, validateDoctorRequest, validateAdminRequest, isAuthError } from "@/lib/api-auth";
import { generateFileKey, validateFile } from "@/lib/storage";
import { isImageKitConfigured, getImageKitAuthParams, getImageKitFolder } from "@/lib/imagekit";

// POST - Generate upload URL or ImageKit auth parameters
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

    // If ImageKit is configured, include auth params for potential client-side uploads
    if (isImageKitConfigured()) {
      const authParams = getImageKitAuthParams();
      const folder = getImageKitFolder(fileType, userId);

      return NextResponse.json({
        success: true,
        data: {
          fileKey,
          uploadUrl: `/api/upload/direct`,
          method: "POST",
          fields: { key: fileKey, contentType, fileType },
          // ImageKit-specific data for client-side uploads (optional)
          imagekit: {
            ...authParams,
            folder,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
          },
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
        fields: { key: fileKey, contentType, fileType },
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
