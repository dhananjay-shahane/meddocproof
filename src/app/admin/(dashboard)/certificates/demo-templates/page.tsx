"use client";

import { useState } from "react";
import { FileText, Download, Eye, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TabType = "certificates" | "invoices";

// Certificate templates data
const certificateTemplates = [
  {
    id: "sick-leave",
    name: "Sick Leave Certificate",
    description: "Official sick leave certificate with detailed medical assessment",
  },
  {
    id: "work-from-home",
    name: "Work From Home Certificate",
    description: "Certificate for employees requiring work from home due to medical conditions",
  },
  {
    id: "fitness",
    name: "Fitness Certificate",
    description: "Fitness certificate for employment, sports, or general health clearance",
  },
  {
    id: "travel-unfitness",
    name: "Travel Unfitness Certificate",
    description: "Certificate declaring medical unfitness for travel",
  },
  {
    id: "medical-leave",
    name: "Medical Leave Certificate",
    description: "Extended medical leave certificate for serious health conditions",
  },
  {
    id: "pregnancy",
    name: "Pregnancy Certificate",
    description: "Pregnancy certificate for maternity leave and workplace accommodations",
  },
];

export default function DemoTemplatesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("certificates");

  const handlePreview = (name: string) => {
    toast.info(`Previewing ${name}...`);
  };

  const handleDownload = (name: string) => {
    toast.success(`Downloading ${name} sample...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Demo Templates & Invoices</h2>
        <p className="text-muted-foreground">
          Preview and test medical certificate templates and professional invoice designs with sample data
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "certificates"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Certificate Templates
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "invoices"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="h-4 w-4" />
          Invoice Templates
        </button>
      </div>

      {/* Certificate Templates Tab */}
      {activeTab === "certificates" && (
        <div className="space-y-8">
          {/* Certificate Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificateTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border bg-card p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-600">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handlePreview(template.name)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Certificate
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownload(template.name)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Sample
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Sample Data Information */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-1">Sample Data Information</h3>
            <p className="text-sm text-muted-foreground mb-6">
              All demo certificates use the following sample data for consistency
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Doctor Information */}
              <div>
                <h4 className="font-medium mb-3">Doctor Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    <span className="text-blue-600">Dr. Priya Sharma</span>
                  </div>
                  <div>
                    <span className="font-medium">Qualifications:</span>{" "}
                    <span className="text-blue-600">MBBS, MD (General Medicine)</span>
                  </div>
                  <div>
                    <span className="font-medium">Registration:</span>{" "}
                    <span className="text-blue-600">MCI/2015/45678</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    <span className="text-blue-600">+91 9876500000</span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <span className="text-blue-600">support@meddocproof.com</span>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h4 className="font-medium mb-3">Patient Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    <span className="text-blue-600">Mr. Rahul Verma</span>
                  </div>
                  <div>
                    <span className="font-medium">Age:</span>{" "}
                    <span className="text-blue-600">32 years</span>
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span>{" "}
                    <span className="text-blue-600">Male</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    <span className="text-blue-600">+91 9876512345</span>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    <span className="text-blue-600">
                      #123, Sector 18, Noida, Uttar Pradesh, 201301
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Assessment */}
            <div className="mt-8">
              <h4 className="font-medium mb-3">Medical Assessment</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Diagnosis:</span>{" "}
                  <span className="text-blue-600">Acute Viral Fever</span>
                </div>
                <div>
                  <span className="font-medium">Complaints:</span>{" "}
                  <span className="text-blue-600">High fever, body ache, fatigue</span>
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  <span className="text-blue-600">3 days</span>
                </div>
                <div>
                  <span className="font-medium">Severity:</span>{" "}
                  <span className="text-blue-600">Moderate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Features */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-1">Certificate Features</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Our medical certificates include the following professional features
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Page 1 */}
              <div>
                <h4 className="font-medium mb-3">Page 1: Main Certificate</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Doctor credentials and contact</li>
                  <li>• Patient details and assessment</li>
                  <li>• Diagnosis and medical advice</li>
                  <li>• Digital signature placement</li>
                  <li>• Legal disclaimer</li>
                </ul>
              </div>

              {/* Page 2 */}
              <div>
                <h4 className="font-medium mb-3">Page 2: Medical Assessment</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Complete clinical assessment</li>
                  <li>• Medical history details</li>
                  <li>• Comorbidities and past history</li>
                  <li>• Examination findings</li>
                  <li>• Treatment recommendations</li>
                </ul>
              </div>

              {/* Professional Design */}
              <div>
                <h4 className="font-medium mb-3">Professional Design</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Medical symbol and branding</li>
                  <li>• Professional color scheme</li>
                  <li>• Print-ready format</li>
                  <li>• Responsive design</li>
                  <li>• Security watermarks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Templates Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-8">
          {/* Professional Invoice Template */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-start gap-3 mb-4">
              <Receipt className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg text-blue-600">
                  Professional Invoice Template
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate and preview our enterprise-level invoice template with sample data
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Sample Invoice Details */}
              <div>
                <h4 className="font-medium mb-3">Sample Invoice Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">Amit Kumar Singh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate Type:</span>
                    <span className="font-medium">Medical Fitness Certificate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-blue-600">₹499.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-medium">Whatsapp</span>
                  </div>
                </div>
              </div>

              {/* Invoice Features */}
              <div>
                <h4 className="font-medium mb-3">Invoice Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Professional company branding</li>
                  <li>• Detailed payment breakdown</li>
                  <li>• Customer and billing information</li>
                  <li>• Payment gateway details</li>
                  <li>• Certificate service information</li>
                  <li>• Enterprise-level design</li>
                </ul>
              </div>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast.success("Generating sample invoice...");
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Generate & Download Sample Invoice
            </Button>
          </div>

          {/* Invoice Template Details */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-1">Invoice Template Details</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Professional invoice design specifications and features
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Design Elements */}
              <div>
                <h4 className="font-medium mb-3">Design Elements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Company logo integration</li>
                  <li>• Professional color scheme</li>
                  <li>• Clean typography hierarchy</li>
                  <li>• Structured layout sections</li>
                  <li>• Print-optimized format</li>
                </ul>
              </div>

              {/* Business Information */}
              <div>
                <h4 className="font-medium mb-3">Business Information</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Complete company details</li>
                  <li>• Contact information</li>
                  <li>• GST and registration numbers</li>
                  <li>• Professional credentials</li>
                  <li>• Legal compliance</li>
                </ul>
              </div>

              {/* Financial Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Financial Breakdown</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Itemized service charges</li>
                  <li>• Payment gateway details</li>
                  <li>• Tax calculations</li>
                  <li>• Net amount calculations</li>
                  <li>• Professional totals display</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sample Customer Data */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-1">Sample Customer Data</h3>
            <p className="text-sm text-muted-foreground mb-6">
              The invoice will be generated using the following sample customer information
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h4 className="font-medium mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    <span>Amit Kumar Singh</span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <span className="text-blue-600">amit.singh@example.com</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    <span>+91-9988776655</span>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <div className="ml-4 text-muted-foreground">
                      <p>B-204, Sunrise Apartments</p>
                      <p>Sector 45, Gurugram</p>
                      <p>Haryana 122003</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h4 className="font-medium mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Order ID:</span>{" "}
                    <span className="text-blue-600">MDP_ORD_2026031500001</span>
                  </div>
                  <div>
                    <span className="font-medium">Payment ID:</span>{" "}
                    <span className="text-blue-600">MDP_PAY_2026031500001</span>
                  </div>
                  <div>
                    <span className="font-medium">Certificate Number:</span>{" "}
                    <span className="text-blue-600">MDP-CERT-00001</span>
                  </div>
                  <div>
                    <span className="font-medium">Certificate Type:</span>{" "}
                    <span className="text-blue-600">Medical Fitness Certificate</span>
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span>{" "}
                    <span className="text-blue-600">₹499.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
