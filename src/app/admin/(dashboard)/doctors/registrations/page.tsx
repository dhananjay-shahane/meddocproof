"use client";

import { useState } from "react";
import { useDoctorRegistrations } from "@/hooks/use-doctor-registrations";
import { RegistrationCards } from "@/components/admin/doctors/registration-cards";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorRegistrationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, loading, refetch } = useDoctorRegistrations(page);

  const pendingCount = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pending Doctor Registrations</h2>
        <p className="text-muted-foreground">
          Review and approve pending doctor applications ({pendingCount} pending)
        </p>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or registration number..."
              className="h-10 w-full rounded-lg border border-input bg-transparent pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline">Search</Button>
        </div>
      </div>

      <RegistrationCards
        data={data}
        loading={loading}
        search={search}
        onPageChange={setPage}
        onActionComplete={refetch}
      />
    </div>
  );
}
