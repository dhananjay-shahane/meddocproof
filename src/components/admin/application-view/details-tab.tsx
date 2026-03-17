"use client";

import { User } from "lucide-react";
import type { Application } from "@/types";

interface DetailsTabProps {
  application: Application;
}

export function DetailsTab({ application }: DetailsTabProps) {
  const formData = application.formData as Record<string, string | undefined>;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-50 p-2">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Application Details</h2>
          <p className="text-sm text-muted-foreground">
            Complete information about this application
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-blue-600">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <p className="text-sm text-blue-600 mb-1">Full Name</p>
            <p className="font-medium">
              {formData?.fullName || application.user?.fullName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Email</p>
            <p className="font-medium text-blue-600">
              {formData?.email || application.user?.email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Phone</p>
            <p className="font-medium">
              {formData?.phoneNumber || application.user?.phoneNumber || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Date of Birth</p>
            <p className="font-medium">
              {formData?.dateOfBirth || formData?.dob || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Certificate Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-blue-600">
          Certificate Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <p className="text-sm text-blue-600 mb-1">Certificate Type</p>
            <p className="font-medium">
              {application.certificateType.replace(/_/g, "-")}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Delivery Method</p>
            <p className="font-medium">
              {formData?.deliveryMethod || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Application ID</p>
            <p className="font-medium text-sm">
              {application.applicationId?.includes("temp_") 
                ? application.applicationId 
                : application.applicationId}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 mb-1">Certificate ID</p>
            <p className="font-medium text-sm">
              {application.certificateNumber || "Not Generated"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
