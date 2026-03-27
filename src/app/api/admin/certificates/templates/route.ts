import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const active = searchParams.get("active");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (type) where.type = type;
    if (active === "true") where.isActive = true;
    if (active === "false") where.isActive = false;

    const templates = await prisma.certificateTemplate.findMany({
      where,
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error("Certificate templates GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { name, type, description, isDefault, isActive, formFields, sections } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Template name is required" },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json(
        { success: false, message: "Certificate type is required" },
        { status: 400 }
      );
    }

    const template = await prisma.certificateTemplate.create({
      data: {
        name: name.trim(),
        type,
        description: description?.trim() || null,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
        formFields: formFields ?? null,
        sections: sections ?? null,
      },
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error) {
    console.error("Certificate templates POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create template" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Template id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, type, description, isDefault, isActive, formFields, sections } = body;

    const template = await prisma.certificateTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(formFields !== undefined && { formFields }),
        ...(sections !== undefined && { sections }),
      },
    });

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error("Certificate templates PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Template id is required" },
        { status: 400 }
      );
    }

    await prisma.certificateTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Certificate templates DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete template" },
      { status: 500 }
    );
  }
}
