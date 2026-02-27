"use client";

import { useState } from "react";
import DoctorSidebar from "@/components/doctor/doctor-sidebar";
import DoctorHeader from "@/components/doctor/doctor-header";
import { CommandPalette } from "@/components/shared/command-palette";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="doctor-shell flex h-screen overflow-hidden bg-neubg">
      <CommandPalette />
      <DoctorSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DoctorHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
