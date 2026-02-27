import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, date, rating } = body;

    if (!title || !message || !date) {
      return NextResponse.json(
        { success: false, message: "Title, message, and date are required" },
        { status: 400 }
      );
    }

    const ratingValue = Math.min(5, Math.max(1, Number(rating) || 5));

    await prisma.review.create({
      data: {
        title,
        message,
        date: new Date(date),
        rating: ratingValue,
        approved: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully. It will be published after verification.",
    });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
