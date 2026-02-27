"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { medicalAssessmentSchema } from "@/lib/schemas/medical-assessment";
import {
  getTemplateDefaults,
  calculateRestEndDate,
  calculateBMI,
  getCertificateTypeTemplate,
} from "@/lib/template-defaults";
import { restDurationValues, courseOfIllnessValues, severityOfIllnessValues } from "@/lib/schemas/medical-assessment";
import { PrescriptionBuilder } from "@/components/doctor/prescription-builder";
import type {
  MedicalAssessmentFormData,
  TemplateTypeValue,
  PrescriptionItemData,
  CertificateType,
} from "@/types";

interface MedicalAssessmentFormProps {
  certificateType: CertificateType;
  initialData?: MedicalAssessmentFormData | null;
  onSubmit: (data: MedicalAssessmentFormData) => Promise<boolean>;
  disabled?: boolean;
}

const templateLabels: Record<TemplateTypeValue, string> = {
  pregnancy: "Pregnancy",
  "fever-flu": "Fever / Flu",
  "back-pain": "Back Pain",
  fitness: "Fitness Certificate",
  general: "General / Sick Leave",
  custom: "Custom",
};

const durationLabels: Record<string, string> = {
  "1-day": "1 Day",
  "2-days": "2 Days",
  "3-days": "3 Days",
  "4-days": "4 Days",
  "5-days": "5 Days",
  "6-days": "6 Days",
  "1-week": "1 Week",
  "2-weeks": "2 Weeks",
  "3-weeks": "3 Weeks",
  "1-month": "1 Month",
  "2-months": "2 Months",
  "3-months": "3 Months",
  "more-than-3-months": "More than 3 Months",
  custom: "Custom",
};

// Collapsible section wrapper
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-accent/50"
      >
        {title}
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {open && <div className="border-t px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

// Boolean + conditional details field
function BooleanDetailField({
  label,
  checked,
  details,
  onCheckChange,
  onDetailsChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  details?: string;
  onCheckChange: (val: boolean) => void;
  onDetailsChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className="text-sm">{label}</span>
      </label>
      {checked && (
        <textarea
          value={details || ""}
          onChange={(e) => onDetailsChange(e.target.value)}
          disabled={disabled}
          placeholder="Please provide details..."
          rows={2}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
      )}
    </div>
  );
}

export function MedicalAssessmentForm({
  certificateType,
  initialData,
  onSubmit,
  disabled = false,
}: MedicalAssessmentFormProps) {
  const [saving, setSaving] = useState(false);

  const defaultTemplate = getCertificateTypeTemplate(certificateType);
  const defaults = initialData || getTemplateDefaults(defaultTemplate);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<MedicalAssessmentFormData>({
    resolver: zodResolver(medicalAssessmentSchema) as any,
    defaultValues: defaults,
  });

  const templateType = watch("templateType");
  const restPeriodFrom = watch("restPeriodFrom");
  const restDuration = watch("restDuration");
  const prescription = watch("prescription");

  // Watch vital signs for BMI auto-calc
  const vitalHeight = watch("vitalSigns.height");
  const vitalWeight = watch("vitalSigns.weight");

  // Watch booleans for conditional detail fields
  const pastHistory = watch("pastHistoryOfSimilarComplaints");
  const substanceIntake = watch("anySubstanceIntake");
  const significantPast = watch("anySignificantPastHistoryOfDisease");
  const surgery = watch("anyHistoryOfSurgery");
  const travel = watch("historyOfTravel");
  const familyHistory = watch("familyHistoryOfSuchIllness");
  const allopathic = watch("tookAllopathicHomeopathicAyurvedicMedicine");
  const selfHelp = watch("tookSelfHelpAndUsedHomeRemedies");
  const emergency = watch("anyEmergencyMedicineTreatmentTaken");
  const castBandage = watch("anyCastBandageCreamApplied");

  // When template changes, reset form with new template defaults
  const handleTemplateChange = useCallback(
    (newTemplate: TemplateTypeValue) => {
      const newDefaults = getTemplateDefaults(newTemplate);
      reset(newDefaults);
    },
    [reset]
  );

  // Auto-calculate rest end date when from/duration changes
  useEffect(() => {
    if (restPeriodFrom && restDuration && restDuration !== "custom") {
      const calculated = calculateRestEndDate(restPeriodFrom, restDuration);
      setValue("restPeriodTo", calculated);
    }
  }, [restPeriodFrom, restDuration, setValue]);

  // Auto-calculate BMI
  useEffect(() => {
    if (vitalHeight && vitalWeight) {
      const bmi = calculateBMI(vitalHeight, vitalWeight);
      if (bmi) {
        setValue("vitalSigns.bmi", bmi);
      }
    }
  }, [vitalHeight, vitalWeight, setValue]);

  const handlePrescriptionChange = (items: PrescriptionItemData[]) => {
    setValue("prescription", items, { shouldValidate: true });
  };

  const onFormSubmit = async (data: MedicalAssessmentFormData) => {
    setSaving(true);
    try {
      await onSubmit(data);
    } finally {
      setSaving(false);
    }
  };

  const isFitness = templateType === "fitness";

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Template selector */}
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <Stethoscope className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">
            Assessment Template
          </label>
          <select
            value={templateType}
            onChange={(e) =>
              handleTemplateChange(e.target.value as TemplateTypeValue)
            }
            disabled={disabled}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {Object.entries(templateLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 text-red-600" />
          <div className="text-sm text-red-700">
            Please fix the highlighted errors before submitting.
          </div>
        </div>
      )}

      {/* Section 1: Complaints & Clinical Info */}
      <Section title="Complaints & Clinical Information" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Complaints Of *
            </label>
            <textarea
              {...register("complaintsOf")}
              disabled={disabled}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
            {errors.complaintsOf && (
              <p className="mt-1 text-xs text-red-500">
                {errors.complaintsOf.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Duration of Complaints *
              </label>
              <input
                type="text"
                {...register("durationOfComplaints")}
                disabled={disabled}
                placeholder="e.g. 3 days"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Comorbidities
              </label>
              <input
                type="text"
                {...register("comorbidities")}
                disabled={disabled}
                placeholder="None"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Course of Illness *
              </label>
              <select
                {...register("courseOfIllness")}
                disabled={disabled}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Select...</option>
                {courseOfIllnessValues.map((v) => (
                  <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Severity of Illness *
              </label>
              <select
                {...register("severityOfIllness")}
                disabled={disabled}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Select...</option>
                {severityOfIllnessValues.map((v) => (
                  <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: Diagnosis */}
      <Section title="Diagnosis & Advice" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Diagnosis of Illness *
            </label>
            <textarea
              {...register("fullDiagnosisOfIllness")}
              disabled={disabled}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
            {errors.fullDiagnosisOfIllness && (
              <p className="mt-1 text-xs text-red-500">
                {errors.fullDiagnosisOfIllness.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Advice by Registered Medical Practitioner *
            </label>
            <textarea
              {...register("adviceByRegisteredMedicalPractitioner")}
              disabled={disabled}
              rows={2}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Additional Recommendations
            </label>
            <textarea
              {...register("additionalRecommendations")}
              disabled={disabled}
              rows={2}
              placeholder="Optional additional recommendations..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>
      </Section>

      {/* Section 3: Prescription */}
      <Section title="Prescription" defaultOpen={true}>
        <PrescriptionBuilder
          items={prescription || []}
          onChange={handlePrescriptionChange}
          disabled={disabled}
        />
        {errors.prescription && (
          <p className="mt-2 text-xs text-red-500">
            At least one medication is required
          </p>
        )}
      </Section>

      {/* Section 4: Rest Period */}
      <Section title="Rest Period" defaultOpen={true}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Rest From *
            </label>
            <input
              type="date"
              {...register("restPeriodFrom")}
              disabled={disabled}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Duration *
            </label>
            <select
              {...register("restDuration")}
              disabled={disabled}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {restDurationValues.map((v) => (
                <option key={v} value={v}>
                  {durationLabels[v] || v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Rest To *
            </label>
            <input
              type="date"
              {...register("restPeriodTo")}
              disabled={disabled}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>
      </Section>

      {/* Section 5: Vital Signs (shown for fitness and optionally others) */}
      <Section
        title="Vital Signs"
        defaultOpen={isFitness}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Height (cm)
            </label>
            <input
              type="text"
              {...register("vitalSigns.height")}
              disabled={disabled}
              placeholder="e.g. 170"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Weight (kg)
            </label>
            <input
              type="text"
              {...register("vitalSigns.weight")}
              disabled={disabled}
              placeholder="e.g. 70"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              BMI (auto-calculated)
            </label>
            <input
              type="text"
              {...register("vitalSigns.bmi")}
              disabled
              className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Blood Pressure
            </label>
            <input
              type="text"
              {...register("vitalSigns.bloodPressure")}
              disabled={disabled}
              placeholder="e.g. 120/80"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Heart Rate (bpm)
            </label>
            <input
              type="text"
              {...register("vitalSigns.heartRate")}
              disabled={disabled}
              placeholder="e.g. 72"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Oxygen Saturation (%)
            </label>
            <input
              type="text"
              {...register("vitalSigns.oxygenSaturation")}
              disabled={disabled}
              placeholder="e.g. 98"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>
      </Section>

      {/* Section 6: Medical History */}
      <Section title="Medical History" defaultOpen={false}>
        <div className="space-y-4">
          <BooleanDetailField
            label="Past history of similar complaints"
            checked={pastHistory}
            details={watch("pastHistoryDetails")}
            onCheckChange={(v) => setValue("pastHistoryOfSimilarComplaints", v)}
            onDetailsChange={(v) => setValue("pastHistoryDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Any substance intake"
            checked={substanceIntake}
            details={watch("substanceIntakeDetails")}
            onCheckChange={(v) => setValue("anySubstanceIntake", v)}
            onDetailsChange={(v) => setValue("substanceIntakeDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Any significant past history of disease"
            checked={significantPast}
            details={watch("significantPastHistoryDetails")}
            onCheckChange={(v) => setValue("anySignificantPastHistoryOfDisease", v)}
            onDetailsChange={(v) => setValue("significantPastHistoryDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Any history of surgery"
            checked={surgery}
            details={watch("surgeryHistoryDetails")}
            onCheckChange={(v) => setValue("anyHistoryOfSurgery", v)}
            onDetailsChange={(v) => setValue("surgeryHistoryDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="History of travel"
            checked={travel}
            details={watch("travelHistoryDetails")}
            onCheckChange={(v) => setValue("historyOfTravel", v)}
            onDetailsChange={(v) => setValue("travelHistoryDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Family history of such illness"
            checked={familyHistory}
            details={watch("familyHistoryDetails")}
            onCheckChange={(v) => setValue("familyHistoryOfSuchIllness", v)}
            onDetailsChange={(v) => setValue("familyHistoryDetails", v)}
            disabled={disabled}
          />
        </div>
      </Section>

      {/* Section 7: Treatment History */}
      <Section title="Treatment History" defaultOpen={false}>
        <div className="space-y-4">
          <BooleanDetailField
            label="Took allopathic / homeopathic / ayurvedic medicine"
            checked={allopathic}
            details={watch("medicineDetails")}
            onCheckChange={(v) => setValue("tookAllopathicHomeopathicAyurvedicMedicine", v)}
            onDetailsChange={(v) => setValue("medicineDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Took self help and used home remedies"
            checked={selfHelp}
            details={watch("homeRemediesDetails")}
            onCheckChange={(v) => setValue("tookSelfHelpAndUsedHomeRemedies", v)}
            onDetailsChange={(v) => setValue("homeRemediesDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Any emergency medicine / treatment taken"
            checked={emergency}
            details={watch("emergencyTreatmentDetails")}
            onCheckChange={(v) => setValue("anyEmergencyMedicineTreatmentTaken", v)}
            onDetailsChange={(v) => setValue("emergencyTreatmentDetails", v)}
            disabled={disabled}
          />
          <BooleanDetailField
            label="Any cast / bandage / cream applied"
            checked={castBandage}
            details={watch("castBandageDetails")}
            onCheckChange={(v) => setValue("anyCastBandageCreamApplied", v)}
            onDetailsChange={(v) => setValue("castBandageDetails", v)}
            disabled={disabled}
          />
        </div>
      </Section>

      {/* Section 9: Fitness Checklist (only for fitness template) */}
      {isFitness && (
        <Section title="Fitness Checklist" defaultOpen={true}>
          <div className="space-y-3">
            {[
              {
                field: "fitnessChecklist.noHeadInjuryOrSeizures" as const,
                label: "No head injury or seizures",
              },
              {
                field: "fitnessChecklist.noFluLikeSymptomsLast15Days" as const,
                label: "No flu-like symptoms in last 15 days",
              },
              {
                field: "fitnessChecklist.vitalSignsWithinNormalLimits" as const,
                label: "Vital signs within normal limits",
              },
              {
                field: "fitnessChecklist.noGaitAbnormalities" as const,
                label: "No gait abnormalities",
              },
              {
                field: "fitnessChecklist.noPsychopathology" as const,
                label: "No psychopathology",
              },
              {
                field: "fitnessChecklist.noChronicMedicalIllness" as const,
                label: "No chronic medical illness",
              },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(field)}
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Submit button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={disabled || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving
            ? "Saving..."
            : initialData
              ? "Update Assessment"
              : "Save Assessment"}
        </button>
      </div>
    </form>
  );
}
