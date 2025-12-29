import { ParsedResume } from './resumeParser';

export type RoleCategory = 'Customer Service' | 'Medical Assistants' | 'NPs' | 'RNs';

export interface RoleMatch {
  role: RoleCategory;
  score: number;
  matchedSkills: string[];
  matchedExperience: string[];
  matchedEducation: string[];
  matchedCertifications: string[];
  reasoning: string;
}

const roleKeywords: Record<RoleCategory, {
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
  weights: {
    skills: number;
    experience: number;
    education: number;
    certifications: number;
  };
}> = {
  'Customer Service': {
    skills: [
      'customer service', 'communication', 'phone', 'email', 'problem solving',
      'multitasking', 'appointment scheduling', 'data entry', 'typing',
      'conflict resolution', 'empathy', 'active listening', 'patience',
      'microsoft office', 'excel', 'word', 'outlook', 'crm',
    ],
    experience: [
      'customer service', 'receptionist', 'front desk', 'call center',
      'client relations', 'patient relations', 'administrative assistant',
      'office coordinator', 'scheduler',
    ],
    education: [
      'high school', 'associate', 'bachelor', 'business', 'communication',
      'hospitality', 'healthcare administration',
    ],
    certifications: [
      'customer service certification', 'medical receptionist',
    ],
    weights: {
      skills: 0.3,
      experience: 0.4,
      education: 0.15,
      certifications: 0.15,
    },
  },
  'Medical Assistants': {
    skills: [
      'patient care', 'vitals', 'blood pressure', 'temperature', 'height',
      'weight', 'phlebotomy', 'injection', 'ekg', 'ekg', 'ecg',
      'wound care', 'dressing', 'sutures', 'medical terminology',
      'ehr', 'electronic health records', 'appointment scheduling',
      'insurance', 'billing', 'coding', 'cpt', 'icd-10', 'cpr', 'bls',
      'medication administration', 'specimen collection', 'urinalysis',
      'point of care testing', 'glucose monitoring',
    ],
    experience: [
      'medical assistant', 'clinical assistant', 'patient care technician',
      'certified medical assistant', 'cma', 'pct', 'nursing assistant',
      'healthcare assistant',
    ],
    education: [
      'medical assistant', 'cma', 'certified medical assistant',
      'associate', 'diploma', 'certificate program', 'healthcare',
    ],
    certifications: [
      'cma', 'certified medical assistant', 'cpr', 'bls', 'certified',
      'phlebotomy certification', 'ekg certification',
    ],
    weights: {
      skills: 0.35,
      experience: 0.35,
      education: 0.2,
      certifications: 0.1,
    },
  },
  'NPs': {
    skills: [
      'patient assessment', 'diagnosis', 'treatment', 'prescribing',
      'medication management', 'care plan', 'chronic disease management',
      'primary care', 'family practice', 'internal medicine',
      'patient education', 'health promotion', 'preventive care',
      'clinical decision making', 'diagnostic reasoning', 'ehr',
      'telemedicine', 'collaborative practice', 'autonomous practice',
    ],
    experience: [
      'nurse practitioner', 'np', 'advanced practice', 'primary care provider',
      'family nurse practitioner', 'fnp', 'adult gerontology', 'agnp',
      'pediatric nurse practitioner', 'pnp', 'clinical nurse specialist',
      'provider', 'clinician',
    ],
    education: [
      'nurse practitioner', 'np', 'master of science in nursing', 'msn',
      'doctor of nursing practice', 'dnp', 'advanced practice',
      'bachelor of science in nursing', 'bsn', 'registered nurse',
    ],
    certifications: [
      'nurse practitioner', 'np certification', 'fnp', 'agnp', 'pnp',
      'ancc', 'aanp', 'board certified', 'license', 'prescriptive authority',
      'dea', 'controlled substances',
    ],
    weights: {
      skills: 0.3,
      experience: 0.3,
      education: 0.25,
      certifications: 0.15,
    },
  },
  'RNs': {
    skills: [
      'nursing', 'patient care', 'assessment', 'care plan', 'medication',
      'iv therapy', 'wound care', 'patient education', 'discharge planning',
      'documentation', 'charting', 'care coordination', 'collaboration',
      'critical thinking', 'clinical judgment', 'patient advocacy',
      'medication administration', 'nursing process', 'nursing diagnosis',
      'acute care', 'chronic care', 'rehabilitation', 'geriatrics',
    ],
    experience: [
      'registered nurse', 'rn', 'staff nurse', 'nurse', 'charge nurse',
      'clinical nurse', 'bedside nurse', 'nurse manager', 'nurse supervisor',
      'hospital', 'clinic', 'long term care', 'skilled nursing', 'home health',
      'icu', 'er', 'emergency', 'med surg', 'medical surgical',
      'critical care', 'cardiac', 'orthopedic', 'oncology', 'pediatric',
    ],
    education: [
      'registered nurse', 'rn', 'bachelor of science in nursing', 'bsn',
      'associate degree in nursing', 'adn', 'diploma in nursing',
      'nursing program', 'nursing school',
    ],
    certifications: [
      'registered nurse', 'rn license', 'nclex', 'state license',
      'bls', 'cpr', 'acls', 'pals', 'tncc', 'certified',
      'cvicu', 'ccrn', 'oncology certified', 'wound care certified',
    ],
    weights: {
      skills: 0.3,
      experience: 0.35,
      education: 0.2,
      certifications: 0.15,
    },
  },
};

export function matchResumeToRoles(resume: ParsedResume): RoleMatch[] {
  const matches: RoleMatch[] = [];
  
  for (const role of Object.keys(roleKeywords) as RoleCategory[]) {
    const roleData = roleKeywords[role];
    const match = calculateMatch(resume, role, roleData);
    matches.push(match);
  }
  
  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);
  
  return matches;
}

function calculateMatch(
  resume: ParsedResume,
  role: RoleCategory,
  roleData: typeof roleKeywords[RoleCategory]
): RoleMatch {
  const text = resume.text.toLowerCase();
  const resumeSkills = resume.skills.map(s => s.toLowerCase());
  const resumeExperience = resume.experience.map(e => e.toLowerCase());
  const resumeEducation = resume.education.map(e => e.toLowerCase());
  const resumeCertifications = resume.certifications.map(c => c.toLowerCase());
  
  // Match skills
  const matchedSkills: string[] = [];
  for (const skill of roleData.skills) {
    if (resumeSkills.some(rs => rs.includes(skill.toLowerCase())) ||
        text.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    }
  }
  const skillScore = matchedSkills.length / roleData.skills.length;
  
  // Match experience
  const matchedExperience: string[] = [];
  for (const exp of roleData.experience) {
    if (resumeExperience.some(re => re.includes(exp.toLowerCase())) ||
        text.includes(exp.toLowerCase())) {
      matchedExperience.push(exp);
    }
  }
  const experienceScore = matchedExperience.length / roleData.experience.length;
  
  // Match education
  const matchedEducation: string[] = [];
  for (const edu of roleData.education) {
    if (resumeEducation.some(re => re.includes(edu.toLowerCase())) ||
        text.includes(edu.toLowerCase())) {
      matchedEducation.push(edu);
    }
  }
  const educationScore = matchedEducation.length / roleData.education.length;
  
  // Match certifications
  const matchedCertifications: string[] = [];
  for (const cert of roleData.certifications) {
    if (resumeCertifications.some(rc => rc.includes(cert.toLowerCase())) ||
        text.includes(cert.toLowerCase())) {
      matchedCertifications.push(cert);
    }
  }
  const certScore = matchedCertifications.length / roleData.certifications.length;
  
  // Calculate weighted score
  const score = Math.min(100, (
    skillScore * roleData.weights.skills +
    experienceScore * roleData.weights.experience +
    educationScore * roleData.weights.education +
    certScore * roleData.weights.certifications
  ) * 100);
  
  // Generate reasoning
  const reasoning = generateReasoning(role, score, {
    skills: matchedSkills.length,
    experience: matchedExperience.length,
    education: matchedEducation.length,
    certifications: matchedCertifications.length,
  });
  
  return {
    role,
    score: Math.round(score),
    matchedSkills,
    matchedExperience,
    matchedEducation,
    matchedCertifications,
    reasoning,
  };
}

function generateReasoning(
  role: RoleCategory,
  score: number,
  counts: { skills: number; experience: number; education: number; certifications: number }
): string {
  const parts: string[] = [];
  
  if (score >= 80) {
    parts.push(`Excellent match for ${role} role.`);
  } else if (score >= 60) {
    parts.push(`Strong candidate for ${role} position.`);
  } else if (score >= 40) {
    parts.push(`Moderate fit for ${role} role.`);
  } else {
    parts.push(`Limited alignment with ${role} requirements.`);
  }
  
  if (counts.experience > 0) {
    parts.push(`Relevant experience found (${counts.experience} matches).`);
  }
  if (counts.skills > 0) {
    parts.push(`Matching skills identified (${counts.skills} matches).`);
  }
  if (counts.education > 0) {
    parts.push(`Relevant education credentials present.`);
  }
  if (counts.certifications > 0) {
    parts.push(`Applicable certifications detected.`);
  }
  
  return parts.join(' ');
}

