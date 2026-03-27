import {
  FileText,
  Heart,
  Home,
  Plane,
  BriefcaseMedical,
  ClipboardList,
  Users,
  Activity,
  PlaneTakeoff,
} from "lucide-react";

import { CertificateType } from "@/types";

export interface CertificateTypeInfo {
  name: string;
  slug: string;
  enumValue: CertificateType;
  description: string;
  shortDescription: string;
  icon: React.ElementType;
  startingPrice: string;
  fee: number;
  features: string[];
}

export interface CertificateCategory {
  name: string;
  items: CertificateTypeInfo[];
}

export const CERTIFICATE_CATEGORIES: CertificateCategory[] = [
  {
    name: "Leave Certificates",
    items: [
      {
        name: "Sick Leave Medical Certificate",
        slug: "sick-leave",
        enumValue: "sick_leave",
        description:
          "When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition. You can consult a certified doctor online and receive the required certificate without the need to visit a clinic.\n\nThis certificate helps organizations and institutions understand that your absence is medically advised. Our efficient process ensures timely delivery, allowing you to rest and recover without added pressure or formal hassles.",
        shortDescription:
          "Obtain a medically verified certificate for workplace or academic sick leave.",
        icon: FileText,
        startingPrice: "₹599",
        fee: 799,
        features: [
          "Accepted by employers & institutions",
          "Delivered within 24-48 hours",
          "Issued by registered MBBS doctor",
        ],
      },
      {
        name: "Work From Home Medical Certificate",
        slug: "work-from-home",
        enumValue: "work_from_home",
        description:
          "Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements based on medical advice.\n\nAfter an online consultation, the doctor may recommend work from home for a specified period, helping you continue your responsibilities while prioritizing your health and recovery.",
        shortDescription:
          "Get medical support for remote working arrangements.",
        icon: Home,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Supports remote work requests",
          "Based on medical consultation",
          "Accepted by employers across India",
        ],
      },
      {
        name: "Caretaker Medical Certificate",
        slug: "caretaker",
        enumValue: "caretaker",
        description:
          "When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery.\n\nThis document supports leave or work-from-home requests and helps employers or institutions understand your caregiving responsibility during the specified period.",
        shortDescription:
          "Confirm your need to care for a family member during recovery.",
        icon: Users,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Supports caregiver leave requests",
          "Documents caregiving responsibility",
          "Accepted by employers & institutions",
        ],
      },
      {
        name: "Recovery Medical Certificate",
        slug: "recovery",
        enumValue: "recovery",
        description:
          "A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities such as work, studies, or travel.\n\nDoctors issue this certificate after reviewing the current health status to ensure a safe and appropriate return to daily routines.",
        shortDescription:
          "Confirm your recovery and fitness to resume activities.",
        icon: Activity,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Confirms recovery from illness",
          "Clearance to resume activities",
          "Issued after health review",
        ],
      },
    ],
  },
  {
    name: "Fitness & Work Status",
    items: [
      {
        name: "Medical Fitness Certificate",
        slug: "fitness",
        enumValue: "fitness",
        description:
          "A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan. Through an online consultation, our doctors review your health details and issue a fitness certificate where appropriate.\n\nThe certificate confirms that you are medically fit to carry out specific responsibilities. Each assessment is handled carefully to ensure the document meets standard professional and institutional expectations.",
        shortDescription:
          "Health & fitness clearance for employment, sports, or admissions.",
        icon: Heart,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Thorough health evaluation",
          "Recognized across India",
          "Available in digital & print",
        ],
      },
      {
        name: "Fit-to-Fly Certificate",
        slug: "fit-to-fly",
        enumValue: "fit_to_fly",
        description:
          "A Fit-to-Fly Medical Certificate confirms that an individual is medically safe to travel by air. Doctors assess your current health condition to ensure that flying will not pose any risk to you or others during the journey.\n\nThe certificate is issued after an online consultation and is accepted by airlines, travel authorities, and immigration officials.",
        shortDescription:
          "Medical clearance confirming you are safe to travel by air.",
        icon: PlaneTakeoff,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Accepted by airlines & travel authorities",
          "Based on medical assessment",
          "Quick online consultation",
        ],
      },
      {
        name: "Unfit To Work Medical Certificate",
        slug: "unfit-to-work",
        enumValue: "unfit_to_work",
        description:
          "When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation of your condition.\n\nDoctors assess your health status and issue the certificate only when medically necessary, helping ensure personal well-being and workplace safety.",
        shortDescription:
          "Medical documentation when illness prevents work duties.",
        icon: BriefcaseMedical,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Documents inability to work",
          "Ensures workplace safety",
          "Issued after medical assessment",
        ],
      },
      {
        name: "Unfit To Travel Medical Certificate",
        slug: "unfit-to-travel",
        enumValue: "unfit_to_travel",
        description:
          "Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided for a defined duration.\n\nThis certificate is commonly used for travel postponements, cancellations, or official communication with employers and travel authorities and is issued only after medical evaluation.",
        shortDescription:
          "Formal medical advice against travel for a defined period.",
        icon: Plane,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Supports travel cancellations",
          "Accepted by travel authorities",
          "Based on medical evaluation",
        ],
      },
    ],
  },
  {
    name: "Medical Records",
    items: [
      {
        name: "Medical Diagnosis Certificate",
        slug: "medical-diagnosis",
        enumValue: "medical_diagnosis",
        description:
          "A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition following professional medical assessment.\n\nIt is commonly required for insurance purposes, academic submissions, workplace records, or administrative and legal documentation. Each certificate is issued responsibly based on clinical findings.",
        shortDescription:
          "Official documentation of a diagnosed medical condition.",
        icon: ClipboardList,
        startingPrice: "₹599",
        fee: 599,
        features: [
          "Official diagnosis documentation",
          "Based on clinical findings",
          "Accepted for official records",
        ],
      },
    ],
  },
];

// Flatten all certificate types into a single array
export const ALL_CERTIFICATE_TYPES: CertificateTypeInfo[] =
  CERTIFICATE_CATEGORIES.flatMap((category) => category.items);

// Get certificate type by slug
export function getCertificateBySlug(
  slug: string
): CertificateTypeInfo | undefined {
  return ALL_CERTIFICATE_TYPES.find((cert) => cert.slug === slug);
}

// Get certificate type by enum value
export function getCertificateByEnum(
  enumValue: string
): CertificateTypeInfo | undefined {
  return ALL_CERTIFICATE_TYPES.find((cert) => cert.enumValue === enumValue);
}

// Convert slug to enum value
export function getEnumFromSlug(slug: string): string | undefined {
  return ALL_CERTIFICATE_TYPES.find((cert) => cert.slug === slug)?.enumValue;
}

// Convert enum value to slug
export function getSlugFromEnum(enumValue: string): string | undefined {
  return ALL_CERTIFICATE_TYPES.find((cert) => cert.enumValue === enumValue)
    ?.slug;
}

// Display label from enum value
export function getLabelFromEnum(enumValue: string): string {
  return (
    ALL_CERTIFICATE_TYPES.find((cert) => cert.enumValue === enumValue)?.name ||
    enumValue.replace(/_/g, " ")
  );
}

// Certificate type labels map (enum → display label)
export const CERT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  ALL_CERTIFICATE_TYPES.map((cert) => [cert.enumValue, cert.name])
);

// Certificate type fees map (enum → fee)
export const CERT_TYPE_FEES: Record<string, number> = Object.fromEntries(
  ALL_CERTIFICATE_TYPES.map((cert) => [cert.enumValue, cert.fee])
);

// Certificate type → template type mapping for doctors
export const CERT_TYPE_TO_TEMPLATE: Record<string, string> = {
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

// Nav items for header
export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Doctor Consultation", href: "/doctor-consultation" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
];

// Footer quick links
export const FOOTER_QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "FAQ", href: "/faq" },
  { name: "Leave a Review", href: "/leave-review" },
  { name: "Sample Certificates", href: "/sample-certificates" },
  { name: "Verify Certificate", href: "/verify-certificate" },
];

// Footer legal links
export const FOOTER_LEGAL_LINKS = [
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Refund & Cancellation Policy", href: "/refund-policy" },
  { name: "Work with us as a Doctor", href: "/doctor/register" },
];

// Service areas (from client requirements)
export const SERVICE_AREAS = [
  "Hyderabad",
  "Bangalore",
  "Pune",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Ranchi",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Gurgaon",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Gwalior",
  "Jabalpur",
  "Coimbatore",
  "Vijayawada",
  "Raipur",
  "Chandigarh",
  "Guwahati",
  "Mysore",
  "Bhubaneswar",
  "Tirupati",
  "Kochi",
  "Dehradun",
  "Kolhapur",
  "Siliguri",
  "Mangalore",
  "Belgaum",
  "Noida",
  "Visakhapatnam",
  "New Delhi",
  "Pondicherry",
  "Shimla",
];

// SEO Keywords: Get Medical Certificate Online in 30 Mins
export const MEDICAL_CERTIFICATE_KEYWORDS = [
  { name: "Medical Certificate Online", href: "/#certificates" },
  { name: "Online Medical Certificate India", href: "/#certificates" },
  { name: "Medical Certificate in Bangalore", href: "/#certificates" },
  { name: "Medical Certificate in Delhi", href: "/#certificates" },
  { name: "Medical Certificate in Mumbai", href: "/#certificates" },
  { name: "Medical Certificate in Hyderabad", href: "/#certificates" },
  { name: "Medical Certificate in Chennai", href: "/#certificates" },
  { name: "Medical Certificate in Kolkata", href: "/#certificates" },
  { name: "Medical Certificate in Pune", href: "/#certificates" },
  { name: "Medical Certificate in Ahmedabad", href: "/#certificates" },
  { name: "Medical Certificate in Jaipur", href: "/#certificates" },
  { name: "Medical Certificate in Noida", href: "/#certificates" },
  { name: "Medical Certificate in Lucknow", href: "/#certificates" },
  { name: "Medical Certificate in Gurgaon", href: "/#certificates" },
  { name: "Medical Certificate in Surat", href: "/#certificates" },
  { name: "Medical Certificate in Indore", href: "/#certificates" },
  { name: "Medical Certificate in Chandigarh", href: "/#certificates" },
  { name: "Medical Certificate in Bhopal", href: "/#certificates" },
  { name: "Medical Certificate in Nagpur", href: "/#certificates" },
  { name: "Medical Certificate in Visakhapatnam", href: "/#certificates" },
  { name: "Online Doctor Consultation", href: "/#certificates" },
  { name: "Telemedicine Certificate India", href: "/#certificates" },
  { name: "Digital Medical Certificate", href: "/#certificates" },
  { name: "Quick Medical Certificate", href: "/#certificates" },
  { name: "Medical Certificate for Office", href: "/#certificates" },
  { name: "Medical Certificate for College", href: "/#certificates" },
  { name: "Medical Certificate for School", href: "/#certificates" },
  { name: "Instant Medical Certificate", href: "/#certificates" },
  { name: "24x7 Medical Certificate", href: "/#certificates" },
  { name: "Same Day Medical Certificate", href: "/#certificates" },
];

// SEO Keywords: Certificate Types & Services
export const CERTIFICATE_SERVICE_KEYWORDS = [
  { name: "Sick Leave Certificate Online", href: "/apply/sick-leave" },
  { name: "Fitness Certificate Online", href: "/apply/fitness" },
  { name: "Work From Home Certificate", href: "/apply/work-from-home" },
  { name: "Medical Fitness Certificate", href: "/apply/fitness" },
  { name: "Sick Leave Certificate for Office", href: "/apply/sick-leave" },
  { name: "Unfit to Travel Certificate", href: "/apply/unfit-to-travel" },
  { name: "Unfit to Work Certificate", href: "/apply/unfit-to-work" },
  { name: "Medical Diagnosis Certificate", href: "/apply/medical-diagnosis" },
  { name: "Caretaker Certificate Online", href: "/apply/caretaker" },
  { name: "Recovery Certificate Online", href: "/apply/recovery" },
  { name: "Fit to Fly Certificate India", href: "/apply/fit-to-fly" },
  { name: "Doctor Certificate for Leave", href: "/apply/sick-leave" },
  { name: "Online Sick Leave Certificate", href: "/apply/sick-leave" },
  { name: "WFH Medical Certificate", href: "/apply/work-from-home" },
  { name: "Fitness Certificate for Job", href: "/apply/fitness" },
  { name: "Medical Leave Certificate", href: "/apply/sick-leave" },
  { name: "Certificate from Registered Doctor", href: "/#certificates" },
  { name: "Verified Medical Certificate", href: "/#certificates" },
  { name: "Genuine Medical Certificate", href: "/#certificates" },
  { name: "NMC Compliant Certificate", href: "/#certificates" },
  { name: "Fever Medical Certificate", href: "/apply/sick-leave" },
  { name: "Cold & Flu Certificate", href: "/apply/sick-leave" },
  { name: "Body Pain Medical Certificate", href: "/apply/sick-leave" },
  { name: "Viral Fever Certificate", href: "/apply/sick-leave" },
  { name: "Headache Medical Certificate", href: "/apply/sick-leave" },
  { name: "Medical Certificate for HR", href: "/#certificates" },
  { name: "Medical Certificate for Employment", href: "/apply/fitness" },
  { name: "Medical Certificate for Travel", href: "/apply/fit-to-fly" },
  { name: "Express Medical Certificate", href: "/#certificates" },
  { name: "Urgent Medical Certificate", href: "/#certificates" },
];

// Global Office Addresses for footer
export const GLOBAL_OFFICE_ADDRESSES = [
  {
    name: "MediProofDocs, Nariman Point, Marine Drive, Mumbai, Maharashtra, India",
    city: "Mumbai",
  },
];

// SEO Keywords: Additional Popular Searches
export const ADDITIONAL_KEYWORDS = [
  { name: "Doctor Consultation Online", href: "/doctor-consultation" },
  { name: "Get Medical Certificate Fast", href: "/#certificates" },
  { name: "Medical Certificate Near Me", href: "/#certificates" },
  { name: "Online Doctor for Certificate", href: "/doctor-consultation" },
  { name: "Medical Certificate Home Delivery", href: "/#certificates" },
  { name: "Handwritten Medical Certificate", href: "/#certificates" },
  { name: "Digital Certificate WhatsApp", href: "/#certificates" },
  { name: "Medical Certificate with Prescription", href: "/#certificates" },
  { name: "30 Minute Medical Certificate", href: "/#certificates" },
  { name: "Registered Doctor Certificate", href: "/#certificates" },
  { name: "Valid Medical Certificate India", href: "/#certificates" },
  { name: "Medical Certificate for Leave Application", href: "/apply/sick-leave" },
  { name: "Online Medical Note", href: "/#certificates" },
  { name: "Teleconsultation Certificate", href: "/doctor-consultation" },
  { name: "Medical Certificate PDF Download", href: "/#certificates" },
];

// Payment tiers
export const PAYMENT_OPTIONS = [
  {
    id: "digital_no_prescription" as const,
    label: "Digital Certificate without prescription",
    shortLabel: "Digital (No Rx)",
    price: 599,
    refundable: false,
    convenienceFee: null,
    documentFormat: "digital" as const,
    description: "Non-Refundable",
  },
  {
    id: "digital_with_prescription" as const,
    label: "Digital Certificate with prescription",
    shortLabel: "Digital (With Rx)",
    price: 799,
    refundable: true,
    convenienceFee: 199,
    documentFormat: "digital" as const,
    description: "Includes prescription",
  },
  {
    id: "digital_express" as const,
    label: "Digital Certificate with prescription (30-Minute Express Delivery)",
    shortLabel: "Digital Express (30 min)",
    price: 899,
    refundable: true,
    convenienceFee: 199,
    documentFormat: "digital" as const,
    description: "Express 30-minute delivery",
  },
  {
    id: "handwritten_no_prescription" as const,
    label: "Handwritten Certificate without prescription",
    shortLabel: "Handwritten (No Rx)",
    price: 1099,
    refundable: false,
    convenienceFee: null,
    documentFormat: "handwritten" as const,
    description: "Non-Refundable",
  },
  {
    id: "handwritten_with_prescription" as const,
    label: "Handwritten Certificate with prescription",
    shortLabel: "Handwritten (With Rx)",
    price: 1399,
    refundable: true,
    convenienceFee: 299,
    documentFormat: "handwritten" as const,
    description: "Includes prescription",
  },
  {
    id: "handwritten_shipping_no_prescription" as const,
    label: "Handwritten Medical Certificate without prescription + Shipping",
    shortLabel: "Handwritten + Shipping (No Rx)",
    price: 1299,
    refundable: true,
    convenienceFee: 299,
    documentFormat: "handwritten" as const,
    description: "Includes shipping across India",
  },
  {
    id: "handwritten_shipping_with_prescription" as const,
    label: "Handwritten Medical Certificate with prescription + Shipping",
    shortLabel: "Handwritten + Shipping (With Rx)",
    price: 1499,
    refundable: true,
    convenienceFee: 299,
    documentFormat: "handwritten" as const,
    description: "Includes prescription + shipping",
  },
];

// Special format attestation fee
export const SPECIAL_FORMAT_FEE = 250;
export const SPECIAL_FORMAT_FEE_INTERNATIONAL = 5; // USD

// ============================================
// Form Dropdown Options
// ============================================

export const MEDICAL_PROBLEMS = [
  { value: "fever", label: "Fever" },
  { value: "cold", label: "Cold" },
  { value: "headache", label: "Headache" },
  { value: "body_pain", label: "Body Pain" },
  { value: "viral_fever", label: "Viral Fever" },
  { value: "stomach_pain", label: "Stomach Pain" },
  { value: "back_pain", label: "Back Pain" },
  { value: "migraine", label: "Migraine" },
  { value: "food_poisoning", label: "Food Poisoning" },
  { value: "other", label: "Other" },
] as const;

export const LEAVE_DURATIONS = [
  { value: "1_day", label: "1 Day" },
  { value: "2_days", label: "2 Days" },
  { value: "3_days", label: "3 Days" },
  { value: "4_days", label: "4 Days" },
  { value: "5_days", label: "5 Days" },
  { value: "6_days", label: "6 Days" },
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "other", label: "Other" },
] as const;

export const GUARDIAN_RELATIONSHIPS = [
  { value: "father", label: "Father" },
  { value: "husband", label: "Husband" },
  { value: "mother", label: "Mother" },
  { value: "wife", label: "Wife" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "other", label: "Other" },
] as const;

export const CARETAKER_RELATIONSHIPS = [
  { value: "parent", label: "Parent" },
  { value: "wife", label: "Wife" },
  { value: "husband", label: "Husband" },
  { value: "other", label: "Other" },
] as const;

export const DOCUMENT_FORMATS = [
  { value: "digital", label: "Digital Certificate" },
  { value: "handwritten", label: "Handwritten Certificate" },
] as const;

export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "United Arab Emirates", "Singapore", "Germany", "France", "Saudi Arabia",
  "Qatar", "Kuwait", "Bahrain", "Oman", "Netherlands", "New Zealand",
  "South Africa", "Malaysia", "Thailand", "Japan", "South Korea", "Other",
] as const;

export const LEAVE_DURATION_MESSAGE =
  "The consulting doctor determines the issuance and duration of the medical certificate. For requests exceeding seven days of leave, work-from-home, or medical notes, a prescription or relevant reports may be required.";

export const TERMS_AND_CONDITIONS_TEXT = `I confirm that medproofdocs.com is a facilitating platform only and does not issue medical certificates directly. The issuance, content, duration, and acceptance of the medical certificate are solely at the discretion of the consulting registered doctor. I understand that medproofdocs.com shall not be liable for non-issuance, rejection, or any consequences arising from the use of the medical certificate. I confirm that all information provided by me is true and accurate and that this certificate will not be used for any medico-legal or unethical purposes, including legal proceedings, insurance claims, police cases, government job regularisation, or judicial matters. I understand that this online consultation is not a substitute for an in-person doctor visit or treatment of serious medical conditions. In case of non-issuance or cancellation, a convenience charge may apply as per the Refund & Cancellation Policy, and no refunds are available for non-refundable formats. I agree that all certificates are issued in English and that certificate formats cannot be altered. I consent to online consultation and to the use of my information as per the Privacy Policy and Terms of Service of medproofdocs.com.`;

// Certificate type form groups for conditional rendering
export const CERT_TYPE_GROUPS = {
  groupA: ["sick_leave", "work_from_home", "unfit_to_work", "unfit_to_travel"] as const,
  groupB: ["fitness", "recovery", "fit_to_fly"] as const,
  groupC: ["caretaker"] as const,
  groupD: ["medical_diagnosis"] as const,
} as const;

export function getCertificateGroup(certType: string): "A" | "B" | "C" | "D" {
  if (CERT_TYPE_GROUPS.groupA.includes(certType as never)) return "A";
  if (CERT_TYPE_GROUPS.groupB.includes(certType as never)) return "B";
  if (CERT_TYPE_GROUPS.groupC.includes(certType as never)) return "C";
  return "D";
}

// Get payment tier by ID
export function getPaymentTier(tierId: string) {
  return PAYMENT_OPTIONS.find((t) => t.id === tierId);
}

// ============================================
// FAQ Items (from client requirements)
// ============================================

export const FAQ_ITEMS = [
  {
    question: "When will I receive my medical certificate?",
    answer:
      "You will receive your **digital medical certificate within 30–60 minutes** after completing the online doctor consultation. If you choose a **physical copy**, it will be delivered within **8–10 business days**.",
  },
  {
    question: "Are online medical certificates valid in India?",
    answer:
      "Yes, all our medical notes are as per **NMC & WHO guidelines**. If your employer or education institute has any clarifications, they could reach out to the **Doctor** on the medical certificate issued.",
  },
  {
    question: "Will my employer or educational institution accept this certificate?",
    answer:
      "Yes, all our certificates adhere to **NMC and WHO guidelines** and are accepted by most organizations. For any clarifications, they can contact the doctor whose details are on the certificate.",
  },
  {
    question: "Are the medical certificates genuine?",
    answer:
      "Absolutely. All certificates are issued after a **proper medical consultation** and are legally valid. These medical certificates are generated following all protocols of the **NMC & WHO** and given by **certified Indian doctors**. They are **100% legitimate**. We do not provide fake medical certificates or make any reports. For more details on the validity of a medical certificate issued by us, visit **MY WEBSITE CERTIFICATE PAGE**.",
  },
  {
    question: "Which cities or states do you operate in?",
    answer:
      "Our service is available **across India**, including major cities and towns. We serve **Hyderabad, Bangalore, Chennai, Mumbai, Delhi, Kolkata**, and **50+ more cities** nationwide.",
  },
  {
    question: "When do I need to visit a doctor physically?",
    answer:
      "A physical visit may be required if: the **doctor feels in-person examination is necessary**, or your **condition cannot be assessed online**.",
  },
  {
    question: "Can a doctor from another state issue my medical certificate?",
    answer:
      "Yes. A doctor who is registered with a recognized **Medical Council in India** can issue a medical certificate even if the patient is located in another state. Online consultation and certificate issuance are permitted under the **Telemedicine Practice Guidelines** issued by the Government of India (under the **Medical Council of India / National Medical Commission**).",
  },
  {
    question: "Are these medical certificates genuine?",
    answer:
      "These medical certificates are generated following all protocols of the **NMC & WHO** and given by **certified Indian doctors**. They are **100% legit**. We do not provide fake medical certificates or make any reports.",
  },
  {
    question: "How can I check the validity of my certificate?",
    answer:
      "For any concerns about the validity of your certificate, your **employer or institution** can contact the issuing doctor directly using the **contact details provided on the certificate**. We maintain the highest standards of **authenticity and transparency**. Email: **contact@medidocproof.com**",
  },
  {
    question: "What is a medical certificate?",
    answer:
      "A medical certificate is a document issued by a **registered medical doctor** or licensed medical practitioner after confirming the details of the patient through a thorough examination of the patient's health condition. It serves as an **official statement** about a person's health status, required for various **legal, professional, and personal purposes**.",
  },
  {
    question: "How do I validate a medical certificate?",
    answer:
      "A medical certificate can be validated by checking: **Doctor's registration number**, **Doctor's signature or stamp**, **Date and medical details**. Certificates issued through our platform include all required verification details.",
  },
  {
    question: "How can I identify a fake medical certificate?",
    answer:
      "A fake certificate may: **Not include a doctor's registration number**, be **issued without consultation**, or have **missing or incorrect doctor details**. Certificates issued through our platform include all required verification details.",
  },
  {
    question: "What services are non-refundable?",
    answer:
      "Consultation and medical review services are **non-refundable** once the doctor consultation has started. Please review the **refund policy** before applying.",
  },
  {
    question: "How to Validate a Medical Certificate?",
    answer:
      "Validating a medical certificate involves verifying that the certificate is genuine and that it was issued by a **registered medical practitioner**. To do this, check the following: **Full Name and Address of the Patient** — Ensure the certificate includes the patient's full name and address. **Organisation Addressed** — Verify that the certificate is addressed to the correct organisation. **Validity Dates** — Check the dates from which the certificate is valid and its duration. **Diagnosis** — Ensure a clear outline of the diagnosis. **Doctor's Contact Details** — Verify the contact details, seal, and signature of the doctor. **Patient's Signature** — Ensure the patient's signature is on the certificate.",
  },
];

// ============================================
// Testimonials (from client requirements)
// ============================================

export const TESTIMONIALS = [
  {
    name: "Venkatesh Rao",
    title: "Operations Manager",
    text: "My organization required a fitness certificate during onboarding. After submitting my details, a doctor consulted me and issued the certificate within 30 minutes. The service was professional and well-organized.",
  },
  {
    name: "Ayesha Khan",
    title: "MBA Student",
    text: "I needed a medical certificate for college attendance due to illness. The online consultation was quick, and the certificate format was accepted by my institution. Very helpful platform for students.",
  },
  {
    name: "Harish Kulkarni",
    title: "Site Engineer",
    text: "I usually prefer visiting hospitals, but this online medical certificate service changed my perspective. The doctor understood my health condition and guided me properly. The experience was smooth and trustworthy.",
  },
  {
    name: "Sneha Patil",
    title: "Digital Marketing Executive",
    text: "I applied for a work-from-home medical certificate. The process was easy, and the response time was impressive. The certificate was delivered digitally and accepted by my company.",
  },
  {
    name: "Suresh Reddy",
    title: "IT Support Executive",
    text: "I had viral fever and was unable to attend office. My HR team asked for a sick leave medical certificate, and I received it quickly through this platform. The doctor consultation was smooth, and the certificate was accepted without any questions.",
  },
  {
    name: "Ananya Mehta",
    title: "HR Coordinator",
    text: "I needed a medical fitness certificate for joining a new company. The entire process was online and extremely convenient. The doctor was polite and professional, and I got my certificate within minutes.",
  },
  {
    name: "Pooja Nair",
    title: "Financial Analyst",
    text: "I needed an international medical certificate for an overseas business trip. The consultation was prompt, and the documentation was delivered on time. The process was transparent and efficient.",
  },
  {
    name: "Divya Agarwal",
    title: "Accounts Executive",
    text: "I needed a medical fitness certificate for employment verification. The platform was easy to use, and the doctor consultation was very smooth. The certificate was issued promptly in the correct format.",
  },
  {
    name: "Srinivas Ch",
    title: "Production Supervisor",
    text: "My employer requested a fitness certificate during onboarding. The medical consultation happened quickly, and I received the certificate within 30 minutes. Professional and trustworthy service.",
  },
  {
    name: "Nusrat Begum",
    title: "BPO Team Lead",
    text: "I needed a medical leave certificate for work. The doctor asked relevant questions and issued the certificate in the proper format. Very helpful support team.",
  },
  {
    name: "Manoj Tiwari",
    title: "Warehouse Manager",
    text: "Getting a medical certificate online saved me a lot of time. The process was straightforward, and the certificate was accepted by my HR department without issues.",
  },
];

// ============================================
// About Page Content
// ============================================

export const ABOUT_SECTIONS = {
  intro: "Your trusted online destination for obtaining genuine medical certificates quickly, securely, and conveniently. We are committed to simplifying healthcare documentation by connecting patients with registered doctors through safe and compliant digital consultations.",
  mission:
    "Our mission is to make medical certification accessible, ethical, and reliable for everyone across India. We aim to reduce unnecessary clinic visits while ensuring that every certificate issued meets legal, medical, and professional standards.",
  whatWeDo:
    "MediProofDocs provides a secure platform where individuals can consult registered doctors online and receive valid medical certificates for various purposes. Each request is carefully reviewed, and certificates are issued only after a genuine tele-consultation with a registered doctor.",
  trustPoints: [
    "Consultations conducted by registered doctors",
    "Certificates issued in approved medical formats",
    "Full compliance with the Telemedicine Act 2019 and National Medical Commission (NMC) guidelines",
    "Strict doctor–patient confidentiality",
    "Secure handling of personal and medical data",
  ],
  whyChooseUs: [
    { title: "Fast Processing", description: "Receive digital certificates within minutes after consultation" },
    { title: "Convenience", description: "Consult registered doctors from the comfort of your home" },
    { title: "Nationwide Service", description: "Available across major cities and states in India" },
    { title: "Privacy First", description: "Your health information is protected with high-security standards" },
    { title: "Accepted Formats", description: "Certificates suitable for offices, colleges, travel, and official submissions" },
  ],
  whoCanUse: [
    "Working professionals",
    "Students and educators",
    "Job seekers and employers",
    "Travelers and business professionals",
    "Individuals caring for family members",
  ],
  commitment:
    "We believe healthcare documentation should be simple, ethical, and transparent. We continuously improve our services to ensure timely support, professional consultations, and medical certificates you can trust. Your health, privacy, and peace of mind remain our top priorities.",
};
