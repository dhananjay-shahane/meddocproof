"use client";

import { useState } from "react";
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
  Download,
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
} from "lucide-react";
import type { Doctor } from "@/types";

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = "personal" | "performance" | "documents" | "missing" | "communications";

// Mock data for demonstration
const mockApplicationHistory = [
  {
    id: 1,
    title: "New Registration",
    description: "Doctor submitted application",
    date: "Aug 20, 2025, 08:27 PM",
    icon: "file",
  },
  {
    id: 2,
    title: "Application Submitted",
    description: "Application received and under review",
    date: "Aug 20, 2025, 08:27 PM",
    icon: "user",
  },
  {
    id: 3,
    title: "Status: Approved",
    description: "Application approved by admin",
    date: "Aug 21, 2025, 09:47 AM",
    icon: "check",
    status: "Approved",
  },
];

const mockDocuments = [
  {
    id: 1,
    name: "Medical License",
    filename: "medical-license_1755701847043.jpg",
  },
  {
    id: 2,
    name: "Bank Passbook",
    filename: "bank-passbook_1755701849785.jpg",
  },
  {
    id: 3,
    name: "Profile Photo",
    filename: "profile-photo_1755701851074.jpg",
  },
];

const mockCommunications = [
  {
    id: 1,
    subject: "Please upload required documents",
    priority: "High",
    status: "Sent",
    adminName: "Anil Kumar",
    message: "upload required documents",
    date: "Aug 20, 2025, 11:12 AM",
  },
];

export function DoctorDetailsModal({
  doctor,
  open,
  onOpenChange,
}: DoctorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");

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
          {activeTab === "personal" && <PersonalDetailsTab doctor={doctor} />}
          {activeTab === "performance" && <PerformanceTab doctor={doctor} />}
          {activeTab === "documents" && <DocumentsTab doctor={doctor} />}
          {activeTab === "missing" && <MissingDocumentsTab />}
          {activeTab === "communications" && <CommunicationsTab doctor={doctor} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Personal Details Tab
function PersonalDetailsTab({ doctor }: { doctor: Doctor }) {
  return (
    <div className="space-y-6">
      {/* Application History */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Application History
        </h3>
        <div className="relative">
          {mockApplicationHistory.map((item, index) => (
            <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Timeline line */}
              {index < mockApplicationHistory.length - 1 && (
                <div className="absolute left-5 top-10 h-[calc(100%-40px)] w-0.5 bg-blue-200" />
              )}
              {/* Icon */}
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                {item.icon === "file" && <FileText className="h-5 w-5" />}
                {item.icon === "user" && <User className="h-5 w-5" />}
                {item.icon === "check" && <User className="h-5 w-5" />}
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  {item.status && (
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
function DocumentsTab({ doctor }: { doctor: Doctor }) {
  return (
    <div className="space-y-6">
      {/* Uploaded Documents */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Uploaded Documents
        </h3>
        <div className="space-y-3">
          {mockDocuments.map((doc) => (
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
                  <p className="text-sm text-blue-500">{doc.filename}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
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
          {/* Placeholder for signature - in real app this would be an image */}
          <div className="text-center">
            <div className="font-script text-2xl text-slate-600 mb-2" style={{ fontStyle: "italic" }}>
              [Signature]
            </div>
            <p className="font-semibold text-blue-700">Dr. {doctor.fullName}</p>
            <p className="text-sm text-slate-600">{doctor.specialization}</p>
            <p className="text-sm text-slate-600">
              Reg No: {doctor.registrationNumber.split(" ")[0]}
            </p>
          </div>
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
function CommunicationsTab({ doctor }: { doctor: Doctor }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">
            Communications ({mockCommunications.length})
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
        {mockCommunications.map((comm) => (
          <div
            key={comm.id}
            className="rounded-xl border border-amber-200 bg-amber-50/50 p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-slate-900">{comm.subject}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                  {comm.priority}
                </span>
                <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                  {comm.status}
                </span>
              </div>
              <span className="text-sm text-slate-400">{comm.date}</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Admin: {comm.adminName}</p>
            <p className="text-sm text-slate-700">{comm.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
