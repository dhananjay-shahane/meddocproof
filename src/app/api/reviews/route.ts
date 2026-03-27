import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ReviewSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  date: z.string().refine((d) => !isNaN(new Date(d).getTime()), "Invalid date"),
  rating: z.number().min(1).max(5).optional().default(5),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { title, message, date, rating } = parsed.data;

    await prisma.review.create({
      data: {
        title,
        message,
        date: new Date(date),
        rating,
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
