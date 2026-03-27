// ============================================================
// Socket.io event constants & payload types
// Used by both the server (API routes) and client (hooks/UI)
// ============================================================

export const SOCKET_EVENTS = {
  // Server → admin room (temporary applications)
  TEMPORARY_CREATED: "temporary:created",
  TEMPORARY_STEP_UPDATED: "temporary:step_updated",
  TEMPORARY_COMPLETED: "temporary:completed",
  TEMPORARY_REMOVED: "temporary:removed",

  // Server → admin room (real-time notifications)
  DOCTOR_REGISTERED: "admin:doctor_registered",
  USER_REGISTERED: "admin:user_registered",
  CERTIFICATE_APPLIED: "admin:certificate_applied",

  // Client → server
  ADMIN_JOIN: "admin:join",
} as const;

export type SocketEventName =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

// ─── Payload shapes ──────────────────────────────────────────

export interface TemporaryApplicationPayload {
  id: string;
  applicationId: string;
  certificateType: string;
  currentStep: number;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
  /** Partial form data available so far */
  formData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
  user?: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
  } | null;
}

export interface StepUpdatedPayload {
  id: string;
  applicationId: string;
  currentStep: number;
  lastActiveAt: string;
  updatedAt: string;
  formData?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
}

export interface TemporaryCompletedPayload {
  id: string;
  applicationId: string;
}

export interface DoctorRegisteredPayload {
  doctorId: string;
  fullName: string;
  specialization: string;
  createdAt: string;
}

export interface UserRegisteredPayload {
  userId: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
}

export interface CertificateAppliedPayload {
  applicationId: string;
  certificateType: string;
  userId: string;
  createdAt: string;
}
