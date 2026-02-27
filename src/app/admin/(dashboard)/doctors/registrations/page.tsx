"use client";

import { useState } from "react";
import { useDoctorRegistrations } from "@/hooks/use-doctor-registrations";
import { RegistrationCards } from "@/components/admin/doctors/registration-cards";

export default function DoctorRegistrationsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useDoctorRegistrations(page);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Doctor Registrations</h2>
        <p className="text-muted-foreground">
          Review and approve new doctor registrations.
        </p>
      </div>

      <RegistrationCards
        data={data}
        loading={loading}
        onPageChange={setPage}
        onActionComplete={refetch}
      />
    </div>
  );
}
