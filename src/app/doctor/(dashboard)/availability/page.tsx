"use client";

import { useDoctorAvailability } from "@/hooks/use-doctor-availability";
import { Loader2, Save, CalendarDays } from "lucide-react";

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

export default function DoctorAvailabilityPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Availability Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Set your weekly consultation availability
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const schedule = availability[day];
          if (!schedule) return null;

          return (
            <div
              key={day}
              className={`rounded-xl border bg-card p-4 transition-colors ${
                schedule.enabled ? "border-primary/20" : "opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-center gap-4">
                {/* Toggle */}
                <label className="flex w-28 cursor-pointer items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={schedule.enabled}
                    onClick={() => toggleDay(day)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      schedule.enabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        schedule.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium">
                    {DAY_LABELS[day]}
                  </span>
                </label>

                {schedule.enabled && (
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* Start Time */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-muted-foreground">
                        From
                      </label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          updateDayTime(day, "startTime", e.target.value)
                        }
                        className="rounded-lg border bg-background px-2 py-1.5 text-sm"
                      />
                    </div>

                    {/* End Time */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-muted-foreground">
                        To
                      </label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          updateDayTime(day, "endTime", e.target.value)
                        }
                        className="rounded-lg border bg-background px-2 py-1.5 text-sm"
                      />
                    </div>

                    {/* Max Slots */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-muted-foreground">
                        Max Slots
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={schedule.maxSlots}
                        onChange={(e) =>
                          updateDayTime(
                            day,
                            "maxSlots",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 rounded-lg border bg-background px-2 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            {DAYS.filter((d) => availability[d]?.enabled).length} days active •{" "}
            {DAYS.reduce(
              (sum, d) =>
                sum + (availability[d]?.enabled ? availability[d].maxSlots : 0),
              0
            )}{" "}
            total weekly slots
          </span>
        </div>
      </div>
    </div>
  );
}
