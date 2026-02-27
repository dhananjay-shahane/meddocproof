import { NextRequest, NextResponse } from "next/server";
import { getFileUrl } from "@/lib/storage";

// GET - Get a signed download URL for a document
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const url = searchParams.get("url");

    const fileIdentifier = key || url;

    if (!fileIdentifier) {
      return NextResponse.json(
        { success: false, message: "key or url parameter is required" },
        { status: 400 }
      );
    }

    // Generate download URL
    const downloadUrl = getFileUrl(fileIdentifier);

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
