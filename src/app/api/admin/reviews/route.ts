import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "all"; // all | approved | pending
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};

    if (filter === "approved") {
      where.approved = true;
    } else if (filter === "pending") {
      where.approved = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    const items = reviews.map((r) => ({
      id: r.id,
      title: r.title,
      message: r.message,
      rating: r.rating,
      date: r.date.toISOString(),
      approved: r.approved,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    const stats = {
      total: await prisma.review.count(),
      approved: await prisma.review.count({ where: { approved: true } }),
      pending: await prisma.review.count({ where: { approved: false } }),
    };

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { id, approved } = body as { id: string; approved: boolean };

    if (!id || typeof approved !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Review id and approved status are required" },
        { status: 400 }
      );
    }

    await prisma.review.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json({
      success: true,
      message: approved ? "Review approved" : "Review hidden",
    });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Review id is required" },
        { status: 400 }
      );
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review" },
      { status: 500 }
    );
  }
}
