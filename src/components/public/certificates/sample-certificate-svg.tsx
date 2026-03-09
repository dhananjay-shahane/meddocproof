interface SampleCertificateSvgProps {
  sampleName: string;
  sampleSlug: string;
}

function getPreviewTitle(name: string): string {
  return name
    .replace(/medical certificate/i, "")
    .replace(/certificate/i, "")
    .trim()
    .toUpperCase();
}

export function SampleCertificateSvg({ sampleName, sampleSlug }: SampleCertificateSvgProps) {
  return (
    <div className="relative bg-white p-4 sm:p-6 md:p-7 flex items-stretch justify-center min-h-155">
      <div className="relative w-full h-full max-w-135">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden h-full flex flex-col p-2">
          <svg
            viewBox="0 0 600 850"
            className="w-full h-auto rounded"
            role="img"
            aria-label={`${sampleName} sample certificate`}
          >
            <defs>
              <linearGradient id={`cornerGlow-${sampleSlug}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5eb8e0" />
                <stop offset="100%" stopColor="#0d5a9e" />
              </linearGradient>
              <linearGradient id={`cornerGlowBottom-${sampleSlug}`} x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5eb8e0" />
                <stop offset="100%" stopColor="#0d5a9e" />
              </linearGradient>
            </defs>

            {/* Main border */}
            <rect x="8" y="8" width="584" height="834" fill="#ffffff" stroke="#0950a3" strokeWidth="8" />
            
            {/* Top right corner accent */}
            <polygon points="592,8 592,65 530,8" fill={`url(#cornerGlow-${sampleSlug})`} opacity="0.95" />
            
            {/* Bottom right corner accent */}
            <polygon points="592,842 592,785 530,842" fill={`url(#cornerGlowBottom-${sampleSlug})`} opacity="0.95" />

            {/* Caduceus Logo */}
            <g transform="translate(45, 25) scale(0.7)">
              {/* Wings */}
              <path d="M35 5 C25 5, 15 15, 15 25 C15 30, 18 35, 22 38 L18 42 C12 38, 8 32, 8 25 C8 10, 20 0, 35 0 C50 0, 62 10, 62 25 C62 32, 58 38, 52 42 L48 38 C52 35, 55 30, 55 25 C55 15, 45 5, 35 5 Z" fill="#c9a227" />
              {/* Staff */}
              <rect x="32" y="8" width="6" height="55" rx="3" fill="#c9a227" />
              {/* Top ball */}
              <circle cx="35" cy="6" r="5" fill="#c9a227" />
              {/* Bottom base */}
              <ellipse cx="35" cy="66" rx="8" ry="4" fill="#c9a227" />
              {/* Snakes */}
              <path d="M35 15 C45 15, 50 22, 50 28 C50 35, 42 38, 35 38 C28 38, 20 35, 20 28 C20 22, 25 15, 35 15" fill="none" stroke="#c9a227" strokeWidth="3" />
              <path d="M35 25 C42 25, 48 30, 48 36 C48 42, 42 46, 35 46 C28 46, 22 42, 22 36 C22 30, 28 25, 35 25" fill="none" stroke="#c9a227" strokeWidth="3" />
              <path d="M35 35 C40 35, 45 39, 45 44 C45 49, 40 52, 35 52 C30 52, 25 49, 25 44 C25 39, 30 35, 35 35" fill="none" stroke="#c9a227" strokeWidth="3" />
            </g>

            {/* Doctor Info - Right aligned */}
            <text x="550" y="40" textAnchor="end" fontSize="22" fontWeight="700" fill="#1a1a1a">DR. N SHRAVAN CHOUDARY</text>
            <text x="550" y="62" textAnchor="end" fontSize="16" fontWeight="700" fill="#1a1a1a">GENERAL PHYSICIAN</text>
            <text x="550" y="82" textAnchor="end" fontSize="13" fontWeight="600" fill="#333">Regd.No. TSMC/FMR/23430</text>

            {/* Tagline and Contact Info */}
            <text x="45" y="95" fontSize="11" fill="#666">Your Health, Our Promise</text>
            
            {/* Phone icon - simple receiver shape */}
            <g transform="translate(185, 88)">
              <path d="M3 2 C2 2, 1 3, 1 5 L1 9 C1 11, 2 12, 4 12 L8 12 C10 12, 11 11, 11 9 L11 5 C11 3, 10 2, 8 2 Z" fill="none" stroke="#c44569" strokeWidth="1.5"/>
              <path d="M3 2 C3 0, 9 0, 9 2" fill="none" stroke="#c44569" strokeWidth="1.5"/>
            </g>
            <text x="200" y="98" fontSize="11" fill="#555">+91-9052000669</text>
            
            {/* Email icon - simple envelope */}
            <g transform="translate(305, 88)">
              <rect x="0" y="2" width="14" height="10" rx="1" fill="none" stroke="#888" strokeWidth="1"/>
              <path d="M0 3 L7 8 L14 3" fill="none" stroke="#888" strokeWidth="1"/>
            </g>
            <text x="325" y="98" fontSize="11" fill="#555">Shravan@easymedicalcertificate.com</text>

            {/* Horizontal Line */}
            <line x1="20" y1="110" x2="580" y2="110" stroke="#111" strokeWidth="1.5" />

            {/* Certificate Title */}
            <text x="300" y="138" textAnchor="middle" fontSize="24" fontWeight="700" fill="#121212">{getPreviewTitle(sampleName)}</text>

            {/* Horizontal Line */}
            <line x1="20" y1="150" x2="580" y2="150" stroke="#111" strokeWidth="1.5" />

            {/* Issue Date and Cert Number */}
            <text x="30" y="175" fontSize="14" fontWeight="700" fill="#1a1a1a">ISSUE DATE: 12-09-2025</text>
            <text x="570" y="175" textAnchor="end" fontSize="14" fontWeight="700" fill="#1a1a1a">CERT-20255178</text>

            {/* TO Section */}
            <text x="30" y="205" fontSize="18" fontWeight="700" fill="#1a1a1a">TO,</text>
            <text x="30" y="225" fontSize="18" fontWeight="700" fill="#1a1a1a">HCLTech,</text>
            <text x="30" y="245" fontSize="18" fontWeight="700" fill="#1a1a1a">India.</text>

            {/* Certificate Body - Fixed with proper line breaks */}
            <text x="30" y="280" fontSize="14" fill="#1a1a1a">This is to certify that I, Dr. N. SHRAVAN CHOUDARY, after examining</text>
            <text x="30" y="298" fontSize="14" fill="#1a1a1a"><tspan fontWeight="700">Nitika Vohra</tspan> H/O Mr. Abhishek Pillai aged about 33 years, gender-</text>
            <text x="30" y="316" fontSize="14" fill="#1a1a1a">Female resident of Sector 73, Gurugram, Haryana-122101.(whose</text>
            <text x="30" y="334" fontSize="14" fill="#1a1a1a">signature is verified as under) has diagnosed the patient with</text>
            <text x="30" y="352" fontSize="14" fontWeight="700" fill="#1a1a1a">Fistula in Ano Posterior Anal Pile Mass Constipation.</text>

            {/* Treatment Period */}
            <text x="30" y="385" fontSize="14" fill="#1a1a1a">Diagnosis and treatment have been recommended starting from</text>
            <text x="30" y="403" fontSize="14" fill="#1a1a1a">12-09-2025 to 12-10-2025 aid in the restoration of the patient's</text>
            <text x="30" y="421" fontSize="14" fill="#1a1a1a">optimal health.</text>

            {/* Signature Section - Fixed Layout */}
            {/* Doctor Signature Line - positioned above */}
            <path d="M420 480 C435 465, 450 490, 465 475 C475 468, 485 475, 495 485" fill="none" stroke="#2d3e5f" strokeWidth="2" />
            
            {/* Patient Signature - Left Side */}
            <text x="30" y="510" fontSize="11" fill="#666">Patient's Signature</text>
            <text x="30" y="530" fontSize="16" fontWeight="700" fill="#1a1a1a">Ms.Nitika Vohra</text>
            <text x="30" y="548" fontSize="11" fill="#666">Patient's Name</text>

            {/* Doctor Info - Right Side */}
            <text x="570" y="530" textAnchor="end" fontSize="16" fontWeight="700" fill="#1a1a1a">DR.N SHRAVAN CHOUDARY</text>
            <text x="570" y="548" textAnchor="end" fontSize="14" fontWeight="700" fill="#1a1a1a">Doctor's Name</text>

            {/* Footer */}
            <rect x="8" y="580" width="584" height="85" fill="#0a5aa8" />
            <text x="20" y="600" fontSize="9" fill="#e8f4ff">
              This medical certificate is valid only with the recipient's signature and reflects the details provided during the online consultation.
            </text>
            <text x="20" y="615" fontSize="9" fill="#e8f4ff">
              Medical Docs Services and EasyMedicalCertificate.com are not liable for any inaccuracies resulting from incorrect information shared by the user.
            </text>
            <text x="20" y="630" fontSize="9" fill="#e8f4ff">
              The certificate is valid solely for the dates specified by the consulting doctor and is intended exclusively for the organization to which it is
            </text>
            <text x="20" y="645" fontSize="9" fill="#e8f4ff">
              addressed. It cannot be used for any medico-legal or legal purposes. By using this certificate, the user assumes full responsibility for the
            </text>
            <text x="20" y="660" fontSize="9" fill="#e8f4ff">
              accuracy of the information provided.
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}