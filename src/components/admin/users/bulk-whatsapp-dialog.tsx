"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import type { WhatsAppBulkTemplate } from "@/types";

interface BulkWhatsAppDialogProps {
  open: boolean;
  onClose: () => void;
  selectedUserIds: string[];
  onSuccess?: () => void;
}

export function BulkWhatsAppDialog({
  open,
  onClose,
  selectedUserIds,
  onSuccess,
}: BulkWhatsAppDialogProps) {
  const [templates, setTemplates] = useState<WhatsAppBulkTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await api.get("/admin/users/bulk-whatsapp");
      setTemplates(res.data.templates || []);
    } catch {
      toast.error("Failed to load templates");
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchTemplates();
      setSelectedTemplate("");
      setCustomMessage("");
      setUseCustom(false);
    }
  }, [open, fetchTemplates]);

  const selectedTemplateObj = templates.find((t) => t.name === selectedTemplate);

  const handleSend = async () => {
    if (!useCustom && !selectedTemplate) {
      toast.error("Please select a template or write a custom message");
      return;
    }
    if (useCustom && !customMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const payload = {
        userIds: selectedUserIds,
        ...(useCustom
          ? { customMessage: customMessage.trim() }
          : { templateName: selectedTemplate }),
      };
      const res = await api.post("/admin/users/bulk-whatsapp", payload);
      toast.success(
        `Messages sent to ${res.data.sentCount} user${res.data.sentCount !== 1 ? "s" : ""}`
      );
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to send messages");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            Send Bulk WhatsApp
          </DialogTitle>
          <DialogDescription>
            Send a WhatsApp message to {selectedUserIds.length} selected user
            {selectedUserIds.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toggle: Template vs Custom */}
          <div className="flex gap-2">
            <Button
              variant={!useCustom ? "default" : "outline"}
              size="sm"
              onClick={() => setUseCustom(false)}
            >
              Use Template
            </Button>
            <Button
              variant={useCustom ? "default" : "outline"}
              size="sm"
              onClick={() => setUseCustom(true)}
            >
              Custom Message
            </Button>
          </div>

          {!useCustom ? (
            <div className="space-y-3">
              {loadingTemplates ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((tpl) => (
                    <label
                      key={tpl.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        selectedTemplate === tpl.name
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="template"
                        value={tpl.name}
                        checked={selectedTemplate === tpl.name}
                        onChange={() => setSelectedTemplate(tpl.name)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {tpl.name.replace(/_/g, " ")}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {tpl.content}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Preview */}
              {selectedTemplateObj && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Preview
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedTemplateObj.content.replace(
                      /\{\{fullName\}\}/g,
                      "John Doe"
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message... Use {{fullName}} to personalize."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {"{{fullName}}"}
              </p>
              {customMessage && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Preview
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {customMessage.replace(/\{\{fullName\}\}/g, "John Doe")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending} className="gap-1.5">
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send to {selectedUserIds.length} user
            {selectedUserIds.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
