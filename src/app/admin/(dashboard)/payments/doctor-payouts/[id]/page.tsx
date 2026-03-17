"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Award,
  Search,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

// Mock doctor data
const mockDoctor = {
  id: "68a85ee45b751b39c06dd5a1",
  name: "Nagarjuna Reddy",
  registrationNumber: "MCI2561234",
  phone: "+919849058821",
  email: "nagaaa@gmail.com",
  specialty: "Endocrinology",
  joinedDate: "2025-08-20",
  certificatesIssued: 0,
  status: "pending",
  wallet: {
    totalEarnings: 0,
    availableBalance: 0,
    totalWithdrawn: 0,
  },
  feeStructure: {
    digitalCertificate: 300,
    writtenCertificate: 500,
    form1ADigital: 300,
  },
};

// Mock applications data
const mockApplications: Application[] = [];

interface Application {
  id: string;
  certificateType: string;
  certificateId: string;
  patientName: string;
  completionDate: string;
  doctorEarning: number;
  status: string;
}

export default function DoctorPaymentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("");

  const doctor = mockDoctor;
  const applications = mockApplications;

  const filteredApplications = applications.filter((app) => {
    if (typeFilter !== "all" && app.certificateType !== typeFilter) return false;
    if (
      search &&
      !app.patientName.toLowerCase().includes(search.toLowerCase()) &&
      !app.certificateId.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Doctor Payment Details
            </h1>
            <p className="text-sm text-slate-500">
              View earnings and payment history
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          {/* Doctor Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <span className="text-xl text-slate-400">👤</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {doctor.name}
              </h2>
              <p className="text-sm text-slate-500">
                Registration: {doctor.registrationNumber}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        </div>

        {/* Three Column Info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-500">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">{doctor.email}</span>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-500">
              Professional Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">{doctor.specialty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">
                  Joined: {new Date(doctor.joinedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">
                  {doctor.certificatesIssued} Certificates Issued
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Summary & Fee Structure */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-500">
              Wallet Summary & Fee Structure
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Earnings:</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(doctor.wallet.totalEarnings)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Available Balance:</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(doctor.wallet.availableBalance)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Withdrawn:</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(doctor.wallet.totalWithdrawn)}
                </span>
              </div>

              <div className="mt-3 pt-2">
                <p className="text-xs font-medium text-slate-500">
                  Agreed Fee Structure:
                </p>
                <div className="mt-1 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Digital Certificate:</span>
                    <span className="text-slate-700">
                      {formatCurrency(doctor.feeStructure.digitalCertificate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Written Certificate:</span>
                    <span className="text-slate-700">
                      {formatCurrency(doctor.feeStructure.writtenCertificate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Form 1A Digital:</span>
                    <span className="text-slate-700">
                      {formatCurrency(doctor.feeStructure.form1ADigital)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Applications */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Completed Applications
          </h2>
          <p className="text-sm text-slate-500">
            All certificates issued by this doctor with payment details
          </p>
        </div>

        {/* Filters */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient name or certificate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All Types</option>
              <option value="digital">Digital Certificate</option>
              <option value="written">Written Certificate</option>
              <option value="form1a">Form 1A</option>
            </select>

            {/* Date Range */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pick a date range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-9 w-48 rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b bg-slate-50/50">
                <th className="px-6 py-3 text-left font-medium text-slate-500">
                  Certificate Details
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Patient Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Completion Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Doctor Earning
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No applications found for the selected filters
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {app.certificateType}
                      </p>
                      <p className="text-xs text-slate-400">{app.certificateId}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{app.patientName}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {app.completionDate}
                    </td>
                    <td className="px-4 py-4 font-medium text-green-600">
                      {formatCurrency(app.doctorEarning)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
