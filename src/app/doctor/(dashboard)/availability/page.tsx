"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAvailability } from "@/hooks/use-doctor-availability";
import { Loader2, Save, ArrowLeft, Clock, CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

type TabType = "weekly" | "blocked" | "general";

export default function DoctorAvailabilityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("weekly");
  const { availability, loading, saving, updateAvailability, toggleDay, updateDayTime } =
    useDoctorAvailability();

  if (loading || !availability) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSave = () => {
    updateAvailability(availability);
  };

  const tabs = [
    { id: "weekly" as TabType, label: "Weekly Schedule" },
    { id: "blocked" as TabType, label: "Blocked Dates (0)" },
    { id: "general" as TabType, label: "General Settings" },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/doctor")}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold tracking-tight">
            Availability Management
          </h1>
          <p className="text-muted-foreground">
            Manage your consultation slots and blocked dates
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex-1 py-3 text-center text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "weekly" && (
        <div className="space-y-4">
          {DAYS.map((day) => {
            const schedule = availability[day];
            if (!schedule) return null;

            return (
              <div
                key={day}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                {/* Day Header with Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{DAY_LABELS[day]}</h3>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={schedule.enabled}
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                      schedule.enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                        schedule.enabled ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* Time Inputs */}
                {schedule.enabled && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Start Time */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Start Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            updateDayTime(day, "startTime", e.target.value)
                          }
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        End Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            updateDayTime(day, "endTime", e.target.value)
                          }
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Slot Duration */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Slot Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={120}
                        value={schedule.maxSlots}
                        onChange={(e) =>
                          updateDayTime(
                            day,
                            "maxSlots",
                            parseInt(e.target.value) || 30
                          )
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "blocked" && (
        <div className="rounded-xl border bg-card p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <CalendarX className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="font-medium">No Blocked Dates</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You haven&apos;t blocked any dates yet. Block dates when you&apos;re unavailable.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Add Blocked Date
            </button>
          </div>
        </div>
      )}

      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Consultation Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Default Slot Duration (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  min={5}
                  max={120}
                  className="w-full max-w-xs rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Buffer Time Between Consultations (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  min={0}
                  max={60}
                  className="w-full max-w-xs rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Maximum Advance Booking (days)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  min={1}
                  max={90}
                  className="w-full max-w-xs rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
