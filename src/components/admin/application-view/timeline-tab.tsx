"use client";

import { Clock } from "lucide-react";
import { format } from "date-fns";
import type { Application, Remark } from "@/types";

interface TimelineTabProps {
  application: Application;
  remarks: Remark[];
}

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: "created" | "payment" | "assigned" | "updated" | "remark";
}

export function TimelineTab({ application, remarks }: TimelineTabProps) {
  // Build timeline events
  const events: TimelineEvent[] = [];

  // Application Created
  events.push({
    id: "created",
    title: "Application Created",
    date: new Date(application.createdAt),
    type: "created",
  });

  // Payment Completed
  if (application.paymentCompleted && application.payments?.[0]) {
    events.push({
      id: "payment",
      title: "Payment Completed",
      description: `Payment ID: ${application.payments[0].razorpayPaymentId || "N/A"}`,
      date: new Date(application.payments[0].createdAt),
      type: "payment",
    });
  }

  // Doctor Assigned
  if (application.assignedAt && application.assignedDoctor) {
    events.push({
      id: "assigned",
      title: "Doctor Assigned",
      description: `Assigned to Dr. ${application.assignedDoctor.fullName}`,
      date: new Date(application.assignedAt),
      type: "assigned",
    });
  }

  // Add remarks as timeline events
  remarks.forEach((remark) => {
    events.push({
      id: remark.id,
      title: remark.message.length > 50 ? remark.message.substring(0, 50) + "..." : remark.message,
      description: `By ${remark.addedByRole}`,
      date: new Date(remark.addedAt),
      type: "remark",
    });
  });

  // Last Updated (only if different from created)
  const createdTime = new Date(application.createdAt).getTime();
  const updatedTime = new Date(application.updatedAt).getTime();
  if (Math.abs(updatedTime - createdTime) > 60000) { // More than 1 minute difference
    events.push({
      id: "updated",
      title: "Last Updated",
      date: new Date(application.updatedAt),
      type: "updated",
    });
  }

  // Sort events by date (oldest first for timeline display)
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventDotColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "created":
        return "bg-blue-500";
      case "payment":
        return "bg-green-500";
      case "assigned":
        return "bg-purple-500";
      case "updated":
        return "bg-gray-400";
      case "remark":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-indigo-50 p-2">
          <Clock className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Application Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Track the progress of this application
          </p>
        </div>
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-lg bg-muted/50 p-4 mb-4">
            <Clock className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">No timeline events yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 rounded-lg bg-blue-50/50 p-4"
            >
              {/* Timeline Dot */}
              <div
                className={`mt-1.5 h-2.5 w-2.5 rounded-full ${getEventDotColor(event.type)} shrink-0`}
              />

              {/* Event Content */}
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {format(event.date, "MMM d, yyyy HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
