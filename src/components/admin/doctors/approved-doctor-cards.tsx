"use client";

import { useState } from "react";
import { formatDate } from "date-fns";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { DoctorDetailsModal } from "@/components/admin/doctors/doctor-details-modal";
import {
  User,
  Mail,
  Phone,
  Eye,
  FileText,
  MapPin,
  UserX,
  Stethoscope,
  MessageSquare,
} from "lucide-react";
import type { Doctor, PaginatedResponse } from "@/types";

interface ApprovedDoctorCardsProps {
  data: PaginatedResponse<Doctor> | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onAction: (doctorId: string, action: "approve" | "reject" | "suspend") => void;
}

export function ApprovedDoctorCards({
  data,
  loading,
  onPageChange,
  onAction,
}: ApprovedDoctorCardsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDetailsOpen(true);
  };

  if (loading) return <PageLoader />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No approved doctors found"
        description="There are no approved doctors matching your search criteria."
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {data.items.map((doctor) => (
          <div
            key={doctor.id}
          className="rounded-xl border bg-card p-5 shadow-sm"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <User className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{doctor.fullName}</h3>
                <p className="text-sm text-slate-500">
                  {doctor.specialization} • {doctor.experience} years experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
                Active
              </span>
              <span className="text-slate-500">
                Approved: {formatDate(doctor.createdAt, "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          {/* Contact Info Row */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{doctor.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Eye className="h-4 w-4 text-slate-400" />
              <span>{doctor.qualification}</span>
            </div>
          </div>

          {/* Details Row */}
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="h-4 w-4 text-slate-400" />
              <span>Reg: {doctor.registrationNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{doctor.hospitalAffiliation || "None"}</span>
            </div>
          </div>

          {/* Certificate Fee Structure */}
          <div className="mt-4 rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
              <MessageSquare className="h-4 w-4" />
              <span>Certificate Fee Structure</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Digital Certificate: </span>
                <span className="text-green-700 font-medium">₹200</span>
              </div>
              <div>
                <span className="text-slate-500">Handwritten: </span>
                <span className="text-green-700 font-medium">₹300</span>
              </div>
              <div>
                <span className="text-slate-500">Form 1A Digital: </span>
                <span className="text-green-700 font-medium">₹400</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleViewDetails(doctor)}>
              <Eye className="h-4 w-4" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onAction(doctor.id, "suspend")}
            >
              <UserX className="h-4 w-4" />
              Deactivate
            </Button>
          </div>
        </div>
      ))}

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      {/* Doctor Details Modal */}
      <DoctorDetailsModal
        doctor={selectedDoctor}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
