import type { Job } from '../data/jobs';

export interface Project {
  title: string;
  description: string;
  skillsUsed: string[];
}

export interface Internship {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: string;
  skills: string[];
  programmingLanguages: string[];
  technicalTools: string[];
  projects: Project[];
  certifications: string[];
  internships: Internship[];
  experience: WorkExperience[];
  languages: string[];
  achievements: string[];
}

export interface MatchResult {
  overallScore: number;
  educationMatch: boolean;
  branchMatch: boolean;
  experienceMatch: boolean;
  experienceScore: number;
  skillsScore: number;
  satisfiedSkills: string[];
  missingSkills: string[];
  satisfiedPreferred: string[];
  missingPreferred: string[];
  explanation: string[];
}

// Pre-seeded User Templates to let users test instantly
export const userTemplates: Record<string, UserProfile> = {
  fresherCS: {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 019-2834',
    degree: 'B.Tech',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: '8.9/10',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Algorithms', 'Data Structures', 'Git', 'SQL'],
    programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'C++'],
    technicalTools: ['VS Code', 'Git', 'Docker', 'Webpack', 'Figma'],
    projects: [
      {
        title: 'Collaborative Code Editor',
        description: 'Developed a real-time collaborative text editor supporting concurrent sessions, syntax highlighting, and virtual workspace environments utilizing React and WebSockets.',
        skillsUsed: ['React', 'TypeScript', 'WebSockets', 'CSS']
      },
      {
        title: 'Algorithms Visualizer',
        description: 'Built an interactive platform displaying execution paths of popular pathfinding algorithms (Dijkstra, A*) on configurable graphs, boosting understanding of core data structures.',
        skillsUsed: ['JavaScript', 'HTML', 'CSS', 'Algorithms']
      }
    ],
    certifications: ['AWS Certified Cloud Practitioner', 'Google UX Design Professional Certificate'],
    internships: [
      {
        company: 'WebDev Labs',
        role: 'Frontend Developer Intern',
        duration: '3 Months (Summer 2025)',
        description: 'Refactored internal dashboard layouts into dynamic React layouts, increasing responsiveness and improving visual accessibility across mobile views.'
      }
    ],
    experience: [],
    languages: ['English', 'Spanish'],
    achievements: ['Ranked Top 5% in University Coding Olympiad', 'Dean\'s List for 6 consecutive semesters']
  },
  automationEEE: {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 041-3298',
    degree: 'B.E.',
    branch: 'Electrical Engineering',
    graduationYear: 2025,
    cgpa: '9.2/10',
    skills: ['AutoCAD', 'Power Electronics', 'Control Systems', 'MATLAB', 'Arduino', 'Python', 'Git'],
    programmingLanguages: ['Python', 'C', 'C++'],
    technicalTools: ['MATLAB', 'AutoCAD', 'LTSpice', 'Arduino IDE'],
    projects: [
      {
        title: 'Microgrid Controller',
        description: 'Simulated and designed a smart solar-inverter controller that switches feeds dynamically based on load requirements using MATLAB and Power Electronics principles.',
        skillsUsed: ['MATLAB', 'Power Electronics', 'Control Systems']
      },
      {
        title: 'IoT Weather Station',
        description: 'Assembled an autonomous atmospheric monitoring system utilizing Arduino, local Wi-Fi triggers, and persistent database storage.',
        skillsUsed: ['Arduino', 'C++', 'IoT']
      }
    ],
    certifications: ['Certified PLC Technician (Introductory)', 'MATLAB Onramp Certificate'],
    internships: [
      {
        company: 'Grid Systems Corp',
        role: 'Electrical Systems Intern',
        duration: '6 Months (2025)',
        description: 'Assisted in verifying PLC wiring schematics and loading diagnostics on backup diesel generators for plant control modules.'
      }
    ],
    experience: [],
    languages: ['English', 'Mandarin'],
    achievements: ['Best Capstone Project Award 2025', 'First place in Smart Energy Hackathon']
  }
};

// Parser Simulator: Extracts profiles from unstructured text inputs
export function parseResumeText(text: string): UserProfile {
  const normalizedText = text.toLowerCase();
  
  // Try to find Name (normally at the start of text)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines[0] || 'Unknown Candidate';
  
  // Find email and phone
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  const email = (text.match(emailRegex) || ['', 'candidate@example.com'])[0];
  const phone = (text.match(phoneRegex) || ['', '+1 (555) 000-0000'])[0];
  
  // Extract degree
  let degree = 'B.Tech';
  if (normalizedText.includes('b.e.') || normalizedText.includes('bachelor of engineering')) degree = 'B.E.';
  else if (normalizedText.includes('m.s.') || normalizedText.includes('master of science')) degree = 'M.S.';
  else if (normalizedText.includes('ph.d') || normalizedText.includes('phd')) degree = 'Ph.D';
  else if (normalizedText.includes('bs') || normalizedText.includes('b.s.')) degree = 'B.S.';
  
  // Extract branch
  let branch = 'Computer Science';
  if (normalizedText.includes('electrical')) branch = 'Electrical Engineering';
  else if (normalizedText.includes('mechanical')) branch = 'Mechanical Engineering';
  else if (normalizedText.includes('information technology')) branch = 'Information Technology';
  else if (normalizedText.includes('electronics')) branch = 'Electronics & Communication';
  
  // Extract Graduation Year
  const yearMatch = text.match(/\b(202\d|2030)\b/);
  const graduationYear = yearMatch ? parseInt(yearMatch[0]) : 2026;
  
  // Extract CGPA
  const cgpaMatch = text.match(/cgpa[:\s]+(\d+(\.\d+)?)/i) || text.match(/gpa[:\s]+(\d+(\.\d+)?)/i);
  const cgpa = cgpaMatch ? `${cgpaMatch[1]}/10` : '8.5/10';
  
  // Skill Lists for extraction
  const skillPool = [
    'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Algorithms', 'Data Structures', 'Git', 'SQL',
    'Ruby', 'Python', 'Go', 'PLC Programming', 'AutoCAD', 'SCADA', 'Power Electronics', 'C++', 'Control Systems',
    'WebAssembly', 'Canvas API', 'Webpack', 'CSS Modules', 'Java', 'Spring Boot', 'AWS', 'Microservices',
    'Distributed Systems', 'NoSQL', 'System Design', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Three.js'
  ];
  
  const skills: string[] = [];
  skillPool.forEach(skill => {
    if (normalizedText.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });
  
  // Default values for structural elements if not detected
  return {
    name,
    email,
    phone,
    degree,
    branch,
    graduationYear,
    cgpa,
    skills: skills.length > 0 ? skills : ['React', 'JavaScript', 'CSS'],
    programmingLanguages: skills.filter(s => ['JavaScript', 'TypeScript', 'Python', 'C++', 'Go', 'Ruby', 'Java'].includes(s)),
    technicalTools: skills.filter(s => ['Git', 'Docker', 'Kubernetes', 'Terraform', 'AutoCAD', 'MATLAB'].includes(s)),
    projects: [
      {
        title: 'Project Alpha',
        description: 'Built a web system simulating multi-threaded execution environments and managing persistent caches.',
        skillsUsed: skills.slice(0, 3)
      }
    ],
    certifications: ['Cloud Certified Foundations'],
    internships: [],
    experience: [],
    languages: ['English'],
    achievements: ['Outstanding Academic Achievement Award']
  };
}

// Calculate the match criteria
export function calculateMatch(profile: UserProfile, job: Job): MatchResult {
  const explanation: string[] = [];
  let scorePoints = 0;
  let maxPoints = 0;

  // 1. Education Match (Degree Check)
  const normalizedUserDegree = profile.degree.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const educationMatch = job.requiredDegree.some(deg => {
    const normJobDeg = deg.replace(/[^a-zA-Z]/g, '').toLowerCase();
    return normalizedUserDegree.includes(normJobDeg) || normJobDeg.includes(normalizedUserDegree);
  });
  
  maxPoints += 15;
  if (educationMatch) {
    scorePoints += 15;
    explanation.push(`✓ ${profile.degree} degree accepted by employer.`);
  } else {
    explanation.push(`✗ Job requires ${job.requiredDegree.join('/')}, but your resume shows ${profile.degree}.`);
  }

  // 2. Branch Match
  const branchMatch = job.acceptedBranches.some(b => 
    profile.branch.toLowerCase().includes(b.toLowerCase()) || 
    b.toLowerCase().includes(profile.branch.toLowerCase())
  );
  
  maxPoints += 15;
  if (branchMatch) {
    scorePoints += 15;
    explanation.push(`✓ Graduation branch (${profile.branch}) matches acceptable fields.`);
  } else {
    explanation.push(`✗ Branch (${profile.branch}) is not listed in preferred majors: ${job.acceptedBranches.slice(0, 3).join(', ')}.`);
  }

  // 3. Experience Match
  const userExpYears = profile.experience.length + (profile.internships.length * 0.5); // Internships count as half year equivalent
  const experienceMatch = userExpYears >= job.experienceRequired;
  
  maxPoints += 15;
  if (experienceMatch) {
    scorePoints += 15;
    explanation.push(`✓ Required experience (${job.experienceRequired}y) satisfied (Your score: ~${userExpYears.toFixed(1)}y).`);
  } else {
    explanation.push(`✗ Job requires ${job.experienceRequired} years of experience, but you have around ${userExpYears.toFixed(1)} years.`);
  }

  // 4. Skills Match (Required)
  const satisfiedSkills = job.skillsRequired.filter(skill => 
    profile.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
  );
  const missingSkills = job.skillsRequired.filter(skill => 
    !profile.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
  );

  const skillsMatchWeight = 35;
  maxPoints += skillsMatchWeight;
  if (job.skillsRequired.length > 0) {
    const skillRatio = satisfiedSkills.length / job.skillsRequired.length;
    scorePoints += Math.round(skillRatio * skillsMatchWeight);
    if (skillRatio === 1) {
      explanation.push('✓ All core skills match the requirements.');
    } else {
      explanation.push(`△ Matches ${satisfiedSkills.length} of ${job.skillsRequired.length} primary required skills.`);
    }
  } else {
    scorePoints += skillsMatchWeight; // Free points if no skills required listed
  }

  // 5. Preferred Skills Match
  const satisfiedPreferred = job.preferredSkills.filter(skill => 
    profile.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
  );
  const missingPreferred = job.preferredSkills.filter(skill => 
    !profile.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
  );

  const preferredMatchWeight = 20;
  maxPoints += preferredMatchWeight;
  if (job.preferredSkills.length > 0) {
    const prefRatio = satisfiedPreferred.length / job.preferredSkills.length;
    scorePoints += Math.round(prefRatio * preferredMatchWeight);
    if (satisfiedPreferred.length > 0) {
      explanation.push(`✓ Loaded ${satisfiedPreferred.length} preferred qualification skills.`);
    }
  } else {
    scorePoints += preferredMatchWeight;
  }

  // Calculate percentage
  const overallScore = Math.min(100, Math.max(0, Math.round((scorePoints / maxPoints) * 100)));

  return {
    overallScore,
    educationMatch,
    branchMatch,
    experienceMatch,
    experienceScore: experienceMatch ? 100 : Math.round((userExpYears / (job.experienceRequired || 1)) * 100),
    skillsScore: Math.round((satisfiedSkills.length / (job.skillsRequired.length || 1)) * 100),
    satisfiedSkills,
    missingSkills,
    satisfiedPreferred,
    missingPreferred,
    explanation
  };
}

export function calculateAtsScore(profile: UserProfile): { overall: number; structureScore: number; keywordCoverage: number; formattingScore: number } {
  // Rule checks
  const hasContact = profile.email && profile.phone ? 15 : 0;
  const hasGithubOrLinkedIn = profile.achievements.length > 0 || profile.certifications.length > 0 ? 10 : 0;
  const hasProjects = profile.projects.length >= 2 ? 15 : profile.projects.length * 7;
  const hasExp = (profile.experience.length + profile.internships.length) > 0 ? 10 : 0;
  
  // Keywords coverage estimate based on number of skills
  const keywordCoverage = Math.min(100, profile.skills.length * 8);
  
  const structureScore = hasContact + hasGithubOrLinkedIn + hasProjects + hasExp + 50;
  const formattingScore = profile.cgpa ? 90 : 70;
  
  const overall = Math.round((structureScore + keywordCoverage + formattingScore) / 3);

  return {
    overall,
    structureScore,
    keywordCoverage,
    formattingScore
  };
}

// Generate Resume improvement suggestions
export function generateSuggestions(profile: UserProfile, job: Job): { missingSkills: string[]; suggestions: string[] } {
  const matchResult = calculateMatch(profile, job);
  const suggestions: string[] = [];

  if (matchResult.missingSkills.length > 0) {
    suggestions.push(`Integrate missing keywords: ${matchResult.missingSkills.join(', ')} into your Projects or Internship section.`);
  }

  if (profile.projects.some(p => p.description.split(' ').length < 12)) {
    suggestions.push('Add measurable achievements to your projects. Use action verbs and describe the exact impact.');
  }

  if (profile.experience.length === 0 && profile.internships.length === 0) {
    suggestions.push('Consider adding an Internship or academic research role to strengthen your practical application.');
  }

  if (!profile.certifications || profile.certifications.length === 0) {
    suggestions.push('List relevant certificates to showcase your ongoing learning commitment.');
  }

  if (profile.skills.length < 8) {
    suggestions.push('Add more primary software tools or library names under your Technical Skills section to improve search matching.');
  }

  return {
    missingSkills: matchResult.missingSkills,
    suggestions
  };
}

// Tailor Resume text (simulation of LLM rewrite)
export function tailorResume(profile: UserProfile, job: Job): UserProfile {
  // We align the resume structure and skills to match the job by prioritizing and highlighting items
  const tailoredSkills = Array.from(new Set([...job.skillsRequired, ...profile.skills]));
  
  const tailoredProjects = profile.projects.map(proj => {
    // If a project shares a skill with the job, let's refine its description to highlight the match
    const intersection = proj.skillsUsed.filter(s => job.skillsRequired.includes(s));
    if (intersection.length > 0) {
      return {
        ...proj,
        description: `Leveraged ${intersection.join(' and ')} in a high-impact architecture to deliver core features, aligned with ${job.company}'s requirements for ${job.title}. ${proj.description}`
      };
    }
    return proj;
  });

  return {
    ...profile,
    skills: tailoredSkills,
    projects: tailoredProjects,
    achievements: [
      `Optimized project workflows matching key requirements of ${job.title} at ${job.company}`,
      ...profile.achievements
    ]
  };
}
