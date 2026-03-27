// Core type definitions for MediProofDocs

// ============================================
// User Types
// ============================================

export type UserRole = "user" | "admin" | "super_admin" | "support";
export type DoctorStatus = "pending" | "approved" | "rejected" | "suspended";
export type ApplicationStatus =
  | "in_progress"
  | "incomplete"
  | "dormant"
  | "submitted"
  | "pending"
  | "pending_review"
  | "pending_doctor_review"
  | "assigned"
  | "doctor_assigned"
  | "consultation_scheduled"
  | "certificate_in_progress"
  | "under_review"
  | "processing"
  | "approved"
  | "consultation_completed"
  | "completed"
  | "certificate_delivered"
  | "delivered"
  | "rejected"
  | "cancelled"
  | "refunded";

export type CertificateType = "sick_leave" | "fitness" | "work_from_home" | "caretaker" | "recovery" | "fit_to_fly" | "unfit_to_work" | "unfit_to_travel" | "medical_diagnosis";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type TransactionType = "payment" | "refund" | "doctor_payout" | "withdrawal" | "adjustment";
export type WithdrawalStatus = "pending" | "approved" | "rejected" | "completed";

// ============================================
// Data Models
// ============================================

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  status: string;
  isVerified: boolean;
  role: UserRole;
  lastLoginAt?: string | null;
  applications?: Application[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  permissions?: Permissions | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  registrationNumber: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospitalAffiliation?: string | null;
  status: DoctorStatus;
  isActive: boolean;
  isEmailVerified: boolean;
  avgRating: number;
  totalRatings: number;
  responseRate: number;
  avgCompletionTime: number;
  completedCertificates: number;
  consultationCount: number;
  certificatesByType?: Record<string, number> | null;
  lastActive?: string | null;
  wallet?: DoctorWallet | null;
  applications?: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorWallet {
  id: string;
  doctorId: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  updatedAt: string;
}

export interface DoctorWithdrawal {
  id: string;
  doctorId: string;
  amount: number;
  status: WithdrawalStatus;
  bankDetails?: BankDetails | null;
  processedBy?: string | null;
  requestedAt: string;
  processedAt?: string | null;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface Application {
  id: string;
  applicationId: string;
  userId: string;
  user?: User;
  status: ApplicationStatus;
  certificateType: CertificateType;
  certificateNumber?: string | null;
  formData: Record<string, unknown>;
  assignedDoctorId?: string | null;
  assignedDoctor?: Doctor | null;
  assignedAt?: string | null;
  assignedBy?: string | null;
  consultationDate?: string | null;
  consultationNotes?: string | null;
  consultationCompleted: boolean;
  medicalAssessmentId?: string | null;
  medicalAssessment?: MedicalAssessment | null;
  hasMedicalAssessment: boolean;
  paymentCompleted: boolean;
  conversionLikelihood?: number | null;
  /** Which step (0-3) the user last reached in the application form */
  currentStep: number;
  /** Timestamp of user's last interaction with the form */
  lastActiveAt: string;
  documents?: Document[];
  remarks?: Remark[];
  prescription?: Prescription | null;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalAssessment {
  id: string;
  templateType: string;
  complaintsOf: string;
  durationOfComplaints: string;
  comorbidities: string;
  courseOfIllness: string;
  severityOfIllness: string;
  fullDiagnosisOfIllness: string;
  adviceByRegisteredMedicalPractitioner: string;
  restPeriodFrom: string;
  restDuration: string;
  restPeriodTo: string;
  prescription?: MedicationItem[] | null;
  additionalRecommendations?: string | null;
  pastHistoryOfSimilarComplaints?: boolean;
  pastHistoryDetails?: string | null;
  anySubstanceIntake?: boolean;
  substanceIntakeDetails?: string | null;
  anySignificantPastHistoryOfDisease?: boolean;
  significantPastHistoryDetails?: string | null;
  anyHistoryOfSurgery?: boolean;
  surgeryHistoryDetails?: string | null;
  historyOfTravel?: boolean;
  travelHistoryDetails?: string | null;
  familyHistoryOfSuchIllness?: boolean;
  familyHistoryDetails?: string | null;
  tookAllopathicHomeopathicAyurvedicMedicine?: boolean;
  medicineDetails?: string | null;
  tookSelfHelpAndUsedHomeRemedies?: boolean;
  homeRemediesDetails?: string | null;
  anyEmergencyMedicineTreatmentTaken?: boolean;
  emergencyTreatmentDetails?: string | null;
  anyCastBandageCreamApplied?: boolean;
  castBandageDetails?: string | null;
  vitalSigns?: VitalSigns | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationItem {
  medicineName: string;
  dosage: string;
  duration: string;
}

export interface VitalSigns {
  height?: string;
  weight?: string;
  bmi?: string;
  bloodPressure?: string;
  heartRate?: string;
  oxygenSaturation?: string;
}

export interface Document {
  id: string;
  applicationId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileType: string;
  category?: string | null;
  contentType: string;
  size: number;
  createdAt: string;
}

export interface Remark {
  id: string;
  applicationId: string;
  message: string;
  addedBy: string;
  addedByRole: string;
  doctorId?: string | null;
  addedAt: string;
}

export interface Prescription {
  id: string;
  applicationId: string;
  medications: MedicationItem[];
  advice?: string | null;
  followUp?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  applicationId: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  couponCode?: string | null;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string | null;
  applicationId?: string | null;
  userId?: string | null;
  doctorId?: string | null;
  paymentId?: string | null;
  status: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string | null;
  couponType: string;
  phoneNumber?: string | null;
  maxDiscountAmount?: number | null;
  applicableFor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId?: string | null;
  doctorId?: string | null;
  adminId?: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface WhatsAppMessage {
  id: string;
  phoneNumber: string;
  direction: string;
  message: string;
  templateName?: string | null;
  status: string;
  userId?: string | null;
  applicationId?: string | null;
  createdAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  description?: string | null;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  totalRevenue: number;
  totalDoctors: number;
  activeDoctors: number;
  totalUsers: number;
  recentApplications: Application[];
  // Phase 2 additions
  monthOverMonth: {
    applications: number;
    revenue: number;
    users: number;
    doctors: number;
  };
  certificateDistribution: CertificateDistributionItem[];
  topDoctors: TopDoctorItem[];
  failedPayments: FailedPaymentItem[];
  needAttention: NeedAttentionItem[];
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface CertificateDistributionItem {
  type: CertificateType;
  label: string;
  count: number;
  percentage: number;
}

export interface TopDoctorItem {
  id: string;
  fullName: string;
  specialization: string;
  totalEarnings: number;
  completedCertificates: number;
  avgRating: number;
}

export interface FailedPaymentItem {
  id: string;
  userId: string;
  userName: string;
  applicationId: string;
  applicationDisplayId: string;
  amount: number;
  failedAt: string;
}

export interface NeedAttentionItem {
  id: string;
  applicationId: string;
  applicationDisplayId: string;
  userName: string;
  reason: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: "status_change" | "payment" | "assignment" | "remark" | "registration";
  message: string;
  timestamp: string;
  applicationId?: string;
  meta?: Record<string, unknown>;
}

export interface ApplicationFiltersState {
  search: string;
  status: string;
  certificateType: string;
  dateFrom: string;
  dateTo: string;
}

export interface ApplicationTabCounts {
  all: number;
  temporary: number;
  completed: number;
}

/** Return type of useTemporaryApplicationsLive */
export interface TemporaryApplicationsLiveState {
  items: Application[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  connected: boolean;
  /** Number of users active in the last 2 minutes */
  activeCount: number;
  refetch: () => Promise<void>;
}

export interface CertificateFeeStructure {
  digital: number;
  handwritten: number;
  form1A: number;
}

export interface DoctorDashboardStats {
  // Doctor info
  doctorName: string;
  qualification: string;
  specialization: string;
  experience: number;
  isVerified: boolean;
  
  // Financial stats
  totalEarnings: number;
  walletBalance: number;
  pendingAmount: number;
  pendingWithdrawals: number;
  
  // Fee structure
  consultationFee: number;
  certificateFeeStructure: CertificateFeeStructure;
  
  // Application stats
  assignedApplications: number;
  completedApplications: number;
  completedToday: number;
  pendingReview: number;
  totalPatients: number;
  
  // Performance metrics
  avgRating: number;
  responseRate: number;
  completionRate: number;
  
  // Recent applications
  recentApplications: Application[];
}

// ============================================
// Permission Types
// ============================================

export type PermissionModule =
  | "applications"
  | "doctors"
  | "users"
  | "certificates"
  | "payments"
  | "coupons"
  | "whatsapp"
  | "support"
  | "transactions"
  | "notifications"
  | "settings";

export type PermissionAction = "read" | "write" | "delete";

export type ModulePermissions = {
  [key in PermissionAction]?: boolean;
};

export type Permissions = {
  [key in PermissionModule]?: ModulePermissions;
};

// ============================================
// Phase 3a — Users & Doctors Types
// ============================================

export interface UserListItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  status: string;
  isVerified: boolean;
  hasPaidOrder: boolean;
  applicationCount: number;
  certificateCount: number;
  totalSpent: number;
  lastApplicationAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UserStats {
  totalUsers: number;
  paidUsers: number;
  unpaidUsers: number;
  totalApplications: number;
  totalCertificates: number;
  totalRevenue: number;
  avgRevenuePerUser: number;
  conversionRate: number;
}

export interface UserFiltersState {
  search: string;
  filter: "all" | "paid" | "unpaid";
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface DoctorsSummary {
  totalDoctors: number;
  activeDoctors: number;
  pendingApprovals: number;
  totalEarnings: number;
  avgRating: number;
  totalCertificatesIssued: number;
}

export interface DoctorFiltersState {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface DoctorPerformanceData {
  overview: {
    avgResponseRate: number;
    avgCompletionTime: number;
    totalCertificatesIssued: number;
    totalDoctors: number;
  };
  certificatesByType: { type: string; label: string; count: number }[];
  ratingDistribution: { stars: number; count: number }[];
  monthlyTrend: { month: string; count: number }[];
  topPerformers: {
    id: string;
    fullName: string;
    specialization: string;
    completedCertificates: number;
    avgRating: number;
    responseRate: number;
    totalEarnings: number;
  }[];
}

export interface WhatsAppBulkTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export interface BulkWhatsAppPayload {
  userIds: string[];
  templateName?: string;
  customMessage?: string;
}

export interface DoctorRegistration {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  // Profile
  profilePhotoUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  // Professional credentials
  registrationNumber: string;
  medicalCouncil: string | null;
  registrationYear: number | null;
  specialization: string;
  qualification: string;
  experience: number;
  hospitalAffiliation: string | null;
  // Address
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  // Documents
  medicalLicenseUrl: string | null;
  govtIdProofUrl: string | null;
  degreeCertificateUrl: string | null;
  signatureUrl: string | null;
  // Terms
  termsAcceptedAt: string | null;
  // Status
  status: DoctorStatus;
  // Timestamps
  createdAt: string;
  // Legacy field for backward compatibility
  consultationFee?: number | null;
}

// ============================================
// Phase 4a — Coupons, Certificates, Notifications, Support
// ============================================

export interface CouponFormData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses: number;
  expiresAt: string | null;
  couponType: "general" | "specific";
  phoneNumber?: string | null;
  maxDiscountAmount?: number | null;
  applicableFor: "all" | "certificates" | "consultations";
}

export interface CouponFiltersState {
  search: string;
  filter: "all" | "active" | "inactive" | "expired";
  type?: "all" | "percentage" | "fixed";
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsage: number;
}

export interface CertificateListItem {
  id: string;
  applicationId: string;
  applicationDisplayId: string;
  certificateNumber: string | null;
  certificateType: CertificateType;
  userName: string;
  userPhone: string;
  doctorName: string | null;
  status: ApplicationStatus;
  issuedAt: string | null;
  createdAt: string;
}

export interface CertificateFiltersState {
  search: string;
  tab: "all" | "incomplete" | "completed";
  sortBy: string;
  sortOrder: "asc" | "desc";
  certificateType?: string;
}

export interface CertificateStats {
  totalCertificates: number;
  completedCertificates: number;
  pendingCertificates: number;
}

export interface NotificationListItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  userId: string | null;
  doctorId: string | null;
  adminId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationFiltersState {
  filter: "all" | "read" | "unread";
  type: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  userName: string;
  userPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTime: string;
}

export interface CertificateVerificationResult {
  valid: boolean;
  certificateNumber: string;
  certificateType: CertificateType | null;
  patientName: string | null;
  doctorName: string | null;
  issuedAt: string | null;
  status: string | null;
}

// ============================================
// Phase 5 — Doctor & Admin Extended Types
// ============================================

// Doctor Application List
export interface DoctorApplicationListItem {
  id: string;
  applicationId: string;
  applicationDisplayId: string;
  certificateType: CertificateType;
  certificateNumber: string | null;
  status: ApplicationStatus;
  
  // User info
  userName: string;
  userPhone: string;
  userEmail: string;
  userGender: string | null;
  userAge: number | null;
  
  // Form data fields
  organization: string | null;
  leaveReason: string | null;
  leavePeriodFrom: string | null;
  leavePeriodTo: string | null;
  location: string | null;
  
  // Consultation info
  consultationDate: string | null;
  consultationNotes: string | null;
  consultationCompleted: boolean;
  
  // Assessment status
  hasMedicalAssessment: boolean;
  
  // Dates
  assignedAt: string | null;
  createdAt: string;
}

export interface DoctorApplicationStats {
  totalApplications: number;
  pendingReview: number;
  completed: number;
  medicalAssessment: number;
}

export interface DoctorApplicationsResponse {
  items: DoctorApplicationListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: DoctorApplicationStats;
}

export interface DoctorApplicationFiltersState {
  search: string;
  status: string;
  certificateType: string;
  tab: "pending" | "completed";
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Doctor Financials
export interface DoctorFinancialSummary {
  wallet: DoctorWallet;
  recentTransactions: Transaction[];
  recentWithdrawals: DoctorWithdrawal[];
  earningsChart: EarningsDataPoint[];
}

export interface WithdrawalRequestData {
  amount: number;
  bankDetails: BankDetails;
}

export interface EarningsDataPoint {
  date: string;
  amount: number;
}

// Doctor Settings
export interface DoctorSettingsFormData {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profilePhotoUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  registrationNumber: string;
  medicalCouncil: string | null;
  registrationYear: number | null;
  specialization: string;
  qualification: string;
  experience: number;
  hospitalAffiliation: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  signatureUrl: string | null;
}

export interface DoctorBankDetailsFormData {
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface DoctorPasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DoctorNotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newApplicationAlert: boolean;
  paymentAlert: boolean;
  withdrawalAlert: boolean;
}

// Admin Financial Types
export type DateRangeFilter =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_quarter"
  | "last_quarter"
  | "this_year"
  | "last_year"
  | "custom";

export interface FinancialOverview {
  totalRevenue: number;
  revenueTrend: number;
  totalPayouts: number;
  payoutsTrend: number;
  pendingPayments: number;
  pendingTrend: number;
  netProfit: number;
  profitTrend: number;
}

export interface PaymentListItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  applicationId: string;
  applicationDisplayId: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  couponCode: string | null;
  discount: number;
  createdAt: string;
}

export interface PaymentFiltersState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface TransactionListItem {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  applicationId: string | null;
  userId: string | null;
  doctorId: string | null;
  paymentId: string | null;
  status: string;
  createdAt: string;
}

export interface TransactionFiltersState {
  search: string;
  type: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// ============================================
// Phase 6a — Doctor Application Detail & Medical Assessment
// ============================================

export type TemplateTypeValue =
  | "pregnancy"
  | "fever-flu"
  | "back-pain"
  | "fitness"
  | "general"
  | "custom";

export type RestDurationValue =
  | "1-day"
  | "2-days"
  | "3-days"
  | "4-days"
  | "5-days"
  | "6-days"
  | "1-week"
  | "2-weeks"
  | "3-weeks"
  | "1-month"
  | "2-months"
  | "3-months"
  | "more-than-3-months"
  | "custom";

export interface PrescriptionItemData {
  medicineName: string;
  dosage: string;
  duration: string;
}

export interface FitnessChecklistFields {
  noHeadInjuryOrSeizures: boolean;
  noFluLikeSymptomsLast15Days: boolean;
  vitalSignsWithinNormalLimits: boolean;
  noGaitAbnormalities: boolean;
  noPsychopathology: boolean;
  noChronicMedicalIllness: boolean;
}

export interface MedicalAssessmentFormData {
  templateType: TemplateTypeValue;
  complaintsOf: string;
  durationOfComplaints: string;
  comorbidities: string;
  courseOfIllness: string;
  severityOfIllness: string;
  fullDiagnosisOfIllness: string;
  adviceByRegisteredMedicalPractitioner: string;
  restPeriodFrom: string;
  restDuration: RestDurationValue;
  restPeriodTo: string;
  prescription: PrescriptionItemData[];
  additionalRecommendations?: string;
  // History fields (boolean + conditional details)
  pastHistoryOfSimilarComplaints: boolean;
  pastHistoryDetails?: string;
  anySubstanceIntake: boolean;
  substanceIntakeDetails?: string;
  anySignificantPastHistoryOfDisease: boolean;
  significantPastHistoryDetails?: string;
  anyHistoryOfSurgery: boolean;
  surgeryHistoryDetails?: string;
  historyOfTravel: boolean;
  travelHistoryDetails?: string;
  familyHistoryOfSuchIllness: boolean;
  familyHistoryDetails?: string;
  // Treatment fields
  tookAllopathicHomeopathicAyurvedicMedicine: boolean;
  medicineDetails?: string;
  tookSelfHelpAndUsedHomeRemedies: boolean;
  homeRemediesDetails?: string;
  anyEmergencyMedicineTreatmentTaken: boolean;
  emergencyTreatmentDetails?: string;
  anyCastBandageCreamApplied: boolean;
  castBandageDetails?: string;
  // Vital signs
  vitalSigns?: VitalSigns;
  // Fitness specific
  fitnessChecklist?: FitnessChecklistFields;
}

export interface ApplicationDetailData {
  id: string;
  applicationId: string;
  applicationDisplayId: string;
  certificateType: CertificateType;
  certificateNumber: string | null;
  status: ApplicationStatus;
  formData: Record<string, unknown>;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string | null;
  };
  assignedDoctor: {
    id: string;
    fullName: string;
    specialization: string;
  } | null;
  assignedAt: string | null;
  consultationDate: string | null;
  consultationNotes: string | null;
  consultationCompleted: boolean;
  hasMedicalAssessment: boolean;
  medicalAssessment: MedicalAssessment | null;
  documents: Document[];
  remarks: Remark[];
  prescription: Prescription | null;
  paymentCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationCompleteData {
  consultationNotes: string;
}

export interface RemarkFormData {
  message: string;
}

export interface RescheduleData {
  consultationDate: string;
}

// ─── Phase 6b: Admin Payments, Transactions & Payment Fix ───

export interface DoctorPayout {
  id: string;
  doctorId: string;
  applicationId: string;
  amount: number;
  status: string;
  createdAt: string;
  processedAt?: string | null;
  doctor?: { fullName: string; email: string };
  application?: { certificateType: string };
}

export interface PaymentWithRelations extends Payment {
  user: { fullName: string; phoneNumber: string; email?: string | null };
  application: { id: string; certificateType: string; status: string };
}

export interface PaymentOverviewData {
  stats: {
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    todayRevenue: number;
    totalTransactions: number;
    completedPayments: number;
    failedPayments: number;
    refundedPayments: number;
    pendingWithdrawals: number;
    totalDoctorPayouts: number;
    averageOrderValue: number;
    revenueGrowth: number;
  };
  recentPayments: PaymentWithRelations[];
  revenueChart: { date: string; amount: number }[];
}

export interface AdminWithdrawalData {
  id: string;
  doctorId: string;
  amount: number;
  status: string;
  bankDetails?: BankDetails | null;
  processedBy?: string | null;
  requestedAt: string;
  processedAt?: string | null;
  doctor: {
    fullName: string;
    email: string;
    wallet?: { balance: number; totalEarnings: number; totalWithdrawn: number } | null;
  };
}

export interface TransactionFilters {
  type?: TransactionType | "";
  status?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionsPageData {
  transactions: (Transaction & {
    userName?: string;
    doctorName?: string;
  })[];
  total: number;
  page: number;
  limit: number;
  stats: {
    totalAmount: number;
    paymentCount: number;
    refundCount: number;
    payoutCount: number;
    withdrawalCount: number;
  };
}

export interface PaymentFixItem {
  id: string;
  orderId?: string | null;
  paymentId?: string | null;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  user: { fullName: string; phoneNumber: string };
  application: { id: string; certificateType: string; status: string; paymentCompleted: boolean };
}

// Admin Settings
export interface AdminSettingsData {
  general: {
    siteName: string;
    supportEmail: string;
    supportPhone: string;
    maintenanceMode: boolean;
  };
  system: {
    language: string;
    certificateExpiryDays: number;
    autoAssignDoctors: boolean;
    manualApproval: boolean;
  };
  certificates: {
    sickLeaveEnabled: boolean;
    medicalForm1aEnabled: boolean;
    fitnessCertEnabled: boolean;
    sickLeaveFee: number;
    medicalForm1aFee: number;
    fitnessCertFee: number;
  };
  payment: {
    razorpayKeyId: string;
    razorpayKeySecret: string;
    sickLeaveFee: number;
    fitnessFee: number;
    doctorPayoutPercentage: number;
  };
  whatsapp: {
    apiEndpoint: string;
    apiKey: string;
    defaultCountryCode: string;
    enabled: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    whatsappEnabled: boolean;
  };
}

// ============================================
// Phase 6c — WhatsApp Chat & Settings Types
// ============================================

export interface WhatsAppConversation {
  phoneNumber: string;
  userName?: string;
  userId?: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: WhatsAppMessage[];
}

export interface WhatsAppChatPageData {
  conversations: WhatsAppConversation[];
  templates: WhatsAppTemplate[];
}

export interface SendWhatsAppPayload {
  phoneNumber: string;
  message: string;
  templateName?: string;
  userId?: string;
  applicationId?: string;
}

// ============================================
// Phase 6d — Public Certificate Application & Payment
// ============================================

export type PaymentTierId =
  | "digital_no_prescription"
  | "digital_with_prescription"
  | "digital_express"
  | "handwritten_no_prescription"
  | "handwritten_with_prescription"
  | "handwritten_shipping_no_prescription"
  | "handwritten_shipping_with_prescription";

export type DocumentFormat = "digital" | "handwritten";

export type MedicalProblemValue =
  | "fever"
  | "cold"
  | "headache"
  | "body_pain"
  | "viral_fever"
  | "stomach_pain"
  | "back_pain"
  | "migraine"
  | "food_poisoning"
  | "other";

export type LeaveDurationValue =
  | "1_day"
  | "2_days"
  | "3_days"
  | "4_days"
  | "5_days"
  | "6_days"
  | "1_week"
  | "2_weeks"
  | "other";

export type GuardianRelationship =
  | "father"
  | "husband"
  | "mother"
  | "wife"
  | "son"
  | "daughter"
  | "other";

export type CaretakerRelationship = "parent" | "wife" | "husband" | "other";

export interface CertificateApplyFormData {
  // Step 0 — Certificate type
  certificateType: CertificateType;

  // Step 1 — Personal & Organization Details
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  otpVerified: boolean;
  guardianRelationship: GuardianRelationship | "";
  guardianName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  organizationName: string;
  organizationLocatedIn: "india" | "outside_india" | "";

  // Step 2 — Certificate Details (varies by type)
  // Group A: Sick leave / WFH / Unfit to Work / Unfit to Travel
  medicalProblem: MedicalProblemValue | "";
  medicalProblemOther: string;
  leaveDuration: LeaveDurationValue | "";
  leaveDurationOther: string;
  certificateStartDate: string;

  // Group B: Fitness / Recovery / Fit-to-Fly
  height: string;
  weight: string;
  bpPulseDeclaration: boolean;
  walkingVideoDeclaration: boolean;

  // Group C: Caretaker specific
  caretakerFirstName: string;
  caretakerLastName: string;
  caretakerDob: string;
  caretakerRelationship: CaretakerRelationship | "";
  caretakerStreet: string;
  caretakerCity: string;
  caretakerState: string;
  caretakerPostalCode: string;
  caretakerCountry: string;
  caretakerGovtIdUrl: string;

  // Travel-related (kept for unfit_to_travel / fit_to_fly)
  travelDate: string;
  travelDestination: string;

  // Common: Payment & Document section
  govtIdProofUrl: string;
  specialFormatAttestation: boolean;
  specialFormatFileUrl: string;
  documentFormat: DocumentFormat | "";
  paymentTier: PaymentTierId | "";
  termsAccepted: boolean;
  totalAmount: number;
}

export interface DocumentUploadData {
  idProof?: File | null;
  photo?: File | null;
  walkingVideo?: File | null;
  additionalDocs?: File[];
}

export interface CouponValidation {
  valid: boolean;
  couponCode: string;
  discountType: string;
  discountValue: number;
  originalAmount: number;
  discountedAmount: number;
  message: string;
}

export interface RazorpayOrderData {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  applicationId: string;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ============================================
// Phase 7 — Functional Gap Closure
// ============================================

export interface UserNotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminReviewItem {
  id: string;
  title: string;
  message: string;
  rating: number;
  date: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContactMessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SampleCertificateItem {
  id: string;
  certificateType: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
