/**
 * Certificate descriptions data
 * Contains detailed information about each certificate type
 */

export interface CertificateInfo {
  title: string;
  description: string;
  features: string[];
}

export const certificateDescriptions: Record<string, CertificateInfo> = {
  'sick-leave': {
    title: 'Sick Leave Certificate',
    description: 'When health issues prevent you from attending work, school, or college, a Sick Leave Medical Certificate provides official medical confirmation of your condition. You can consult a certified doctor online and receive the required certificate without the need to visit a clinic.\n\nThis certificate helps organizations and institutions understand that your absence is medically advised. Our efficient process ensures timely delivery, allowing you to rest and recover without added pressure or formal hassles.',
    features: ['Valid for employers and educational institutions', 'Includes doctor registration details', 'Digital delivery within 30-90 minutes', 'Accepted nationwide'],
  },
  'work-from-home': {
    title: 'Work From Home Certificate',
    description: 'Certain medical conditions may allow you to work but make office attendance difficult. A Work from Home Medical Certificate supports remote working arrangements based on medical advice.\n\nAfter an online consultation, the doctor may recommend work from home for a specified period, helping you continue your responsibilities while prioritizing your health and recovery.',
    features: ['Corporate HR compliant format', 'Medical justification included', 'Recommended duration specified', 'Digital signature verified'],
  },
  'caretaker': {
    title: 'Caretaker Certificate',
    description: 'When a family member requires medical care, a Caretaker Medical Certificate confirms the need for your presence as a caregiver during their recovery.\n\nThis document supports leave or work-from-home requests and helps employers or institutions understand your caregiving responsibility during the specified period.',
    features: ['Family care documentation', 'Leave justification provided', 'Valid for extended leave requests', 'Employer accepted format'],
  },
  'recovery': {
    title: 'Recovery Certificate',
    description: 'A Recovery Medical Certificate confirms that an individual has recovered from a medical condition and is fit to resume regular activities such as work, studies, or travel.\n\nDoctors issue this certificate after reviewing the current health status to ensure a safe and appropriate return to daily routines.',
    features: ['Fitness confirmation', 'Return to work clearance', 'Activity resumption approval', 'Doctor verified assessment'],
  },
  'fitness': {
    title: 'Fitness Certificate',
    description: 'A Medical Fitness Certificate is often required before starting a job, academic program, sports activity, or travel plan. Through an online consultation, our doctors review your health details and issue a fitness certificate where appropriate.\n\nThe certificate confirms that you are medically fit to carry out specific responsibilities. Each assessment is handled carefully to ensure the document meets standard professional and institutional expectations.',
    features: ['Pre-employment screening', 'Academic admission requirement', 'Sports participation clearance', 'Travel and visa documentation'],
  },
  'fit-to-fly': {
    title: 'Fit to Fly Certificate',
    description: 'A Fit-to-Fly Medical Certificate confirms that an individual is medically safe to travel by air. Doctors assess your current health condition to ensure that flying will not pose any risk to you or others during the journey.\n\nThe certificate is issued after an online consultation and is accepted by airlines, travel authorities, and immigration officials.',
    features: ['Airline accepted format', 'International travel valid', 'Express processing available', 'Multi-language support'],
  },
  'unfit-to-work': {
    title: 'Unfit to Work Certificate',
    description: 'When illness or injury affects your ability to perform work duties safely, an Unfit To Work Medical Certificate provides clear medical documentation of your condition.\n\nDoctors assess your health status and issue the certificate only when medically necessary, helping ensure personal well-being and workplace safety.',
    features: ['Legal employment protection', 'Recovery period defined', 'HR compliant format', 'Medical necessity based'],
  },
  'unfit-to-travel': {
    title: 'Unfit to Travel Certificate',
    description: 'Medical conditions or recovery phases may make travel unsafe or inadvisable. An Unfit To Travel Medical Certificate formally states that travel should be avoided for a defined duration.\n\nThis certificate is commonly used for travel postponements, cancellations, or official communication with employers and travel authorities and is issued only after medical evaluation.',
    features: ['Flight rebooking support', 'Travel insurance claims', 'Hotel cancellation help', 'Medical advisory documentation'],
  },
  'medical-diagnosis': {
    title: 'Medical Diagnosis Certificate',
    description: 'A Medical Diagnosis Certificate serves as official documentation of a diagnosed medical condition for insurance or workplace records.\n\nThe certificate provides verified medical information that can support your claims and communications with relevant institutions.',
    features: ['Insurance claim support', 'Detailed medical records', 'Legal documentation', 'Institutional acceptance'],
  },
};

export function getCertificateDescription(slug: string): CertificateInfo {
  return certificateDescriptions[slug] || certificateDescriptions['sick-leave'];
}
