"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Empty by default to show empty state
const mockTemplates: Template[] = [];

export default function CertificateTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);

  const handleInitializeDefaults = () => {
    toast.info("Initializing default templates...");
    // Add default templates
    const defaults: Template[] = [
      {
        id: "1",
        name: "Standard Sick Leave",
        type: "sick_leave",
        description: "Default template for sick leave certificates",
        isDefault: true,
        isActive: true,
        createdAt: "2024-01-15",
        updatedAt: "2024-02-20",
      },
      {
        id: "2",
        name: "Fitness Certificate",
        type: "fitness",
        description: "Standard fitness certificate template",
        isDefault: true,
        isActive: true,
        createdAt: "2024-01-20",
        updatedAt: "2024-02-18",
      },
    ];
    setTemplates(defaults);
    toast.success("Default templates initialized!");
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success("Template deleted");
  };

  const handleDuplicate = (template: Template) => {
    const duplicate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [...prev, duplicate]);
    toast.success("Template duplicated");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Certificate Templates</h2>
          <p className="text-muted-foreground">
            Manage medical certificate templates
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/certificates/demo-templates">
              <Eye className="mr-2 h-4 w-4" />
              View Demo
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/certificates/templates/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Link>
          </Button>
        </div>
      </div>

      {/* Templates List or Empty State */}
      {templates.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-lg bg-muted p-4 mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get started by creating your first certificate template
            </p>
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/admin/certificates/templates/create">
                  Create Template
                </Link>
              </Button>
              <Button variant="outline" onClick={handleInitializeDefaults}>
                Initialize Default Templates
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {template.type.replace(/_/g, " ")}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/admin/certificates/templates/${template.id}/edit`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {template.description || "No description"}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Updated {template.updatedAt}
                </span>
                <div className="flex items-center gap-2">
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  {template.isActive && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
