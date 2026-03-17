"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import {
  Search,
  Filter,
  FileText,
  RefreshCw,
  ArrowLeft,
  MoreHorizontal,
  Eye,
  Clock,
  User,
  FileCheck,
  ClipboardList,
  AlertCircle,
  UserPlus,
  Calendar,
  Phone,
  Send,
  FileEdit,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import { useCertificates } from "@/hooks/use-certificates";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CertificateDetailsDialog } from "@/components/admin/certificates/certificate-details-dialog";
import type { CertificateFiltersState, CertificateListItem } from "@/types";
import { toast } from "sonner";

const defaultFilters: CertificateFiltersState = {
  search: "",
  tab: "incomplete",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "doctor_assigned", label: "Doctor Assigned" },
  { value: "consultation_completed", label: "Consultation Done" },
  { value: "certificate_in_progress", label: "Certificate In Progress" },
  { value: "pending", label: "Pending" },
];

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const certTypeOptions = [
  { value: "all", label: "All Certificate Types" },
  { value: "sick_leave", label: "Sick Leave" },
  { value: "fitness", label: "Fitness" },
  { value: "work_from_home", label: "Work From Home" },
  { value: "caretaker", label: "Caretaker" },
  { value: "recovery", label: "Recovery" },
  { value: "fit_to_fly", label: "Fit to Fly" },
];

export default function IncompleteCertificatesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CertificateFiltersState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [certTypeFilter, setCertTypeFilter] = useState("all");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  const { data, loading, refetch } = useCertificates({ filters, page });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setPage(1);
  };

  const handleViewDetails = (certId: string) => {
    setSelectedCertId(certId);
    setDetailsModalOpen(true);
  };

  const handleGenerateCertificate = (cert: CertificateListItem) => {
    router.push(`/admin/certificates/generate/${cert.id}`);
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: false }) + " ago";
    } catch {
      return "—";
    }
  };

  const formatCertType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusInfo = (status: string): { label: string; color: string; nextAction: string } => {
    switch (status) {
      case "doctor_assigned":
      case "assigned":
        return {
          label: "Doctor Assigned",
          color: "bg-amber-50 border-amber-200 text-amber-700",
          nextAction: "Schedule/Complete Consultation",
        };
      case "consultation_completed":
      case "consultation_done":
        return {
          label: "Consultation Done",
          color: "bg-green-50 border-green-200 text-green-700",
          nextAction: "Generate Certificate",
        };
      case "certificate_in_progress":
      case "processing":
        return {
          label: "Certificate In Progress",
          color: "bg-blue-50 border-blue-200 text-blue-700",
          nextAction: "Regenerate Certificate",
        };
      default:
        return {
          label: "Pending",
          color: "bg-gray-50 border-gray-200 text-gray-700",
          nextAction: "Assign Doctor",
        };
    }
  };

  const getProgressPercentage = (status: string): number => {
    switch (status) {
      case "pending":
        return 10;
      case "doctor_assigned":
      case "assigned":
        return 25;
      case "consultation_completed":
      case "consultation_done":
        return 50;
      case "certificate_in_progress":
      case "processing":
        return 75;
      default:
        return 10;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Incomplete Certificates</h2>
          <p className="text-muted-foreground">
            Track certificate completion progress and manage workflow
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/certificates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Certificates
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center rounded-xl border bg-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or certificate number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <select
            value={certTypeFilter}
            onChange={(e) => setCertTypeFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {certTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted-foreground whitespace-nowrap ml-auto">
          {data?.total || 0} certificates found
        </p>
      </div>

      {/* Certificate Cards */}
      {loading ? (
        <PageLoader />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No incomplete certificates found"
          description="All certificates have been processed."
        />
      ) : (
        <div className="space-y-4">
          {data.items.map((cert) => {
            const statusInfo = getStatusInfo(cert.status);
            const progress = getProgressPercentage(cert.status);

            return (
              <div
                key={cert.id}
                className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                {/* Top Row */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1">
                        <h3 className="font-semibold text-base">{cert.userName}</h3>
                        <span className="text-sm text-blue-600 font-medium">
                          {formatCertType(cert.certificateType)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {cert.userPhone || "—"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTimeAgo(cert.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          #{cert.certificateNumber || cert.applicationDisplayId}
                        </span>
                      </div>
                    </div>

                    {/* Right: Priority + Status (always visible) */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                        Medium
                      </span>
                      <div className={`rounded-lg border px-2.5 py-1.5 max-w-[180px] ${statusInfo.color}`}>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {statusInfo.label === "Certificate In Progress" && (
                            <FileCheck className="h-3.5 w-3.5 shrink-0" />
                          )}
                          {statusInfo.label === "Consultation Done" && (
                            <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                          )}
                          {statusInfo.label === "Doctor Assigned" && (
                            <User className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span className="text-xs font-medium">{statusInfo.label}</span>
                        </div>
                        <p className="text-xs opacity-70 truncate">Next: {statusInfo.nextAction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons — always on their own wrapping row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(cert.id)}
                    >
                      <Eye className="mr-1.5 h-4 w-4" />
                      View Details
                    </Button>

                    {(statusInfo.label === "Consultation Done" ||
                      statusInfo.label === "Certificate In Progress") && (
                      <Button
                        size="sm"
                        onClick={() => handleGenerateCertificate(cert)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <FileText className="mr-1.5 h-4 w-4" />
                        Generate Certificate
                      </Button>
                    )}

                    {/* More Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Debug Application
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Reassign Doctor
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit Certificate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Consultation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Send WhatsApp Update
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Remark
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Upload className="mr-2 h-4 w-4" />
                          Replace Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit Certificate Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Certificate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {progress}%
                  </span>
                </div>

                {/* Doctor Info */}
                {cert.doctorName && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Dr. {cert.doctorName}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Details Modal */}
      <CertificateDetailsDialog
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedCertId(null);
        }}
        certificateId={selectedCertId}
        onRefresh={refetch}
      />
    </div>
  );
}
