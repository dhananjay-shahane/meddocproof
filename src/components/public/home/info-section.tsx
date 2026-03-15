"use client";

import { FadeIn, SectionReveal } from "@/components/ui/fade-in";
import { GridPattern } from "@/components/ui/grid-pattern";

export function InfoSection() {
  return (
    <section className="py-14 lg:py-20 xl:py-24 bg-background relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className="opacity-[0.03]"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Title */}
        <SectionReveal blur={true} scale={true}>
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">
              Get a Medical Certificate Online — Everything You Need to Know
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              मेडिकल सर्टिफिकेट के बारे में पूरी जानकारी | Medical Certificates Online in India
            </p>
          </div>
        </SectionReveal>

        <div className="max-w-4xl mx-auto space-y-10">
          {/* Section 1: What is a Medical Certificate */}
          <FadeIn direction="up">
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-primary">
                1. What is a Medical Certificate?
              </h3>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  A medical certificate (also referred to as a doctor certificate or doctor medical certificate) — is an official document issued by a Registered Medical Practitioner (RMP) that certifies a patient&apos;s health condition based on a clinical examination. Under Indian law, it is only doctors registered with the National Medical Commission (NMC) or a State Medical Council under the NMC Act, 2019 who are authorized to issue valid medical certificates.
                </p>
                <p>
                  A medical certificate is different from a prescription or a medical report. A prescription outlines medicines and treatment plan. A medical report details diagnostic findings from tests and investigations. A medical certificate, by contrast, is a formal attestation of a patient&apos;s medical condition, whether they are unfit for duty, fit to resume work, fit to travel, or fit for a specific activity. It can serve many uses.
                </p>
                <p>
                  Today, you can get a medical certificate online through a legitimate telemedicine consultation with an NMC-registered doctor, without visiting a clinic. Under the Telemedicine Practice Guidelines by MCI, 2020, online doctor consultations carry the same validity as in-person ones, provided that appropriate records, including the doctor&apos;s name, signature, registration number, and clinic or hospital address are mentioned. This includes MCI-registered doctors as well.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Section 2: Uses of Medical Certificate */}
          <FadeIn direction="up" delay={0.1}>
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-primary">
                2. What Are the Uses of an Online Medical Certificate?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                An online medical certificate is more than just a document — it&apos;s a trusted proof of your health condition, so use by a licensed doctor without having to visit a clinic. Here&apos;s how it can help you:
              </p>

              <div className="space-y-4 mt-4">
                <h4 className="text-lg font-semibold text-foreground">
                  Common Uses of a Medical Certificate:
                </h4>
                <ul className="space-y-3 ml-1">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <span className="font-semibold text-foreground">Proof of Illness</span>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        If you&apos;re unable to attend work, school, or college due to illness, a medical certificate justifies your absence or improper performance during that time.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <span className="font-semibold text-foreground">Fitness to Resume Work or Travel</span>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        After recovery, a doctor can certify that you&apos;re fit to resume duties (at your job), attend classes, travel, or even participate in sports or physical activities.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <span className="font-semibold text-foreground">Medical History Summary</span>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        Some certificates define your diagnosis, treatment plan, and recovery status. This can be helpful for insurance claims or future health assessments.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <span className="font-semibold text-foreground">Caregiver or Dependent Support</span>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        You may need a certificate if you&apos;re someone taking care of a sick family member to request leave or support.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="text-lg font-semibold text-foreground">
                  Confidential & Legally Compliant
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  A medical certificate holds same legal and health information and is treated as a confidential document. It should only be shared with relevant authorities like employers, HR teams, or school administration.
                </p>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  To ensure trust and legal validity:
                </p>
                <ul className="space-y-2 ml-1 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>The certificate must be issued only after a proper medical evaluation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>It must display the doctor&apos;s name, signature, registration number, and clinic address.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Healthcare professionals must follow strict ethical and legal guidelines.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="text-lg font-semibold text-foreground">
                  Benefits of Getting a Certificate Online
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Thanks to telemedicine platforms like <span className="font-semibold text-primary">MedDocProof</span>, you can:
                </p>
                <ul className="space-y-2 ml-1 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Consult a licensed doctor from home to any location</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Receive your certificate digitally within minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Enjoy full privacy and document security</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Get format accepted by workplaces, schools, and official use</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Online certificates are fully valid when issued by a qualified doctor, provided they meet the standard format and data protection guidelines.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Section 3: Who should apply */}
          <FadeIn direction="up" delay={0.2}>
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-primary">
                3. Who should apply for a medical certificate and when?
              </h3>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  A medical certificate may be accessed by a variety of people, such as employees, employers, students, athletes, travelers, and caregivers. Employees may require a medical certificate as proof of illness or injury when an employer needs to take time off for medical reasons. Students may require a medical certificate to leave or excuse from classes or exams due to illness or injury. Professionals in sports may need medical clearance for stadium access or for pre-game medical checks requiring proof of their fitness. Athletes may also seek a certificate as part of sports registrations as proof of fitness required by their team or governing body. Caregivers can provide these documents confirming the illness or disability of a dependent.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Section 4: Who can issue */}
          <FadeIn direction="up" delay={0.3}>
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-primary">
                4. Who is authorized to issue a medical certificate?
              </h3>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  A medical certificate can be issued by a registered medical practitioner who has authorization marks a diagnosis with proper medical examination. The specific laws vary depending on the dialogue of the certificate and the jurisdiction in which it is being issued. In general, the registered medical practitioner must have a valid and current license. Online certifications is legal practice in their fields and state.
                </p>
                <p>
                  At <span className="font-semibold text-primary">MedDocProof</span>, all certificates are issued only after online consultation with a registered Indian medical practitioner, following telemedicine guidelines of India.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
