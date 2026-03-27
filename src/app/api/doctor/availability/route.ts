import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// GET - Get doctor's availability schedule
export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;

    const slots = await prisma.doctorAvailability.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: "asc" },
    });

    // Build schedule keyed by day name (matching existing frontend shape)
    const availability: Record<string, { enabled: boolean; startTime: string; endTime: string; maxSlots: number }> = {};

    for (let i = 0; i < DAYS.length; i++) {
      const existing = slots.find((s) => s.dayOfWeek === i);
      availability[DAYS[i]] = existing
        ? {
            enabled: existing.isActive,
            startTime: existing.startTime,
            endTime: existing.endTime,
            maxSlots: existing.maxSlots,
          }
        : {
            enabled: i !== 0, // Sunday off by default
            startTime: "09:00",
            endTime: "18:00",
            maxSlots: 10,
          };
    }

    return NextResponse.json({
      success: true,
      data: { availability },
    });
  } catch (error) {
    console.error("Get availability error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update doctor's availability schedule
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { availability } = body as {
      availability: Record<string, { enabled: boolean; startTime: string; endTime: string; maxSlots: number }>;
    };

    if (!availability) {
      return NextResponse.json(
        { success: false, message: "Availability data is required" },
        { status: 400 }
      );
    }

    // Validate time ranges
    for (const [day, schedule] of Object.entries(availability)) {
      if (schedule.enabled && schedule.startTime >= schedule.endTime) {
        return NextResponse.json(
          { success: false, message: `${day}: end time must be after start time` },
          { status: 400 }
        );
      }
      if (schedule.maxSlots < 0 || schedule.maxSlots > 100) {
        return NextResponse.json(
          { success: false, message: `${day}: max slots must be between 0 and 100` },
          { status: 400 }
        );
      }
    }

    const doctorId = auth.doctorUser.id;

    // Upsert each day's availability
    const upsertOps = DAYS.map((dayName, dayIndex) => {
      const schedule = availability[dayName];
      if (!schedule) return null;
      return prisma.doctorAvailability.upsert({
        where: {
          doctorId_dayOfWeek: { doctorId, dayOfWeek: dayIndex },
        },
        create: {
          doctorId,
          dayOfWeek: dayIndex,
          isActive: schedule.enabled,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxSlots: schedule.maxSlots,
        },
        update: {
          isActive: schedule.enabled,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxSlots: schedule.maxSlots,
        },
      });
    }).filter(Boolean) as Prisma.PrismaPromise<unknown>[];

    await prisma.$transaction(upsertOps);

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.error("Update availability error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
