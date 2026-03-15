"use client";

import { useState } from "react";
import {
  HelpCircle,
  FileText,
  Users,
  CreditCard,
  GitBranch,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  BookOpen,
  AlertCircle,
  FileCheck,
  UserPlus,
  ExternalLink,
} from "lucide-react";

const quickHelpCards = [
  {
    title: "Certificate Management",
    description: "Learn how to generate, edit, and manage medical certificates",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Doctor Management",
    description: "Manage doctor registrations, approvals, and performance",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Payment Processing",
    description: "Handle payments, withdrawals, and financial reporting",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Application Workflow",
    description: "Understand the complete application lifecycle",
    icon: GitBranch,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
];

const faqs = [
  {
    question: "How do I generate a medical certificate?",
    answer:
      'Navigate to Incomplete Certificates, find the certificate with completed consultation, and click "Generate Certificate" to create the HTML version.',
  },
  {
    question: "How do I submit a certificate to a patient?",
    answer:
      'After generating the certificate HTML, preview it, save as PDF, upload the PDF, then click "Submit to User" to send it to the patient.',
  },
  {
    question: "How do I manage doctor registrations?",
    answer:
      "Go to Doctors > New Registrations to review and approve new doctor applications. Check their credentials before approval.",
  },
  {
    question: "How do I track payments?",
    answer:
      "Access the Payments section to view all transactions, withdrawals, and financial analytics.",
  },
  {
    question: "How do I edit a certificate after generation?",
    answer:
      'In Incomplete Certificates, use the dropdown menu and select "Edit Certificate Data" to modify patient or medical information.',
  },
];

const contactSupport = [
  {
    title: "Email Support",
    value: "support@mediproofdocs.com",
    icon: Mail,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "Phone Support",
    value: "+91 1234567890",
    icon: Phone,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Live Chat",
    value: "Available 9 AM - 6 PM IST",
    icon: MessageCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
];

const documentation = [
  {
    title: "Admin User Guide",
    icon: BookOpen,
  },
  {
    title: "Troubleshooting Guide",
    icon: AlertCircle,
  },
  {
    title: "Certificate Guidelines",
    icon: FileCheck,
  },
  {
    title: "Doctor Onboarding Guide",
    icon: UserPlus,
  },
];

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Find answers to common questions and get support for the admin platform
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickHelpCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="cursor-pointer rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-xl p-3 ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-600">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-b-0">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="flex w-full items-center gap-2 py-4 text-left"
              >
                <ChevronRight
                  className={`h-4 w-4 text-blue-600 transition-transform ${
                    expandedFaq === index ? "rotate-90" : ""
                  }`}
                />
                <span className="font-medium text-blue-600">{faq.question}</span>
              </button>
              {expandedFaq === index && (
                <div className="pb-4 pl-6">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Contact Support</h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {contactSupport.map((contact) => {
            const Icon = contact.icon;
            return (
              <div key={contact.title} className="flex items-center gap-4">
                <div className={`rounded-xl p-3 ${contact.bgColor}`}>
                  <Icon className={`h-5 w-5 ${contact.color}`} />
                </div>
                <div>
                  <p className="font-medium">{contact.title}</p>
                  <p className="text-sm text-muted-foreground">{contact.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documentation & Resources */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Documentation & Resources</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {documentation.map((doc) => {
            const Icon = doc.icon;
            return (
              <button
                key={doc.title}
                className="flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{doc.title}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
