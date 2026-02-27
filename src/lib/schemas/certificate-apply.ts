import { z } from "zod";

// ============================================
// Step 1 — Personal & Organization Details
// ============================================

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  phoneNumber: z
    .string()
    .min(10, "Valid phone number is required")
    .max(15),
  otpVerified: z.literal(true, "Phone verification is required"),
  guardianRelationship: z.enum(
    ["father", "husband", "mother", "wife", "son", "daughter", "other"],
    { error: "Guardian relationship is required" }
  ),
  guardianName: z.string().min(1, "Guardian's name is required").max(100),
  email: z.string().email("Valid email is required"),
  gender: z.enum(["male", "female", "other"], {
    error: "Gender is required",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  street: z.string().min(1, "Street address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(10),
  country: z.string().min(1, "Country is required"),
  organizationName: z.string().min(1, "Organization name is required").max(200),
  organizationLocatedIn: z.enum(["india", "outside_india"], {
    error: "Organization location is required",
  }),
});

// ============================================
// Step 2 — Certificate Details (varies by cert group)
// ============================================

// Group A: Sick Leave, WFH, Unfit to Work, Unfit to Travel
export const groupADetailsSchema = z.object({
  medicalProblem: z.string().min(1, "Medical problem is required"),
  medicalProblemOther: z.string().optional(),
  leaveDuration: z.string().min(1, "Leave duration is required"),
  leaveDurationOther: z.string().optional(),
  certificateStartDate: z.string().min(1, "Certificate start date is required"),
}).refine(
  (data) => {
    if (data.medicalProblem === "other") {
      return !!data.medicalProblemOther && data.medicalProblemOther.length > 0;
    }
    return true;
  },
  { message: "Please describe your medical problem", path: ["medicalProblemOther"] }
).refine(
  (data) => {
    if (data.leaveDuration === "other") {
      return !!data.leaveDurationOther && data.leaveDurationOther.length > 0;
    }
    return true;
  },
  { message: "Please specify the duration", path: ["leaveDurationOther"] }
);

// Group B: Fitness, Recovery, Fit-to-Fly
export const groupBDetailsSchema = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  bpPulseDeclaration: z.literal(true, "BP/pulse photo declaration is required"),
  walkingVideoDeclaration: z.literal(true, "Walking video declaration is required"),
});

// Group C: Caretaker (includes Group A medical fields + caretaker fields)
export const caretakerDetailsSchema = z.object({
  medicalProblem: z.string().min(1, "Medical problem is required"),
  medicalProblemOther: z.string().optional(),
  leaveDuration: z.string().min(1, "Leave duration is required"),
  leaveDurationOther: z.string().optional(),
  certificateStartDate: z.string().min(1, "Certificate start date is required"),
  caretakerFirstName: z.string().min(1, "Caretaker first name is required").max(100),
  caretakerLastName: z.string().min(1, "Caretaker last name is required").max(100),
  caretakerDob: z.string().min(1, "Caretaker date of birth is required"),
  caretakerRelationship: z.enum(["parent", "wife", "husband", "other"], {
    error: "Caretaker relationship is required",
  }),
  caretakerStreet: z.string().min(1, "Caretaker address is required").max(500),
  caretakerCity: z.string().min(1, "Caretaker city is required").max(100),
  caretakerState: z.string().min(1, "Caretaker state is required").max(100),
  caretakerPostalCode: z.string().min(1, "Caretaker postal code is required").max(10),
  caretakerCountry: z.string().min(1, "Caretaker country is required"),
  caretakerGovtIdUrl: z.string().min(1, "Caretaker govt ID is required"),
});

// Group D: Medical Diagnosis (minimal)
export const groupDDetailsSchema = z.object({
  certificateStartDate: z.string().min(1, "Certificate start date is required"),
});

// ============================================
// Payment Section (common to all groups)
// ============================================

export const paymentSectionSchema = z.object({
  govtIdProofUrl: z.string().min(1, "Government ID proof is required"),
  documentFormat: z.enum(["digital", "handwritten"], {
    error: "Document format is required",
  }),
  paymentTier: z.string().min(1, "Payment tier is required"),
  termsAccepted: z.literal(true, "You must accept the terms & conditions"),
  specialFormatAttestation: z.boolean(),
  specialFormatFileUrl: z.string().optional(),
}).refine(
  (data) => {
    if (data.specialFormatAttestation) {
      return !!data.specialFormatFileUrl && data.specialFormatFileUrl.length > 0;
    }
    return true;
  },
  { message: "Special format file is required when attestation is selected", path: ["specialFormatFileUrl"] }
);

// ============================================
// Server-side validation (full form)
// ============================================

export const serverApplySchema = z.object({
  certificateType: z.enum([
    "sick_leave", "fitness", "work_from_home", "caretaker",
    "recovery", "fit_to_fly", "unfit_to_work", "unfit_to_travel", "medical_diagnosis",
  ]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  email: z.string().email(),
  gender: z.string().min(1),
  dateOfBirth: z.string().min(1),
  guardianRelationship: z.string().min(1),
  guardianName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  organizationName: z.string().min(1),
  organizationLocatedIn: z.enum(["india", "outside_india"]),
  govtIdProofUrl: z.string().min(1),
  documentFormat: z.enum(["digital", "handwritten"]),
  paymentTier: z.string().min(1),
  termsAccepted: z.literal(true),
  specialFormatAttestation: z.boolean(),
  totalAmount: z.number().min(0),
});
