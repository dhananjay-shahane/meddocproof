import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST - Direct file upload (development/fallback mode)
// In production, files go directly to S3 via presigned URL
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileKey = formData.get("key") as string | null;

    if (!file || !fileKey) {
      return NextResponse.json(
        { success: false, message: "File and key are required" },
        { status: 400 }
      );
    }

    // Create directory structure
    const uploadDir = path.join(process.cwd(), "public", path.dirname(fileKey));
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public", fileKey);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      data: {
        fileKey,
        url: `/${fileKey}`,
      },
    });
  } catch (error) {
    console.error("Direct upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
