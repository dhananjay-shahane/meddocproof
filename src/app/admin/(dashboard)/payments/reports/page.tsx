"use client";

import { useState } from "react";
import {
  TrendingUp,
  FileText,
  Users,
  BarChart3,
  Clock,
  FileBarChart,
  Download,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const reportTypes = [
  {
    id: "revenue",
    name: "Revenue Report",
    description: "Comprehensive revenue analysis with breakdowns",
    icon: TrendingUp,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "transaction",
    name: "Transaction Report",
    description: "Detailed transaction history and payment breakdown",
    icon: FileText,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "doctor-payouts",
    name: "Doctor Payouts Report",
    description: "Doctor earnings, withdrawals, and wallet status",
    icon: Users,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "profit-analysis",
    name: "Profit Analysis",
    description: "Platform profit margins and efficiency metrics",
    icon: BarChart3,
    formats: ["PDF", "Excel"],
  },
  {
    id: "gateway-fees",
    name: "Gateway Fees Report",
    description: "Razorpay fees analysis and cost breakdown",
    icon: Clock,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "financial-summary",
    name: "Financial Summary",
    description: "Executive summary with key financial metrics",
    icon: FileBarChart,
    formats: ["PDF"],
  },
];

const dateRanges = [
  "This Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
  "Last Year",
  "Custom Range",
];

export default function PaymentReportsPage() {
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [dateRange, setDateRange] = useState("This Month");
  const [generating, setGenerating] = useState<string | null>(null);

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport);

  const handleDownload = async (format: string) => {
    setGenerating(format);
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGenerating(null);
    toast.success(`${selectedReportData?.name} downloaded as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-500">
          Generate and export comprehensive financial reports
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side - Report Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Report Type */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Select Report Type
              </h2>
              <p className="text-sm text-gray-500">
                Choose the type of financial report you want to generate
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                const isSelected = selectedReport === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          isSelected
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium ${
                            isSelected ? "text-blue-700" : "text-gray-900"
                          }`}
                        >
                          {report.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {report.description}
                        </p>
                        <div className="flex gap-1.5 mt-3">
                          {report.formats.map((format) => (
                            <span
                              key={format}
                              className={`px-2 py-0.5 text-xs font-medium rounded ${
                                format === "PDF"
                                  ? "bg-blue-600 text-white"
                                  : format === "Excel"
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Select Date Range */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Select Date Range
              </h2>
              <p className="text-sm text-gray-500">
                Choose the time period for your report
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Predefined Ranges
              </label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {dateRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Report Preview */}
        <div className="space-y-6">
          {/* Report Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Report Preview
              </h2>
              <p className="text-sm text-gray-500">
                {selectedReportData?.name}
              </p>
            </div>

            <div className="space-y-4">
              {/* Selected Report Info */}
              <div className="flex items-center gap-3">
                {selectedReportData && (
                  <>
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <selectedReportData.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {selectedReportData.name}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-500">
                {selectedReportData?.description}
              </p>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Available Formats:
                </p>
                <div className="flex gap-2">
                  {selectedReportData?.formats.map((format) => (
                    <span
                      key={format}
                      className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 border border-gray-200"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Date Range:</p>
                <p className="text-sm text-gray-500">{dateRange}</p>
              </div>
            </div>
          </div>

          {/* Generate Report */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Generate Report
              </h2>
              <p className="text-sm text-gray-500">
                Download your report in the desired format
              </p>
            </div>

            <div className="space-y-3">
              {selectedReportData?.formats.includes("PDF") && (
                <button
                  onClick={() => handleDownload("PDF")}
                  disabled={generating === "PDF"}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {generating === "PDF" ? "Generating..." : "Download PDF"}
                  </span>
                </button>
              )}
              {selectedReportData?.formats.includes("Excel") && (
                <button
                  onClick={() => handleDownload("Excel")}
                  disabled={generating === "Excel"}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {generating === "Excel"
                      ? "Generating..."
                      : "Download Excel"}
                  </span>
                </button>
              )}
              {selectedReportData?.formats.includes("CSV") && (
                <button
                  onClick={() => handleDownload("CSV")}
                  disabled={generating === "CSV"}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {generating === "CSV" ? "Generating..." : "Download CSV"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Report Types</span>
                <span className="text-sm font-semibold text-gray-900">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Export Formats</span>
                <span className="text-sm font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Freshness</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                  Real-time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
