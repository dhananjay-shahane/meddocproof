import { NextRequest, NextResponse } from "next/server";
import { getFileUrl } from "@/lib/storage";
import { isImageKitUrl, getOptimizedImageUrl } from "@/lib/imagekit";

// GET - Get a download URL for a document
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const url = searchParams.get("url");
    const width = searchParams.get("w");
    const height = searchParams.get("h");
    const quality = searchParams.get("q");

    const fileIdentifier = key || url;

    if (!fileIdentifier) {
      return NextResponse.json(
        { success: false, message: "key or url parameter is required" },
        { status: 400 }
      );
    }

    let downloadUrl: string;

    // If it's already an ImageKit URL, optionally apply transformations
    if (isImageKitUrl(fileIdentifier)) {
      downloadUrl = getOptimizedImageUrl(fileIdentifier, {
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        quality: quality ? parseInt(quality) : undefined,
        format: "auto",
      });
    } else {
      // Use storage utility for local/S3 URLs
      downloadUrl = getFileUrl(fileIdentifier);
    }

    return NextResponse.json({
      success: true,
      data: { url: downloadUrl },
    });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
