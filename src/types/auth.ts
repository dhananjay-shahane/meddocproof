import type { AdminUser, Doctor, User, UserRole } from "@/types";

// Auth state for the context
export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Union type for authenticated user
export type AuthUser = AdminAuthUser | DoctorAuthUser | UserAuthUser;

export interface AdminAuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  type: "admin";
  permissions?: Record<string, Record<string, boolean>> | null;
  isActive: boolean;
}

export interface DoctorAuthUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  type: "doctor";
  status: string;
  isActive: boolean;
  specialization: string;
  registrationNumber: string;
}

export interface UserAuthUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  type: "user";
  role: UserRole;
  isVerified: boolean;
}

// Login forms
export interface AdminLoginForm {
  email: string;
  password: string;
}

export interface DoctorLoginForm {
  email: string;
  password: string;
}

export interface UserLoginForm {
  phoneNumber: string;
}

export interface OTPVerifyForm {
  phoneNumber: string;
  otp: string;
}

// Auth context type
export interface AuthContextType {
  user: AuthUser | null;
  token: string | null; // always null — kept for backward compat
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string | undefined, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}
