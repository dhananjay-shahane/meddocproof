"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import type { AdminSettingsData } from "@/types";

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/settings");
      setSettings(res.data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch settings";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (section: string, data: Record<string, unknown>) => {
      try {
        setSaving(true);
        setError(null);
        await api.put("/admin/settings", { section, data });

        // Update local state
        if (settings) {
          setSettings({
            ...settings,
            [section]: { ...settings[section as keyof AdminSettingsData], ...data },
          } as AdminSettingsData);
        }

        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update settings";
        setError(msg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [settings]
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, saving, error, fetchSettings, updateSettings };
}
