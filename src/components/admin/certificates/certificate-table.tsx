"use client";

import { formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { FileText } from "lucide-react";
import type { CertificateListItem, PaginatedResponse } from "@/types";

interface CertificateTableProps {
  data: PaginatedResponse<CertificateListItem> | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  certificate_delivered: "default",
  delivered: "default",
  pending: "secondary",
  assigned: "secondary",
  under_review: "outline",
  rejected: "destructive",
};

function formatCertificateType(type: string): string {
  const map: Record<string, string> = {
    medical_fitness: "Medical Fitness",
    sick_leave: "Sick Leave",
    fitness: "Fitness",
    work_from_home: "Work From Home",
    caretaker: "Caretaker",
    recovery: "Recovery",
    fit_to_fly: "Fit-to-Fly",
    unfit_to_work: "Unfit To Work",
    unfit_to_travel: "Unfit To Travel",
    medical_diagnosis: "Medical Diagnosis",
    medical_certificate: "Medical Certificate",
  };
  return map[type] || type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CertificateTable({
  data,
  loading,
  onPageChange,
}: CertificateTableProps) {
  if (loading) return <PageLoader />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No certificates found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Certificate No.</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Doctor</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((cert) => (
              <tr key={cert.id} className="border-b transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-mono text-sm font-medium">
                      {cert.certificateNumber || "—"}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {cert.applicationDisplayId}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">
                    {formatCertificateType(cert.certificateType)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{cert.userName}</p>
                    <p className="text-xs text-muted-foreground">{cert.userPhone}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {cert.doctorName || "Not assigned"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariantMap[cert.status] || "secondary"}>
                    {formatStatus(cert.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatRelativeDate(cert.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
