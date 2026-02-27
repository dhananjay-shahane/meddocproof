"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  status: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  stats: {
    totalApplications: number;
    completedCertificates: number;
    totalSpent: number;
    totalPayments: number;
  };
}

interface UserApplication {
  id: string;
  applicationId: string;
  certificateType: string;
  status: string;
  certificateNumber: string | null;
  paymentCompleted: boolean;
  formData: Record<string, unknown>;
  consultationDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedDoctor: {
    fullName: string;
    specialization: string;
  } | null;
}

interface UserCertificate {
  id: string;
  applicationId: string;
  certificateType: string;
  certificateNumber: string | null;
  status: string;
  formData: Record<string, unknown>;
  consultationDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedDoctor: {
    fullName: string;
    specialization: string;
    registrationNumber: string;
  } | null;
  medicalAssessment: {
    fullDiagnosisOfIllness: string;
    restPeriodFrom: string;
    restPeriodTo: string;
    restDuration: string;
  } | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [appPage, setAppPage] = useState(1);
  const [appTotal, setAppTotal] = useState(0);
  const [appTotalPages, setAppTotalPages] = useState(0);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.data);
    } catch {
      console.error("Failed to fetch profile");
    }
  }, []);

  const fetchApplications = useCallback(async (page = 1) => {
    try {
      const res = await api.get(`/user/applications?page=${page}&limit=10`);
      setApplications(res.data.data.applications);
      setAppTotal(res.data.data.total);
      setAppTotalPages(res.data.data.totalPages);
      setAppPage(page);
    } catch {
      console.error("Failed to fetch applications");
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await api.get("/user/certificates");
      setCertificates(res.data.data.certificates);
    } catch {
      console.error("Failed to fetch certificates");
    }
  }, []);

  const updateProfile = useCallback(async (data: { fullName?: string; email?: string }) => {
    try {
      const res = await api.put("/user/profile", data);
      if (res.data.success) {
        toast.success("Profile updated successfully");
        await fetchProfile();
      }
    } catch {
      toast.error("Failed to update profile");
    }
  }, [fetchProfile]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchApplications(), fetchCertificates()]);
      setLoading(false);
    };
    load();
  }, [fetchProfile, fetchApplications, fetchCertificates]);

  return {
    profile,
    applications,
    certificates,
    loading,
    appPage,
    appTotal,
    appTotalPages,
    fetchApplications,
    updateProfile,
  };
}
