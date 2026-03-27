/**
 * Certificate descriptions data
 * Contains detailed information about each certificate type
 */

export interface CertificateInfo {
  title: string;
  description: string;
  bulletPoints: string[];
  features: string[];
}

export const certificateDescriptions: Record<string, CertificateInfo> = {
  'sick-leave': {
    title: 'Sick Leave Certificate',
    description: 'When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition. You can consult a certified doctor online and receive the required certificate without the need to visit a clinic.\n\nThis certificate helps organizations and institutions understand that your absence is medically advised. Our efficient process ensures timely delivery, allowing you to rest and recover without added pressure or formal hassles.',
    bulletPoints: [
      'Obtain a <strong>doctor verified Sick Leave Medical Certificate</strong> through a secure <strong>online consultation</strong> with a registered physician.',
      'Your <strong>official documentation</strong> is delivered digitally to your inbox within <strong>30–60 minutes</strong> of approval.',
      'Accepted as a <strong>valid certificate</strong> by employers, schools, and colleges — <strong>valid nationwide</strong> across India.',
      'Includes complete <strong>doctor registration details</strong> for institutional and HR verification.',
      '<strong>Quick approval</strong> process — no clinic visit, no waiting rooms, no physical paperwork required.',
    ],
    features: ['Valid for employers and educational institutions', 'Includes doctor registration details', 'Digital delivery within 30-60 minutes', 'Accepted nationwide'],
  },
  'work-from-home': {
    title: 'Work From Home Certificate',
    description: 'Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements based on medical advice.\n\nAfter an online consultation, the doctor may recommend work from home for a specified period, helping you continue your responsibilities while prioritizing your health and recovery.',
    bulletPoints: [
      'Get a <strong>doctor verified Work From Home Medical Certificate</strong> following a brief <strong>online consultation</strong> with a licensed doctor.',
      'Medical justification for remote working is clearly stated — making it a <strong>valid certificate</strong> for corporate HR departments.',
      'Specifies the <strong>recommended work-from-home duration</strong> as part of your <strong>official documentation</strong>.',
      'Digitally signed and delivered within <strong>30–60 minutes</strong> of your consultation.',
      'HR-compliant format designed for <strong>quick approval</strong> by management and administrative teams.',
    ],
    features: ['Corporate HR compliant format', 'Medical justification included', 'Recommended duration specified', 'Digital signature verified'],
  },
  'caretaker': {
    title: 'Caretaker Certificate',
    description: 'When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery.\n\nThis document supports leave or work-from-home requests and helps employers or institutions understand your caregiving responsibility during the specified period.',
    bulletPoints: [
      'Receive a <strong>doctor verified Caretaker Medical Certificate</strong> confirming your caregiving responsibility through an <strong>online consultation</strong>.',
      'Serves as <strong>official documentation</strong> to support leave applications or work-from-home requests with your employer.',
      'Accepted as a <strong>valid certificate</strong> by HR departments and educational institutions <strong>valid nationwide</strong> across India.',
      'Delivered digitally within <strong>30–60 minutes</strong> — so you can focus on caregiving without administrative delays.',
      'Clearly defines the caregiving period, supporting <strong>quick approval</strong> of extended leave requests.',
    ],
    features: ['Family care documentation', 'Leave justification provided', 'Valid for extended leave requests', 'Employer accepted format'],
  },
  'recovery': {
    title: 'Recovery Certificate',
    description: 'A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities such as work, studies, or travel.\n\nDoctors issue this certificate after reviewing the current health status to ensure a safe and appropriate return to daily routines.',
    bulletPoints: [
      'Get a <strong>doctor verified Recovery Medical Certificate</strong> confirming fitness to resume work, studies, or travel after illness.',
      'Issued following an <strong>online consultation</strong> where a registered doctor reviews your current health status.',
      'Acts as <strong>official documentation</strong> for return-to-work clearance accepted by employers and institutions <strong>valid nationwide</strong>.',
      'Delivered as a <strong>valid certificate</strong> digitally within <strong>30–60 minutes</strong> of your assessment.',
      'Ensures a safe and professionally documented return to daily routines with <strong>quick approval</strong>.',
    ],
    features: ['Fitness confirmation', 'Return to work clearance', 'Activity resumption approval', 'Doctor verified assessment'],
  },
  'fitness': {
    title: 'Fitness Certificate',
    description: 'A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan. Through an online consultation, our doctors review your health details and issue a fitness certificate where appropriate.\n\nThe certificate confirms that you are medically fit to carry out specific responsibilities. Each assessment is handled carefully to ensure the document meets standard professional and institutional expectations.',
    bulletPoints: [
      'Obtain a <strong>doctor verified Medical Fitness Certificate</strong> through a thorough <strong>online consultation</strong> with a licensed physician.',
      'Required for <strong>pre-employment screening</strong>, academic admissions, sports activities, and travel documentation.',
      'Delivered as <strong>official documentation</strong> in a standard format accepted by institutions and organisations <strong>valid nationwide</strong>.',
      'Receive your <strong>valid certificate</strong> digitally within <strong>30–60 minutes</strong> of the medical assessment.',
      '<strong>Quick approval</strong> process — no clinic visit required, ideal for time-sensitive professional or academic needs.',
    ],
    features: ['Pre-employment screening', 'Academic admission requirement', 'Sports participation clearance', 'Travel and visa documentation'],
  },
  'fit-to-fly': {
    title: 'Fit to Fly Certificate',
    description: 'A Fit-to-Fly Medical Certificate confirms that an individual is medically safe to travel by air. Doctors assess your current health condition to ensure that flying will not pose any risk to you or others during the journey.\n\nThe certificate is issued after an online consultation and is accepted by airlines, travel authorities, and immigration officials.',
    bulletPoints: [
      'Get a <strong>doctor verified Fit-to-Fly Medical Certificate</strong> through a secure <strong>online consultation</strong> with a registered physician.',
      'Confirms you are medically safe to travel by air — a <strong>valid certificate</strong> accepted by major airlines and immigration authorities.',
      'Recognised as <strong>official documentation</strong> by travel authorities and visa agencies for international travel requirements.',
      'Delivered digitally within <strong>30–60 minutes</strong> with express processing options for urgent travel needs.',
      'Professional assessment ensuring <strong>quick approval</strong> so you can board your flight without health-related complications.',
    ],
    features: ['Airline accepted format', 'International travel valid', 'Express processing available', 'Multi-language support'],
  },
  'unfit-to-work': {
    title: 'Unfit to Work Certificate',
    description: 'When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation of your condition.\n\nDoctors assess your health status and issue the certificate only when medically necessary, helping ensure personal well-being and workplace safety.',
    bulletPoints: [
      'Obtain a <strong>doctor verified Unfit to Work Medical Certificate</strong> following an <strong>online consultation</strong> confirming your health condition.',
      'Provides legal and medical protection as <strong>official documentation</strong> accepted by HR departments and employers.',
      'Clearly defines your <strong>recovery period</strong> — enabling informed workplace planning and ensuring personal well-being.',
      'A <strong>valid certificate</strong> delivered digitally within <strong>30–60 minutes</strong> of the medical evaluation.',
      'Issued only when <strong>medically necessary</strong>, ensuring authenticity and <strong>quick approval</strong> without complications.',
    ],
    features: ['Legal employment protection', 'Recovery period defined', 'HR compliant format', 'Medical necessity based'],
  },
  'unfit-to-travel': {
    title: 'Unfit to Travel Certificate',
    description: 'Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided for a defined duration.\n\nThis certificate is commonly used for travel postponements, cancellations, or official communication with employers and travel authorities and is issued only after medical evaluation.',
    bulletPoints: [
      'Receive a <strong>doctor verified Unfit to Travel Medical Certificate</strong> through a simple <strong>online consultation</strong> with a registered doctor.',
      'Formally documents medical advice against travel — essential <strong>official documentation</strong> for cancellations and postponements.',
      'Widely accepted as a <strong>valid certificate</strong> for flight rebooking, travel insurance claims, and hotel cancellations.',
      'Delivered digitally within <strong>30–60 minutes</strong>, helping you act swiftly on travel plans without additional stress.',
      'Supports <strong>quick approval</strong> from airlines, travel agencies, and employers with medically verified documentation.',
    ],
    features: ['Flight rebooking support', 'Travel insurance claims', 'Hotel cancellation help', 'Medical advisory documentation'],
  },
  'medical-diagnosis': {
    title: 'Medical Diagnosis Certificate',
    description: 'A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition for insurance or workplace records.\n\nThe certificate provides verified medical information that can support your claims and communications with relevant institutions.',
    bulletPoints: [
      'Get a <strong>doctor verified Medical Diagnosis Certificate</strong> through a confidential <strong>online consultation</strong> with a licensed physician.',
      'Provides verified <strong>official documentation</strong> of your diagnosed medical condition for insurance or workplace records.',
      'A <strong>valid certificate</strong> accepted by insurance providers, legal authorities, and institutional bodies <strong>valid nationwide</strong>.',
      'Delivered digitally within <strong>30–60 minutes</strong> — enabling fast submission for claims and administrative processes.',
      'Comprehensive <strong>medical records</strong> with <strong>quick approval</strong>, supporting insurance claims and institutional communications.',
    ],
    features: ['Insurance claim support', 'Detailed medical records', 'Legal documentation', 'Institutional acceptance'],
  },
};

export function getCertificateDescription(slug: string): CertificateInfo {
  return certificateDescriptions[slug] || certificateDescriptions['sick-leave'];
}
