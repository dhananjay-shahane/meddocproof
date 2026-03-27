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
  Baby,
  Thermometer,
  Activity,
  Heart,
  FileText,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { medicalAssessmentSchema } from "@/lib/schemas/medical-assessment";
import {
  getTemplateDefaults,
  calculateRestEndDate,
  calculateBMI,
  getCertificateTypeTemplate,
} from "@/lib/template-defaults";
import { restDurationValues, courseOfIllnessValues, severityOfIllnessValues } from "@/lib/schemas/medical-assessment";
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
  onCancel?: () => void;
  disabled?: boolean;
}

const templateConfig: { value: TemplateTypeValue; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "pregnancy", label: "Pregnancy", icon: <Baby className="h-5 w-5" />, color: "text-pink-500" },
  { value: "fever-flu", label: "Fever Flu", icon: <Thermometer className="h-5 w-5" />, color: "text-orange-500" },
  { value: "back-pain", label: "Back Pain", icon: <Activity className="h-5 w-5" />, color: "text-blue-500" },
  { value: "fitness", label: "Fitness", icon: <Heart className="h-5 w-5" />, color: "text-green-500" },
  { value: "general", label: "General", icon: <FileText className="h-5 w-5" />, color: "text-purple-500" },
  { value: "custom", label: "Custom", icon: <Edit3 className="h-5 w-5" />, color: "text-gray-500" },
];

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

// Section header component
function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b pb-3 mb-4">
      {icon && <span className="text-primary">{icon}</span>}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
  );
}

// Yes/No Radio Field with conditional details
function YesNoField({
  label,
  value,
  details,
  onValueChange,
  onDetailsChange,
  disabled,
}: {
  label: string;
  value: boolean;
  details?: string;
  onValueChange: (val: boolean) => void;
  onDetailsChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={label.replace(/\s+/g, '-')}
              checked={value === true}
              onChange={() => onValueChange(true)}
              disabled={disabled}
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-green-600 font-medium">Yes</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={label.replace(/\s+/g, '-')}
              checked={value === false}
              onChange={() => onValueChange(false)}
              disabled={disabled}
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-red-600 font-medium">No</span>
          </label>
        </div>
      </div>
      {value && (
        <textarea
          value={details || ""}
          onChange={(e) => onDetailsChange(e.target.value)}
          disabled={disabled}
          placeholder="Please provide details..."
          rows={2}
          className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
      )}
    </div>
  );
}

export function MedicalAssessmentForm({
  certificateType,
  initialData,
  onSubmit,
  onCancel,
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
  } = useForm<MedicalAssessmentFormData>({
    resolver: zodResolver(medicalAssessmentSchema) as never,
    defaultValues: defaults,
  });

  const templateType = watch("templateType");
  const restPeriodFrom = watch("restPeriodFrom");
  const restDuration = watch("restDuration");
  const prescription = watch("prescription") || [];

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

  const isFitness = templateType === "fitness";

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

  const addPrescriptionItem = () => {
    const current = prescription || [];
    setValue("prescription", [...current, { medicineName: "", dosage: "", duration: "" }], { shouldValidate: true });
  };

  const removePrescriptionItem = (index: number) => {
    const current = prescription || [];
    if (current.length <= 1) return;
    setValue("prescription", current.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const updatePrescriptionItem = (index: number, field: keyof PrescriptionItemData, value: string) => {
    const current = prescription || [];
    const updated = current.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setValue("prescription", updated, { shouldValidate: true });
  };

  const onFormSubmit = async (data: MedicalAssessmentFormData) => {
    setSaving(true);
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      console.error("Medical assessment submission error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Template Selection */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Select Template</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Auto-selected based on certificate type
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {templateConfig.map((template) => (
            <button
              key={template.value}
              type="button"
              onClick={() => handleTemplateChange(template.value)}
              disabled={disabled}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:shadow-md disabled:opacity-50 ${
                templateType === template.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`${template.color}`}>{template.icon}</div>
              <span className="text-xs font-medium text-center">{template.label}</span>
            </button>
          ))}
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

      {/* Complaints & Clinical Information */}
      <div className="rounded-xl border bg-card p-5">
        <SectionHeader title="Complaints & Clinical Information" icon={<Stethoscope className="h-5 w-5" />} />
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Chief Complaint *</label>
            <textarea
              {...register("complaintsOf")}
              disabled={disabled}
              rows={3}
              placeholder="Describe the primary complaint..."
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            {errors.complaintsOf && (
              <p className="mt-1 text-xs text-red-500">{errors.complaintsOf.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Duration of Illness *</label>
              <input
                type="text"
                {...register("durationOfComplaints")}
                disabled={disabled}
                placeholder="e.g., 3 days"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Comorbidities</label>
              <input
                type="text"
                {...register("comorbidities")}
                disabled={disabled}
                placeholder="None"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Course of Illness *</label>
              <select
                {...register("courseOfIllness")}
                disabled={disabled}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                <option value="">Select...</option>
                {courseOfIllnessValues.map((v) => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Severity of Illness *</label>
              <select
                {...register("severityOfIllness")}
                disabled={disabled}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                <option value="">Select...</option>
                {severityOfIllnessValues.map((v) => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="rounded-xl border bg-card p-5">
        <SectionHeader title="Medical History" />
        <div className="space-y-1">
          <YesNoField
            label="Past history of similar complaints"
            value={pastHistory}
            details={watch("pastHistoryDetails")}
            onValueChange={(v) => setValue("pastHistoryOfSimilarComplaints", v)}
            onDetailsChange={(v) => setValue("pastHistoryDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Any substance intake"
            value={substanceIntake}
            details={watch("substanceIntakeDetails")}
            onValueChange={(v) => setValue("anySubstanceIntake", v)}
            onDetailsChange={(v) => setValue("substanceIntakeDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Any significant past history of disease"
            value={significantPast}
            details={watch("significantPastHistoryDetails")}
            onValueChange={(v) => setValue("anySignificantPastHistoryOfDisease", v)}
            onDetailsChange={(v) => setValue("significantPastHistoryDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Any history of surgery"
            value={surgery}
            details={watch("surgeryHistoryDetails")}
            onValueChange={(v) => setValue("anyHistoryOfSurgery", v)}
            onDetailsChange={(v) => setValue("surgeryHistoryDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="History of travel"
            value={travel}
            details={watch("travelHistoryDetails")}
            onValueChange={(v) => setValue("historyOfTravel", v)}
            onDetailsChange={(v) => setValue("travelHistoryDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Family history of such illness"
            value={familyHistory}
            details={watch("familyHistoryDetails")}
            onValueChange={(v) => setValue("familyHistoryOfSuchIllness", v)}
            onDetailsChange={(v) => setValue("familyHistoryDetails", v)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Treatment History */}
      <div className="rounded-xl border bg-card p-5">
        <SectionHeader title="Treatment History" />
        <div className="space-y-1">
          <YesNoField
            label="Took allopathic / homeopathic / ayurvedic medicine"
            value={allopathic}
            details={watch("medicineDetails")}
            onValueChange={(v) => setValue("tookAllopathicHomeopathicAyurvedicMedicine", v)}
            onDetailsChange={(v) => setValue("medicineDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Took self help and used home remedies"
            value={selfHelp}
            details={watch("homeRemediesDetails")}
            onValueChange={(v) => setValue("tookSelfHelpAndUsedHomeRemedies", v)}
            onDetailsChange={(v) => setValue("homeRemediesDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Any emergency medicine / treatment taken"
            value={emergency}
            details={watch("emergencyTreatmentDetails")}
            onValueChange={(v) => setValue("anyEmergencyMedicineTreatmentTaken", v)}
            onDetailsChange={(v) => setValue("emergencyTreatmentDetails", v)}
            disabled={disabled}
          />
          <YesNoField
            label="Any cast / bandage / cream applied"
            value={castBandage}
            details={watch("castBandageDetails")}
            onValueChange={(v) => setValue("anyCastBandageCreamApplied", v)}
            onDetailsChange={(v) => setValue("castBandageDetails", v)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Diagnosis */}
      <div className="rounded-xl border bg-card p-5">
        <SectionHeader title="Diagnosis" />
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Diagnosis *</label>
            <textarea
              {...register("fullDiagnosisOfIllness")}
              disabled={disabled}
              rows={3}
              placeholder="Enter detailed diagnosis..."
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            {errors.fullDiagnosisOfIllness && (
              <p className="mt-1 text-xs text-red-500">{errors.fullDiagnosisOfIllness.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Medical Advice *</label>
            <textarea
              {...register("adviceByRegisteredMedicalPractitioner")}
              disabled={disabled}
              rows={3}
              placeholder="Enter medical advice and recommendations..."
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Additional Recommendations</label>
            <textarea
              {...register("additionalRecommendations")}
              disabled={disabled}
              rows={2}
              placeholder="Optional additional recommendations..."
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-base font-semibold text-foreground">Prescription</h3>
          <button
            type="button"
            onClick={addPrescriptionItem}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Medicine
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine Name</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dosage</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</th>
                <th className="px-3 py-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(prescription || []).map((item, index) => (
                <tr key={index} className="hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.medicineName}
                      onChange={(e) => updatePrescriptionItem(index, "medicineName", e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., Paracetamol"
                      className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.dosage}
                      onChange={(e) => updatePrescriptionItem(index, "dosage", e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., 500mg Twice Daily"
                      className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.duration}
                      onChange={(e) => updatePrescriptionItem(index, "duration", e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., 5 days"
                      className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removePrescriptionItem(index)}
                      disabled={disabled || (prescription || []).length <= 1}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.prescription && (
          <p className="mt-2 text-xs text-red-500">At least one medication is required</p>
        )}
      </div>

      {/* Additional Information - Rest Period & Vital Signs */}
      <div className="rounded-xl border bg-card p-5">
        <SectionHeader title="Additional Information" />
        
        {/* Rest Period */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Rest Period</h4>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Rest From *</label>
              <input
                type="date"
                {...register("restPeriodFrom")}
                disabled={disabled}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Duration *</label>
              <select
                {...register("restDuration")}
                disabled={disabled}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                {restDurationValues.map((v) => (
                  <option key={v} value={v}>{durationLabels[v] || v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Rest To *</label>
              <input
                type="date"
                {...register("restPeriodTo")}
                disabled={disabled}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div>
          <h4 className="text-sm font-medium mb-3">Vital Signs {isFitness && <span className="text-red-500">*</span>}</h4>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Height (cm)</label>
              <input
                type="text"
                {...register("vitalSigns.height")}
                disabled={disabled}
                placeholder="170"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Weight (kg)</label>
              <input
                type="text"
                {...register("vitalSigns.weight")}
                disabled={disabled}
                placeholder="70"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">BMI</label>
              <input
                type="text"
                {...register("vitalSigns.bmi")}
                disabled
                className="w-full rounded-lg border bg-muted px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Blood Pressure</label>
              <input
                type="text"
                {...register("vitalSigns.bloodPressure")}
                disabled={disabled}
                placeholder="120/80"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Heart Rate (bpm)</label>
              <input
                type="text"
                {...register("vitalSigns.heartRate")}
                disabled={disabled}
                placeholder="72"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">O2 Saturation (%)</label>
              <input
                type="text"
                {...register("vitalSigns.oxygenSaturation")}
                disabled={disabled}
                placeholder="98"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Checklist (only for fitness template) */}
      {isFitness && (
        <div className="rounded-xl border bg-card p-5">
          <SectionHeader title="Fitness Checklist" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { field: "fitnessChecklist.noHeadInjuryOrSeizures" as const, label: "No head injury or seizures" },
              { field: "fitnessChecklist.noFluLikeSymptomsLast15Days" as const, label: "No flu-like symptoms in last 15 days" },
              { field: "fitnessChecklist.vitalSignsWithinNormalLimits" as const, label: "Vital signs within normal limits" },
              { field: "fitnessChecklist.noGaitAbnormalities" as const, label: "No gait abnormalities" },
              { field: "fitnessChecklist.noPsychopathology" as const, label: "No psychopathology" },
              { field: "fitnessChecklist.noChronicMedicalIllness" as const, label: "No chronic medical illness" },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-2 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(field)}
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={disabled || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : initialData ? "Update Assessment" : "Save Medical Assessment"}
        </button>
      </div>
    </form>
  );
}
