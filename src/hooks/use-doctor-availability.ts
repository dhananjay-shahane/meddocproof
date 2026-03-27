"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  maxSlots: number;
}

type WeeklySchedule = Record<string, DaySchedule>;

export function useDoctorAvailability() {
  const [availability, setAvailability] = useState<WeeklySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/doctor/availability");
      setAvailability(res.data.data.availability);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch availability";
      setError(message);
      console.error("Failed to fetch availability", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvailability = useCallback(async (schedule: WeeklySchedule) => {
    setSaving(true);
    try {
      await api.put("/doctor/availability", { availability: schedule });
      setAvailability(schedule);
      toast.success("Availability updated successfully");
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setSaving(false);
    }
  }, []);

  const toggleDay = useCallback((day: string) => {
    if (!availability) return;
    const updated = {
      ...availability,
      [day]: { ...availability[day], enabled: !availability[day].enabled },
    };
    setAvailability(updated);
  }, [availability]);

  const updateDayTime = useCallback((day: string, field: "startTime" | "endTime" | "maxSlots", value: string | number) => {
    if (!availability) return;
    const updated = {
      ...availability,
      [day]: { ...availability[day], [field]: value },
    };
    setAvailability(updated);
  }, [availability]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return {
    availability,
    loading,
    saving,
    error,
    updateAvailability,
    toggleDay,
    updateDayTime,
  };
}
