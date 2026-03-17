"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  FileText,
  RefreshCw,
  ArrowLeft,
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle2,
  User,
  Phone,
  Mail,
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
} from "@/components/ui/dropdown-menu";
import { CompletedCertificateDialog } from "@/components/admin/certificates/completed-certificate-dialog";
import type { CertificateFiltersState, CertificateListItem } from "@/types";
import { toast } from "sonner";

const defaultFilters: CertificateFiltersState = {
  search: "",
  tab: "completed",
  sortBy: "createdAt",
  sortOrder: "desc",
};

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

export default function CompletedCertificatesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CertificateFiltersState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleDownload = (cert: CertificateListItem) => {
    toast.info("Downloading certificate...");
  };

  const handlePreview = (cert: CertificateListItem) => {
    toast.info("Opening certificate preview...");
  };

  const handleSendWhatsApp = (cert: CertificateListItem) => {
    toast.info("WhatsApp notification sent");
  };

  const handleSendEmail = (cert: CertificateListItem) => {
    toast.info("Email notification sent");
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM d, yyyy, h:mm a");
    } catch {
      return "—";
    }
  };

  const formatCertType = (type: string) => {
    return type.replace(/_/g, "-").toLowerCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Completed Certificates</h2>
          <p className="text-muted-foreground">
            View and manage submitted certificates
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/certificates/incomplete">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Incomplete Certificates
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
        <div className="relative flex-1 max-w-sm">
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
          title="No completed certificates found"
          description="Completed certificates will appear here."
        />
      ) : (
        <div className="space-y-4">
          {data.items.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                {/* Left Side - Info */}
                <div className="flex-1">
                  {/* Row 1: Name, Type, Phone */}
                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="font-semibold text-base">{cert.userName}</h3>
                    <span className="text-sm text-muted-foreground">
                      {formatCertType(cert.certificateType)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {cert.userPhone || "—"}
                    </span>
                  </div>

                  {/* Row 2: Email */}
                  <p className="text-sm text-blue-600 mb-2">
                    {/* Email would be from user object - using placeholder */}
                    {cert.userName.toLowerCase().replace(/\s+/g, "")}@gmail.com
                  </p>

                  {/* Row 3: Certificate # and Submitted date */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>
                      <span className="font-medium text-foreground">Certificate #:</span>{" "}
                      {cert.certificateNumber || cert.applicationDisplayId}
                    </span>
                    <span>
                      <span className="font-medium text-foreground">Submitted:</span>{" "}
                      {formatDateTime(cert.issuedAt || cert.createdAt)}
                    </span>
                  </div>

                  {/* Row 4: Badges */}
                  <div className="flex items-center gap-2">
                    {/* Priority Badge */}
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Urgent
                    </span>

                    {/* Completed Badge */}
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-white px-2.5 py-0.5 text-xs font-medium text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completed
                    </span>

                    {/* Doctor Badge */}
                    {cert.doctorName && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-white px-2.5 py-0.5 text-xs font-medium text-blue-600">
                        <User className="h-3.5 w-3.5" />
                        Dr. {cert.doctorName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(cert.id)}
                  >
                    <Eye className="mr-1.5 h-4 w-4" />
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleDownload(cert)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    Download
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handlePreview(cert)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Certificate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendWhatsApp(cert)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Send WhatsApp Notification
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(cert)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email Notification
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Certificate Details Modal */}
      <CompletedCertificateDialog
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedCertId(null);
        }}
        certificateId={selectedCertId}
      />
    </div>
  );
}
