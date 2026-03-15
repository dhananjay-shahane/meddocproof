"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Certificate types
const CERTIFICATE_TYPES = [
  { value: "sick_leave", label: "Sick Leave Certificate" },
  { value: "fitness", label: "Fitness Certificate" },
  { value: "work_from_home", label: "Work From Home Certificate" },
  { value: "caretaker", label: "Caretaker Certificate" },
  { value: "recovery", label: "Recovery Certificate" },
  { value: "fit_to_fly", label: "Fit to Fly Certificate" },
  { value: "unfit_to_work", label: "Unfit to Work Certificate" },
  { value: "unfit_to_travel", label: "Unfit to Travel Certificate" },
  { value: "medical_diagnosis", label: "Medical Diagnosis Certificate" },
];

// Field types
const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "textarea", label: "Textarea" },
  { value: "checkbox", label: "Checkbox" },
];

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface CertificateSection {
  id: string;
  title: string;
  content: string;
}

export default function CreateTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Information
  const [templateName, setTemplateName] = useState("");
  const [certificateType, setCertificateType] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Form Fields
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "1", label: "", type: "text", placeholder: "", required: false },
  ]);

  // Certificate Sections
  const [sections, setSections] = useState<CertificateSection[]>([
    { id: "1", title: "", content: "" },
  ]);

  const addFormField = () => {
    setFormFields((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: "",
        type: "text",
        placeholder: "",
        required: false,
      },
    ]);
  };

  const removeFormField = (id: string) => {
    if (formFields.length === 1) {
      toast.error("At least one field is required");
      return;
    }
    setFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFormField = (id: string, field: Partial<FormField>) => {
    setFormFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...field } : f))
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", content: "" },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length === 1) {
      toast.error("At least one section is required");
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: Partial<CertificateSection>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...field } : s))
    );
  };

  const detectVariables = (content: string) => {
    const matches = content.match(/\{\{[^}]+\}\}/g) || [];
    return matches;
  };

  const handleSubmit = async () => {
    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!certificateType) {
      toast.error("Certificate type is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Template created successfully");
      router.push("/admin/certificates/templates");
    } catch {
      toast.error("Failed to create template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/certificates/templates">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create Template</h2>
          <p className="text-muted-foreground">
            Design a new certificate template
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Standard Sick Leave"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateType">Certificate Type *</Label>
            <select
              id="certificateType"
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select certificate type</option>
              {CERTIFICATE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between md:col-span-2">
            <div>
              <Label htmlFor="active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Make this template available for use
              </p>
            </div>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Form Fields</h3>
          <Button variant="outline" size="sm" onClick={addFormField}>
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </div>
        <div className="space-y-4">
          {formFields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto_auto] items-end border rounded-lg p-4 bg-muted/30"
            >
              <div className="space-y-2">
                <Label>Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) =>
                    updateFormField(field.id, { label: e.target.value })
                  }
                  placeholder="e.g., Patient Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Field Type</Label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateFormField(field.id, { type: e.target.value })
                  }
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input
                  value={field.placeholder}
                  onChange={(e) =>
                    updateFormField(field.id, { placeholder: e.target.value })
                  }
                  placeholder="Enter placeholder text"
                />
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateFormField(field.id, { required: checked })
                  }
                />
                <Label htmlFor={`required-${field.id}`} className="text-sm">
                  Required
                </Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeFormField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Sections */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Certificate Sections</h3>
            <p className="text-sm text-muted-foreground">
              Use {"{{variable}}"} syntax to include dynamic content
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
        <div className="space-y-4">
          {sections.map((section, index) => {
            const variables = detectVariables(section.content);
            return (
              <div
                key={section.id}
                className="border rounded-lg p-4 bg-muted/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="cursor-grab text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, { title: e.target.value })
                      }
                      placeholder="e.g., Medical Assessment"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="ml-8 space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={section.content}
                    onChange={(e) =>
                      updateSection(section.id, { content: e.target.value })
                    }
                    placeholder="This is to certify that {{patient_name}} has been examined..."
                    rows={4}
                  />
                  {variables.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Detected variables:
                      </span>
                      {variables.map((v, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/certificates/templates">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </div>
  );
}
