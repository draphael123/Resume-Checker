import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedResume {
  text: string;
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  let text = '';
  
  if (file.type === 'application/pdf') {
    const data = await pdfParse(buffer);
    text = data.text;
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             file.type === 'application/msword') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    text = result.value;
  } else if (file.type === 'text/plain') {
    text = buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file type');
  }
  
  return extractResumeData(text);
}

function extractResumeData(text: string): ParsedResume {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : undefined;
  
  // Extract phone
  const phoneMatch = text.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;
  
  // Extract name (usually first line or before email)
  let name: string | undefined;
  const nameLine = lines[0];
  if (nameLine && nameLine.length < 50 && !nameLine.includes('@') && !nameLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
    name = nameLine;
  }
  
  // Extract skills (common keywords)
  const skillsSection = extractSection(text, ['skills', 'technical skills', 'competencies', 'qualifications']);
  const skills = extractKeywords(skillsSection || text, getSkillKeywords());
  
  // Extract experience
  const experienceSection = extractSection(text, ['experience', 'work history', 'employment', 'professional experience']);
  const experience = extractExperience(experienceSection || text);
  
  // Extract education
  const educationSection = extractSection(text, ['education', 'academic', 'qualifications']);
  const education = extractEducation(educationSection || text);
  
  // Extract certifications
  const certSection = extractSection(text, ['certifications', 'certificates', 'licenses', 'licensure']);
  const certifications = extractCertifications(certSection || text);
  
  return {
    text,
    name,
    email,
    phone,
    skills,
    experience,
    education,
    certifications,
  };
}

function extractSection(text: string, sectionNames: string[]): string | null {
  const lowerText = text.toLowerCase();
  for (const sectionName of sectionNames) {
    const regex = new RegExp(`${sectionName}[:\n]?([\\s\\S]*?)(?:\\n\\n|$)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function extractKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }
  
  return found;
}

function extractExperience(text: string): string[] {
  const experience: string[] = [];
  const lines = text.split('\n');
  
  // Look for job titles and companies
  const jobTitleKeywords = ['nurse', 'assistant', 'manager', 'coordinator', 'specialist', 'technician', 'director', 'supervisor'];
  const datePattern = /\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (jobTitleKeywords.some(keyword => line.includes(keyword)) || datePattern.test(lines[i])) {
      const expEntry = lines.slice(i, Math.min(i + 3, lines.length)).join(' ');
      if (expEntry.length > 10) {
        experience.push(lines[i]);
      }
    }
  }
  
  return experience.slice(0, 5); // Limit to 5 most recent
}

function extractEducation(text: string): string[] {
  const education: string[] = [];
  const lines = text.split('\n');
  
  const degreeKeywords = ['bachelor', 'master', 'doctorate', 'phd', 'associate', 'degree', 'diploma', 'certificate', 'rn', 'bsn', 'msn', 'np'];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (degreeKeywords.some(keyword => lowerLine.includes(keyword))) {
      education.push(line);
    }
  }
  
  return education.slice(0, 3);
}

function extractCertifications(text: string): string[] {
  const certifications: string[] = [];
  const lines = text.split('\n');
  
  const certKeywords = ['certified', 'license', 'cpr', 'bls', 'acls', 'nclex', 'certification', 'licensed'];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (certKeywords.some(keyword => lowerLine.includes(keyword))) {
      certifications.push(line);
    }
  }
  
  return certifications;
}

function getSkillKeywords(): string[] {
  return [
    // Medical
    'patient care', 'medical terminology', 'hipaa', 'ehr', 'electronic health records',
    'vitals', 'phlebotomy', 'injection', 'medication administration', 'scheduling',
    'insurance', 'billing', 'coding', 'cpt', 'icd-10',
    // Nursing
    'nursing', 'clinical', 'assessment', 'diagnosis', 'treatment', 'care plan',
    'medication management', 'patient education', 'discharge planning',
    // Customer Service
    'customer service', 'communication', 'problem solving', 'multitasking',
    'phone etiquette', 'data entry', 'appointment scheduling', 'conflict resolution',
    // General
    'microsoft office', 'excel', 'word', 'outlook', 'typing', 'organization',
    'teamwork', 'leadership', 'time management',
  ];
}

