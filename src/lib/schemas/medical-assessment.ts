import { z } from "zod";

// ============================================
// Medical Assessment Zod Schema
// ============================================

export const templateTypeValues = [
  "pregnancy",
  "fever-flu",
  "back-pain",
  "fitness",
  "general",
  "custom",
] as const;

export const restDurationValues = [
  "1-day",
  "2-days",
  "3-days",
  "4-days",
  "5-days",
  "6-days",
  "1-week",
  "2-weeks",
  "3-weeks",
  "1-month",
  "2-months",
  "3-months",
  "more-than-3-months",
  "custom",
] as const;

export const courseOfIllnessValues = [
  "mild",
  "moderate",
  "severe",
  "progressive",
  "stable",
  "improving",
] as const;

export const severityOfIllnessValues = [
  "mild",
  "moderate",
  "severe",
] as const;

export const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  duration: z.string().min(1, "Duration is required"),
});

export const vitalSignsSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
});

export const fitnessChecklistSchema = z.object({
  noHeadInjuryOrSeizures: z.boolean().default(true),
  noFluLikeSymptomsLast15Days: z.boolean().default(true),
  vitalSignsWithinNormalLimits: z.boolean().default(true),
  noGaitAbnormalities: z.boolean().default(true),
  noPsychopathology: z.boolean().default(true),
  noChronicMedicalIllness: z.boolean().default(true),
});

export const medicalAssessmentSchema = z.object({
  templateType: z.enum(templateTypeValues),

  // Core clinical fields
  complaintsOf: z.string().min(1, "Complaints are required").max(500),
  durationOfComplaints: z.string().min(1, "Duration is required"),
  comorbidities: z.string().default("None"),
  courseOfIllness: z.string().min(1, "Course of illness is required"),
  severityOfIllness: z.string().min(1, "Severity is required"),
  fullDiagnosisOfIllness: z.string().min(1, "Diagnosis is required").max(1000),
  adviceByRegisteredMedicalPractitioner: z.string().min(1, "Advice is required"),

  // Rest period
  restPeriodFrom: z.string().min(1, "Rest start date is required"),
  restDuration: z.enum(restDurationValues),
  restPeriodTo: z.string().min(1, "Rest end date is required"),

  // Prescription
  prescription: z.array(prescriptionItemSchema).min(1, "At least one medication is required"),

  additionalRecommendations: z.string().max(1000).optional(),

  // History fields
  pastHistoryOfSimilarComplaints: z.boolean().default(false),
  pastHistoryDetails: z.string().optional(),
  anySubstanceIntake: z.boolean().default(false),
  substanceIntakeDetails: z.string().optional(),
  anySignificantPastHistoryOfDisease: z.boolean().default(false),
  significantPastHistoryDetails: z.string().optional(),
  anyHistoryOfSurgery: z.boolean().default(false),
  surgeryHistoryDetails: z.string().optional(),
  historyOfTravel: z.boolean().default(false),
  travelHistoryDetails: z.string().optional(),
  familyHistoryOfSuchIllness: z.boolean().default(false),
  familyHistoryDetails: z.string().optional(),

  // Treatment fields
  tookAllopathicHomeopathicAyurvedicMedicine: z.boolean().default(false),
  medicineDetails: z.string().optional(),
  tookSelfHelpAndUsedHomeRemedies: z.boolean().default(false),
  homeRemediesDetails: z.string().optional(),
  anyEmergencyMedicineTreatmentTaken: z.boolean().default(false),
  emergencyTreatmentDetails: z.string().optional(),
  anyCastBandageCreamApplied: z.boolean().default(false),
  castBandageDetails: z.string().optional(),

  // Vital signs
  vitalSigns: vitalSignsSchema.optional(),

  // Fitness checklist (conditional)
  fitnessChecklist: fitnessChecklistSchema.optional(),
});

export type MedicalAssessmentSchemaType = z.infer<typeof medicalAssessmentSchema>;

// ============================================
// Template Type Mapping (Prisma ↔ Zod)
// Prisma uses underscores (fever_flu), Zod uses hyphens (fever-flu)
// ============================================

const prismaToZodMap: Record<string, string> = {
  pregnancy: "pregnancy",
  fever_flu: "fever-flu",
  back_pain: "back-pain",
  fitness: "fitness",
  general: "general",
  custom: "custom",
};

const zodToPrismaMap: Record<string, string> = {
  pregnancy: "pregnancy",
  "fever-flu": "fever_flu",
  "back-pain": "back_pain",
  fitness: "fitness",
  general: "general",
  custom: "custom",
};

export function prismaTemplateTToZod(prismaValue: string): string {
  return prismaToZodMap[prismaValue] || prismaValue;
}

export function zodTemplateToPrisma(zodValue: string): string {
  return zodToPrismaMap[zodValue] || zodValue;
}

// Certificate type → template mapping
const certTypeToTemplateMap: Record<string, string> = {
  sick_leave: "general",
  fitness: "fitness",
  work_from_home: "general",
  caretaker: "general",
  recovery: "fitness",
  fit_to_fly: "fitness",
  unfit_to_work: "general",
  unfit_to_travel: "general",
  medical_diagnosis: "general",
};

export function certificateTypeToTemplate(certType: string): string {
  return certTypeToTemplateMap[certType] || "general";
}
