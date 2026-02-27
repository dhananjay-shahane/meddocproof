import { format, addDays, addWeeks, addMonths } from "date-fns";
import type { MedicalAssessmentFormData, PrescriptionItemData, TemplateTypeValue } from "@/types";

// ============================================
// Template Defaults — pre-filled form values for each template
// ============================================

const defaultPrescription: Record<string, PrescriptionItemData[]> = {
  pregnancy: [
    { medicineName: "Folic Acid", dosage: "5mg Once Daily", duration: "30 days" },
    { medicineName: "Iron Supplement", dosage: "Once Daily", duration: "30 days" },
  ],
  "fever-flu": [
    { medicineName: "Paracetamol", dosage: "500mg Thrice Daily", duration: "5 days" },
    { medicineName: "Cetirizine", dosage: "10mg Once Daily", duration: "5 days" },
    { medicineName: "Vitamin C", dosage: "500mg Once Daily", duration: "7 days" },
  ],
  "back-pain": [
    { medicineName: "Diclofenac", dosage: "50mg Twice Daily", duration: "5 days" },
    { medicineName: "Muscle Relaxant", dosage: "Once Daily", duration: "5 days" },
    { medicineName: "Calcium + Vitamin D", dosage: "Once Daily", duration: "15 days" },
  ],
  fitness: [
    { medicineName: "Multivitamin", dosage: "Once Daily", duration: "30 days" },
  ],
  general: [
    { medicineName: "Paracetamol", dosage: "500mg as needed", duration: "3 days" },
  ],
  custom: [
    { medicineName: "", dosage: "", duration: "" },
  ],
};

const baseDefaults: Omit<MedicalAssessmentFormData, "templateType" | "complaintsOf" | "fullDiagnosisOfIllness" | "prescription"> = {
  durationOfComplaints: "3 days",
  comorbidities: "None",
  courseOfIllness: "mild",
  severityOfIllness: "mild",
  adviceByRegisteredMedicalPractitioner: "Rest, adequate hydration, and prescribed medication.",
  restPeriodFrom: format(new Date(), "yyyy-MM-dd"),
  restDuration: "3-days" as const,
  restPeriodTo: format(addDays(new Date(), 3), "yyyy-MM-dd"),
  additionalRecommendations: "",
  // History booleans
  pastHistoryOfSimilarComplaints: false,
  anySubstanceIntake: false,
  anySignificantPastHistoryOfDisease: false,
  anyHistoryOfSurgery: false,
  historyOfTravel: false,
  familyHistoryOfSuchIllness: false,
  // Treatment booleans
  tookAllopathicHomeopathicAyurvedicMedicine: false,
  tookSelfHelpAndUsedHomeRemedies: false,
  anyEmergencyMedicineTreatmentTaken: false,
  anyCastBandageCreamApplied: false,
};

const templateSpecificDefaults: Record<TemplateTypeValue, Partial<MedicalAssessmentFormData>> = {
  pregnancy: {
    complaintsOf: "Morning sickness, nausea, and fatigue during pregnancy",
    fullDiagnosisOfIllness: "Normal pregnancy with mild morning sickness. Patient advised rest and nutritional supplements.",
    durationOfComplaints: "2 weeks",
    courseOfIllness: "stable",
    severityOfIllness: "mild",
    adviceByRegisteredMedicalPractitioner: "Adequate rest, balanced diet and nutritional supplements. Avoid strenuous activities.",
    restDuration: "1-week" as const,
  },
  "fever-flu": {
    complaintsOf: "Fever, body ache, running nose, and headache",
    fullDiagnosisOfIllness: "Acute upper respiratory tract infection with fever. Symptomatic treatment prescribed.",
    durationOfComplaints: "3 days",
    courseOfIllness: "mild",
    severityOfIllness: "moderate",
    adviceByRegisteredMedicalPractitioner: "Complete bed rest. Increase fluid intake. Take prescribed medications as directed.",
    restDuration: "3-days" as const,
  },
  "back-pain": {
    complaintsOf: "Lower back pain with restricted movement",
    fullDiagnosisOfIllness: "Acute lumbar strain / muscular back pain. Anti-inflammatory and muscle relaxant prescribed.",
    durationOfComplaints: "5 days",
    courseOfIllness: "moderate",
    severityOfIllness: "moderate",
    adviceByRegisteredMedicalPractitioner: "Avoid heavy lifting, prolonged sitting, and strenuous activities. Apply warm compresses.",
    restDuration: "5-days" as const,
  },
  fitness: {
    complaintsOf: "Medical examination for fitness certificate",
    fullDiagnosisOfIllness: "Applicant is medically fit. All vital signs within normal limits.",
    durationOfComplaints: "N/A",
    courseOfIllness: "stable",
    severityOfIllness: "mild",
    adviceByRegisteredMedicalPractitioner: "Maintain healthy lifestyle. Regular exercise and balanced diet recommended.",
    restDuration: "1-day" as const,
    vitalSigns: {
      height: "",
      weight: "",
      bmi: "",
      bloodPressure: "120/80",
      heartRate: "72",
      oxygenSaturation: "98",
    },
    fitnessChecklist: {
      noHeadInjuryOrSeizures: true,
      noFluLikeSymptomsLast15Days: true,
      vitalSignsWithinNormalLimits: true,
      noGaitAbnormalities: true,
      noPsychopathology: true,
      noChronicMedicalIllness: true,
    },
  },
  general: {
    complaintsOf: "General illness requiring medical rest",
    fullDiagnosisOfIllness: "Patient examined and found to require medical rest. Symptomatic treatment prescribed.",
    durationOfComplaints: "3 days",
    courseOfIllness: "mild",
    severityOfIllness: "mild",
    adviceByRegisteredMedicalPractitioner: "Complete bed rest and prescribed medication.",
    restDuration: "3-days" as const,
  },
  custom: {
    complaintsOf: "",
    fullDiagnosisOfIllness: "",
    durationOfComplaints: "",
    courseOfIllness: "",
    severityOfIllness: "",
    adviceByRegisteredMedicalPractitioner: "",
    restDuration: "1-day" as const,
  },
};

/**
 * Get complete default form values for a given template type.
 */
export function getTemplateDefaults(templateType: TemplateTypeValue): MedicalAssessmentFormData {
  const specific = templateSpecificDefaults[templateType] || {};
  const prescription = defaultPrescription[templateType] || defaultPrescription.general;

  const restFrom = format(new Date(), "yyyy-MM-dd");
  const restDuration = specific.restDuration || baseDefaults.restDuration;
  const restTo = calculateRestEndDate(restFrom, restDuration);

  return {
    ...baseDefaults,
    templateType,
    complaintsOf: "",
    fullDiagnosisOfIllness: "",
    prescription,
    ...specific,
    restPeriodFrom: restFrom,
    restDuration,
    restPeriodTo: restTo,
  };
}

/**
 * Calculate rest end date based on start date and duration string.
 */
export function calculateRestEndDate(fromDate: string, duration: string): string {
  const start = new Date(fromDate);
  if (isNaN(start.getTime())) return fromDate;

  switch (duration) {
    case "1-day":
      return format(addDays(start, 1), "yyyy-MM-dd");
    case "2-days":
      return format(addDays(start, 2), "yyyy-MM-dd");
    case "3-days":
      return format(addDays(start, 3), "yyyy-MM-dd");
    case "4-days":
      return format(addDays(start, 4), "yyyy-MM-dd");
    case "5-days":
      return format(addDays(start, 5), "yyyy-MM-dd");
    case "6-days":
      return format(addDays(start, 6), "yyyy-MM-dd");
    case "1-week":
      return format(addWeeks(start, 1), "yyyy-MM-dd");
    case "2-weeks":
      return format(addWeeks(start, 2), "yyyy-MM-dd");
    case "3-weeks":
      return format(addWeeks(start, 3), "yyyy-MM-dd");
    case "1-month":
      return format(addMonths(start, 1), "yyyy-MM-dd");
    case "2-months":
      return format(addMonths(start, 2), "yyyy-MM-dd");
    case "3-months":
      return format(addMonths(start, 3), "yyyy-MM-dd");
    case "more-than-3-months":
      return format(addMonths(start, 4), "yyyy-MM-dd");
    default:
      return format(addDays(start, 3), "yyyy-MM-dd");
  }
}

/**
 * Calculate BMI from height (cm) and weight (kg).
 */
export function calculateBMI(heightCm: string, weightKg: string): string {
  const h = parseFloat(heightCm);
  const w = parseFloat(weightKg);
  if (!h || !w || h <= 0 || w <= 0) return "";
  const heightM = h / 100;
  const bmi = w / (heightM * heightM);
  return bmi.toFixed(1);
}

/**
 * Map certificate type to the recommended template.
 */
export function getCertificateTypeTemplate(certType: string): TemplateTypeValue {
  const map: Record<string, TemplateTypeValue> = {
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
  return map[certType] || "general";
}
