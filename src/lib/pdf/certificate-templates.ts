/**
 * PDF Certificate Generation Utility
 * 
 * Client-side PDF generation using browser canvas + printable HTML.
 * No external PDF library dependency required.
 * 
 * For production, consider @react-pdf/renderer or puppeteer for server-side generation.
 */

export interface CertificateData {
  certificateNumber: string;
  certificateType: string;
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  patientPhone?: string;
  doctorName: string;
  doctorRegistrationNumber: string;
  doctorSpecialization: string;
  diagnosis: string;
  restPeriodFrom: string;
  restPeriodTo: string;
  restDuration: string;
  additionalRecommendations?: string;
  issuedDate: string;
  verificationUrl: string;
}

const CERT_TYPE_TITLES: Record<string, string> = {
  sick_leave: "Sick Leave Medical Certificate",
  fitness: "Fitness Medical Certificate",
  work_from_home: "Work From Home Medical Certificate",
  caretaker: "Caretaker Medical Certificate",
  recovery: "Recovery Medical Certificate",
  fit_to_fly: "Fit-to-Fly Medical Certificate",
  unfit_to_work: "Unfit To Work Medical Certificate",
  unfit_to_travel: "Unfit To Travel Medical Certificate",
  medical_diagnosis: "Medical Diagnosis Certificate",
};

/**
 * Generate a printable HTML certificate and trigger print/save as PDF
 */
export function generateCertificatePDF(data: CertificateData): void {
  const title = CERT_TYPE_TITLES[data.certificateType] || "Medical Certificate";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title} - ${data.certificateNumber}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; }
        .certificate { max-width: 700px; margin: 0 auto; padding: 40px; }
        .header { text-align: center; border-bottom: 3px double #2563eb; padding-bottom: 20px; margin-bottom: 24px; }
        .header h1 { font-size: 24px; color: #1e40af; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
        .header .subtitle { font-size: 12px; color: #6b7280; margin-top: 4px; letter-spacing: 1px; }
        .cert-number { text-align: right; font-size: 12px; color: #6b7280; margin-bottom: 16px; }
        .cert-number strong { color: #1a1a1a; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 13px; font-weight: bold; color: #1e40af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        .field { display: flex; margin-bottom: 6px; }
        .field-label { font-weight: bold; min-width: 200px; color: #374151; }
        .field-value { flex: 1; }
        .diagnosis { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px; margin-top: 8px; font-style: italic; }
        .rest-period { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 12px; margin-top: 8px; text-align: center; }
        .rest-period strong { font-size: 16px; color: #1e40af; }
        .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        .signature-block { display: flex; justify-content: space-between; margin-top: 40px; }
        .signature { text-align: center; min-width: 200px; }
        .signature-line { border-top: 1px solid #1a1a1a; margin-bottom: 4px; }
        .signature-name { font-weight: bold; }
        .signature-details { font-size: 11px; color: #6b7280; }
        .verification { text-align: center; margin-top: 24px; padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; font-size: 11px; }
        .verification strong { color: #166534; }
        .disclaimer { text-align: center; margin-top: 16px; font-size: 10px; color: #9ca3af; font-style: italic; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .certificate { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <h1>${title}</h1>
          <div class="subtitle">MediProofDocs — Medical Certificate Management Platform</div>
        </div>

        <div class="cert-number">
          Certificate No: <strong>${data.certificateNumber}</strong><br>
          Date: <strong>${data.issuedDate}</strong>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="field">
            <span class="field-label">Patient Name:</span>
            <span class="field-value">${data.patientName}</span>
          </div>
          ${data.patientAge ? `<div class="field"><span class="field-label">Age:</span><span class="field-value">${data.patientAge}</span></div>` : ""}
          ${data.patientGender ? `<div class="field"><span class="field-label">Gender:</span><span class="field-value">${data.patientGender}</span></div>` : ""}
          ${data.patientPhone ? `<div class="field"><span class="field-label">Contact:</span><span class="field-value">${data.patientPhone}</span></div>` : ""}
        </div>

        <div class="section">
          <div class="section-title">Medical Assessment</div>
          <div class="diagnosis">${data.diagnosis}</div>
        </div>

        <div class="section">
          <div class="section-title">Rest Period</div>
          <div class="rest-period">
            <strong>${data.restPeriodFrom} — ${data.restPeriodTo}</strong><br>
            Duration: ${data.restDuration}
          </div>
        </div>

        ${data.additionalRecommendations ? `
        <div class="section">
          <div class="section-title">Additional Recommendations</div>
          <p>${data.additionalRecommendations}</p>
        </div>
        ` : ""}

        <div class="footer">
          <div class="signature-block">
            <div class="signature">
              <div class="signature-line">&nbsp;</div>
              <div class="signature-name">${data.doctorName}</div>
              <div class="signature-details">
                Reg. No: ${data.doctorRegistrationNumber}<br>
                ${data.doctorSpecialization}
              </div>
            </div>
            <div class="signature">
              <div class="signature-line">&nbsp;</div>
              <div class="signature-details">Date & Seal</div>
            </div>
          </div>
        </div>

        <div class="verification">
          <strong>Certificate Verification</strong><br>
          This certificate can be verified at:<br>
          <a href="${data.verificationUrl}">${data.verificationUrl}</a>
        </div>

        <div class="disclaimer">
          This is a digitally generated medical certificate. The authenticity can be verified using the certificate number above.
        </div>
      </div>
    </body>
    </html>
  `;

  // Open print dialog in a new window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Wait for styles to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
