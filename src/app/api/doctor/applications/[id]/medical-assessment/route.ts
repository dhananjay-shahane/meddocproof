import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";
import { medicalAssessmentSchema, zodTemplateToPrisma } from "@/lib/schemas/medical-assessment";
import type { TemplateType } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const doctorId = auth.doctorUser.id;

    // Verify application exists and is assigned to this doctor
    const application = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        assignedDoctorId: true,
        medicalAssessmentId: true,
        status: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    if (application.assignedDoctorId !== doctorId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = medicalAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Map template type from Zod (hyphens) to Prisma (underscores)
    const prismaTemplateType = zodTemplateToPrisma(data.templateType) as TemplateType;

    // Build vital signs JSON — use Prisma.JsonNull for null JSON fields
    const vitalSigns: Prisma.InputJsonValue | typeof Prisma.JsonNull = data.vitalSigns
      ? (JSON.parse(JSON.stringify(data.vitalSigns)) as Prisma.InputJsonValue)
      : Prisma.JsonNull;

    // Build prescription JSON
    const prescriptionJson: Prisma.InputJsonValue = data.prescription.map((p) => ({
      medicineName: p.medicineName,
      dosage: p.dosage,
      duration: p.duration,
    })) as unknown as Prisma.InputJsonValue;

    // Build medical assessment data
    const assessmentData = {
      templateType: prismaTemplateType,
      complaintsOf: data.complaintsOf,
      durationOfComplaints: data.durationOfComplaints,
      comorbidities: data.comorbidities,
      courseOfIllness: data.courseOfIllness,
      severityOfIllness: data.severityOfIllness,
      fullDiagnosisOfIllness: data.fullDiagnosisOfIllness,
      adviceByRegisteredMedicalPractitioner: data.adviceByRegisteredMedicalPractitioner,
      restPeriodFrom: new Date(data.restPeriodFrom),
      restDuration: data.restDuration,
      restPeriodTo: new Date(data.restPeriodTo),
      prescription: prescriptionJson,
      additionalRecommendations: data.additionalRecommendations || null,
      vitalSigns: vitalSigns,

      // History booleans + details
      pastHistoryOfSimilarComplaints: data.pastHistoryOfSimilarComplaints,
      pastHistoryDetails: data.pastHistoryDetails || null,
      anySubstanceIntake: data.anySubstanceIntake,
      substanceIntakeDetails: data.substanceIntakeDetails || null,
      anySignificantPastHistoryOfDisease: data.anySignificantPastHistoryOfDisease,
      significantPastHistoryDetails: data.significantPastHistoryDetails || null,
      anyHistoryOfSurgery: data.anyHistoryOfSurgery,
      surgeryHistoryDetails: data.surgeryHistoryDetails || null,
      historyOfTravel: data.historyOfTravel,
      travelHistoryDetails: data.travelHistoryDetails || null,
      familyHistoryOfSuchIllness: data.familyHistoryOfSuchIllness,
      familyHistoryDetails: data.familyHistoryDetails || null,

      // Treatment booleans + details
      tookAllopathicHomeopathicAyurvedicMedicine: data.tookAllopathicHomeopathicAyurvedicMedicine,
      medicineDetails: data.medicineDetails || null,
      tookSelfHelpAndUsedHomeRemedies: data.tookSelfHelpAndUsedHomeRemedies,
      homeRemediesDetails: data.homeRemediesDetails || null,
      anyEmergencyMedicineTreatmentTaken: data.anyEmergencyMedicineTreatmentTaken,
      emergencyTreatmentDetails: data.emergencyTreatmentDetails || null,
      anyCastBandageCreamApplied: data.anyCastBandageCreamApplied,
      castBandageDetails: data.castBandageDetails || null,

      // Fitness checklist fields
      ...(data.fitnessChecklist
        ? {
            noHeadInjuryOrSeizures: data.fitnessChecklist.noHeadInjuryOrSeizures,
            noFluLikeSymptomsLast15Days: data.fitnessChecklist.noFluLikeSymptomsLast15Days,
            vitalSignsWithinNormalLimits: data.fitnessChecklist.vitalSignsWithinNormalLimits,
            noGaitAbnormalities: data.fitnessChecklist.noGaitAbnormalities,
            noPsychopathology: data.fitnessChecklist.noPsychopathology,
            noChronicMedicalIllness: data.fitnessChecklist.noChronicMedicalIllness,
          }
        : {}),
    };

    let assessment;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaData = assessmentData as any;

    if (application.medicalAssessmentId) {
      // Update existing assessment
      assessment = await prisma.medicalAssessment.update({
        where: { id: application.medicalAssessmentId },
        data: prismaData,
      });
    } else {
      // Create new assessment and link to application
      assessment = await prisma.medicalAssessment.create({
        data: prismaData,
      });

      await prisma.application.update({
        where: { id },
        data: {
          medicalAssessmentId: assessment.id,
          hasMedicalAssessment: true,
          status: "under_review",
        },
      });
    }

    // Upsert Prescription record
    await prisma.prescription.upsert({
      where: { applicationId: id },
      create: {
        applicationId: id,
        medications: prescriptionJson,
        advice: data.adviceByRegisteredMedicalPractitioner,
      },
      update: {
        medications: prescriptionJson,
        advice: data.adviceByRegisteredMedicalPractitioner,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: assessment.id,
        templateType: assessment.templateType,
        createdAt: assessment.createdAt.toISOString(),
        updatedAt: assessment.updatedAt.toISOString(),
      },
      message: application.medicalAssessmentId
        ? "Medical assessment updated successfully"
        : "Medical assessment created successfully",
    });
  } catch (error) {
    console.error("Medical assessment save error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save medical assessment" },
      { status: 500 }
    );
  }
}
