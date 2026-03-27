"use client";

import { useState, useEffect } from "react";
import { formatDate } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  X,
  FileText,
  Eye,
  ExternalLink,
  RefreshCw,
  Plus,
  Send,
  Star,
  Mail,
  Phone,
  AlertTriangle,
  Upload,
  MessageSquare,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import type { Doctor, Notification } from "@/types";

interface DoctorDetails extends Doctor {
  medicalLicenseUrl?: string | null;
  govtIdProofUrl?: string | null;
  degreeCertificateUrl?: string | null;
  signatureUrl?: string | null;
  approvedAt?: string | null;
}

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = "personal" | "performance" | "documents" | "missing" | "communications";

export function DoctorDetailsModal({
  doctor,
  open,
  onOpenChange,
}: DoctorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [details, setDetails] = useState<DoctorDetails | null>(null);
  const [communications, setCommunications] = useState<Notification[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (!open || !doctor?.id) return;
    setDetailsLoading(true);
    Promise.all([
      api.get(`/admin/doctors/${doctor.id}`),
      api.get(`/admin/notifications?doctorId=${doctor.id}&limit=20`),
    ])
      .then(([detailRes, notifRes]) => {
        setDetails(detailRes.data.data);
        setCommunications(notifRes.data.data?.notifications ?? []);
      })
      .catch(() => {})
      .finally(() => setDetailsLoading(false));
  }, [open, doctor?.id]);

  useEffect(() => {
    if (!open) {
      setDetails(null);
      setCommunications([]);
    }
  }, [open]);

  if (!doctor) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: "personal", label: "Personal Details" },
    { id: "performance", label: "Performance" },
    { id: "documents", label: "Documents" },
    { id: "missing", label: "Missing Documents" },
    { id: "communications", label: "Communications" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-400" />
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-semibold">
                    {doctor.fullName}
                  </DialogTitle>
                  <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    Active
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Comprehensive Doctor Profile & Management
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 pt-4">
          {detailsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {activeTab === "personal" && <PersonalDetailsTab doctor={details ?? doctor} />}
              {activeTab === "performance" && <PerformanceTab doctor={doctor} />}
              {activeTab === "documents" && <DocumentsTab doctor={details ?? doctor} />}
              {activeTab === "missing" && <MissingDocumentsTab />}
              {activeTab === "communications" && (
                <CommunicationsTab doctor={doctor} communications={communications} />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Personal Details Tab
function PersonalDetailsTab({ doctor }: { doctor: DoctorDetails }) {
  const history = [
    {
      id: 1,
      title: "Registration Submitted",
      description: "Doctor submitted registration application",
      date: formatDate(doctor.createdAt, "MMM dd, yyyy, hh:mm a"),
      icon: "file" as const,
    },
    ...(doctor.status !== "pending"
      ? [
          {
            id: 2,
            title: `Status: ${doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}`,
            description:
              doctor.status === "approved"
                ? "Application approved by admin"
                : doctor.status === "rejected"
                ? "Application rejected by admin"
                : "Status updated by admin",
            date: formatDate(doctor.updatedAt, "MMM dd, yyyy, hh:mm a"),
            icon: "check" as const,
            status: doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Application History */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Application History
        </h3>
        <div className="relative">
          {history.map((item, index) => (
            <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Timeline line */}
              {index < history.length - 1 && (
                <div className="absolute left-5 top-10 h-[calc(100%-40px)] w-0.5 bg-blue-200" />
              )}
              {/* Icon */}
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                {item.icon === "file" && <FileText className="h-5 w-5" />}
                {item.icon === "check" && <User className="h-5 w-5" />}
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  {"status" in item && item.status && (
                    <span className="rounded-full border border-green-500 px-2 py-0.5 text-xs font-medium text-green-600">
                      {item.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{item.description}</p>
                <p className="text-xs text-slate-400 mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-slate-500">Full Name</p>
            <p className="font-medium text-slate-900">{doctor.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium text-slate-900">{doctor.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium text-slate-900">{doctor.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Registration Number</p>
            <p className="font-medium text-slate-900">{doctor.registrationNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Qualification</p>
            <p className="font-medium text-slate-900">{doctor.qualification}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Specialization</p>
            <p className="font-medium text-slate-900">{doctor.specialization}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Experience</p>
            <p className="font-medium text-slate-900">{doctor.experience} years</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Hospital Affiliation</p>
            <p className="font-medium text-slate-900">{doctor.hospitalAffiliation || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Performance Tab
function PerformanceTab({ doctor }: { doctor: Doctor }) {
  const totalEarnings = doctor.wallet?.totalEarnings || 0;
  const currentBalance = doctor.wallet?.balance || 0;
  const totalWithdrawn = doctor.wallet?.totalWithdrawn || 0;

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Financial Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Total Earnings</p>
              <span className="text-blue-500">₹</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{totalEarnings}</p>
            <p className="text-xs text-slate-400 mt-1">
              From {doctor.consultationCount} consultations
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Current Balance</p>
              <span className="text-blue-500">₹</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{currentBalance}</p>
            <p className="text-xs text-slate-400 mt-1">Available for withdrawal</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Total Withdrawn</p>
              <span className="text-red-500">₹</span>
            </div>
            <p className="text-2xl font-bold text-red-500">₹{totalWithdrawn}</p>
            <p className="text-xs text-slate-400 mt-1">Lifetime withdrawals</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Total Applications</p>
            <p className="text-2xl font-bold text-slate-900 text-right">
              {doctor.consultationCount}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-green-600 text-right">
              {doctor.completedCertificates}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-amber-500 text-right">
              {doctor.consultationCount - doctor.completedCertificates}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Success Rate</p>
            <p className="text-2xl font-bold text-blue-600 text-right">
              {doctor.consultationCount > 0
                ? Math.round((doctor.completedCertificates / doctor.consultationCount) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Rating & Reviews */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Rating & Reviews
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="text-2xl font-bold">
                {doctor.avgRating > 0 ? doctor.avgRating.toFixed(1) : "N/A"}
              </span>
              <span className="text-slate-400">({doctor.totalRatings} ratings)</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Average patient rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {doctor.avgCompletionTime > 0
                ? `${doctor.avgCompletionTime} hours`
                : "N/A hours"}
            </p>
            <p className="text-sm text-slate-500 mt-1">Average completion time</p>
          </div>
        </div>
      </div>

      {/* Activity Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Activity Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-slate-500">Last Consultation</p>
            <p className="font-medium text-slate-900">
              {doctor.lastActive
                ? formatDate(doctor.lastActive, "MMM dd, yyyy, hh:mm a")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Joined Platform</p>
            <p className="font-medium text-slate-900">
              {formatDate(doctor.createdAt, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents Tab
function DocumentsTab({ doctor }: { doctor: DoctorDetails }) {
  const documents = [
    { id: 1, name: "Medical License", url: doctor.medicalLicenseUrl },
    { id: 2, name: "Govt ID Proof", url: doctor.govtIdProofUrl },
    { id: 3, name: "Degree Certificate", url: doctor.degreeCertificateUrl },
  ].filter((d) => !!d.url);

  return (
    <div className="space-y-6">
      {/* Uploaded Documents */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Uploaded Documents
        </h3>
        {documents.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-slate-500">
            No documents uploaded
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{doc.name}</p>
                    <p className="text-sm text-blue-500 max-w-xs truncate">{doc.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => window.open(doc.url!, "_blank")}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    asChild
                  >
                    <a href={doc.url!} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signature with Stamp */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">
            Signature with Stamp (Combined)
          </h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">Current Signature & Stamp</p>
        <div className="rounded-lg bg-slate-50 p-6 flex flex-col items-center justify-center min-h-38">
          {doctor.signatureUrl ? (
            <img
              src={doctor.signatureUrl}
              alt="Doctor signature"
              className="max-h-28 object-contain"
            />
          ) : (
            <div className="text-center">
              <p className="text-slate-400 text-sm">No signature uploaded</p>
              <p className="font-semibold text-blue-700 mt-2">Dr. {doctor.fullName}</p>
              <p className="text-sm text-slate-600">{doctor.specialization}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Missing Documents Tab
function MissingDocumentsTab() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">
            Missing Documents (0)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Request Document
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
          <FileText className="h-8 w-8 text-slate-300" />
        </div>
        <p className="text-slate-500">No missing documents requested</p>
      </div>
    </div>
  );
}

// Communications Tab
function CommunicationsTab({
  doctor,
  communications,
}: {
  doctor: Doctor;
  communications: Notification[];
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">
            Notifications ({communications.length})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <User className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Dr. {doctor.fullName}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {doctor.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {doctor.phoneNumber || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <span className="rounded-full border border-green-500 px-2.5 py-0.5 text-xs font-medium text-green-600">
          approved
        </span>
      </div>

      {/* Communications List */}
      <div className="space-y-4">
        {communications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <MessageSquare className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-500">No notifications sent to this doctor</p>
          </div>
        ) : (
          communications.map((notif) => (
            <div
              key={notif.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-slate-900">{notif.title}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {notif.type}
                  </span>
                  {!notif.isRead && (
                    <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-400 whitespace-nowrap">
                  {formatDate(notif.createdAt, "MMM dd, yyyy, hh:mm a")}
                </span>
              </div>
              <p className="text-sm text-slate-700">{notif.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
