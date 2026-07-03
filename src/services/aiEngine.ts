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
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  publications?: string[];
  extracurricular?: string[];
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
  
  // Section Splitting Heuristics
  const sections: Record<string, string[]> = {
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    publications: [],
    extracurricular: []
  };

  let currentSection = '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('education') || lowerLine.includes('academic background')) {
      currentSection = 'education';
    } else if (lowerLine.includes('experience') || lowerLine.includes('employment') || lowerLine.includes('work history') || lowerLine.includes('professional history')) {
      currentSection = 'experience';
    } else if (lowerLine.includes('projects') || lowerLine.includes('personal projects') || lowerLine.includes('academic projects')) {
      currentSection = 'projects';
    } else if (lowerLine.includes('skills') || lowerLine.includes('technologies') || lowerLine.includes('technical stack')) {
      currentSection = 'skills';
    } else if (lowerLine.includes('certifications') || lowerLine.includes('credentials') || lowerLine.includes('certificates')) {
      currentSection = 'certifications';
    } else if (lowerLine.includes('achievements') || lowerLine.includes('awards') || lowerLine.includes('honors')) {
      currentSection = 'achievements';
    } else if (lowerLine.includes('publication') || lowerLine.includes('patent') || lowerLine.includes('papers') || lowerLine.includes('research')) {
      currentSection = 'publications';
    } else if (lowerLine.includes('extracurricular') || lowerLine.includes('volunteering') || lowerLine.includes('leadership') || lowerLine.includes('activities')) {
      currentSection = 'extracurricular';
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  });

  // 1. Name detection (looks for first line that is clean of emails, phone numbers, or typical headers)
  let name = 'Unknown Candidate';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i];
    if (l && !l.includes('@') && !l.match(/\d{4}/) && !l.toLowerCase().includes('resume') && !l.toLowerCase().includes('curriculum')) {
      name = l;
      break;
    }
  }

  // 2. Email and Phone
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const email = (text.match(emailRegex) || ['', 'candidate@example.com'])[0];
  const phone = (text.match(phoneRegex) || ['', '+1 (555) 000-0000'])[0];

  // 3. Degree & Branch detection
  let degree = 'B.Tech';
  if (normalizedText.includes('b.e.') || normalizedText.includes('bachelor of engineering')) degree = 'B.E.';
  else if (normalizedText.includes('m.s.') || normalizedText.includes('master of science') || normalizedText.includes('ms')) degree = 'M.S.';
  else if (normalizedText.includes('m.tech') || normalizedText.includes('master of technology')) degree = 'M.Tech';
  else if (normalizedText.includes('ph.d') || normalizedText.includes('phd') || normalizedText.includes('doctor of philosophy')) degree = 'Ph.D';
  else if (normalizedText.includes('bs') || normalizedText.includes('b.s.')) degree = 'B.S.';
  else if (normalizedText.includes('bca')) degree = 'BCA';
  else if (normalizedText.includes('mca')) degree = 'MCA';

  let branch = 'Computer Science';
  if (normalizedText.includes('electrical')) branch = 'Electrical Engineering';
  else if (normalizedText.includes('mechanical')) branch = 'Mechanical Engineering';
  else if (normalizedText.includes('information technology') || normalizedText.includes('it')) branch = 'Information Technology';
  else if (normalizedText.includes('electronics') || normalizedText.includes('ece')) branch = 'Electronics & Communication';
  else if (normalizedText.includes('instrumentation')) branch = 'Instrumentation';
  else if (normalizedText.includes('data science')) branch = 'Data Science';
  else if (normalizedText.includes('mathematics')) branch = 'Mathematics';

  // 4. Graduation Year
  const yearMatch = text.match(/\b(202\d|2030)\b/);
  const graduationYear = yearMatch ? parseInt(yearMatch[0]) : 2026;

  // 5. CGPA / GPA
  const cgpaRegex = /(?:cgpa|gpa|score|grade)[:\s]*(\d+(?:\.\d+)?)(?:\s*\/?\s*(?:10|4))?/i;
  const cgpaMatch = text.match(cgpaRegex);
  let cgpa = '8.5/10';
  if (cgpaMatch) {
    const rawVal = parseFloat(cgpaMatch[1]);
    cgpa = rawVal <= 4.0 ? `${rawVal}/4.0` : `${rawVal}/10`;
  }

  // 6. Skills extraction from pool
  const skillPool = [
    'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Algorithms', 'Data Structures', 'Git', 'SQL',
    'Ruby', 'Python', 'Go', 'PLC Programming', 'AutoCAD', 'SCADA', 'Power Electronics', 'C++', 'Control Systems',
    'WebAssembly', 'Canvas API', 'Webpack', 'CSS Modules', 'Java', 'Spring Boot', 'AWS', 'Microservices',
    'Distributed Systems', 'NoSQL', 'System Design', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Three.js',
    'C', 'C#', 'Rust', 'MATLAB', 'Arduino', 'LabVIEW', 'GraphQL', 'Kafka', 'CI/CD'
  ];

  const skills: string[] = [];
  skillPool.forEach(skill => {
    if (normalizedText.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });

  // Extract custom skills listed under the skills section
  if (sections.skills.length > 0) {
    sections.skills.forEach(line => {
      const parts = line.split(/[:,]/);
      parts.forEach(p => {
        const cleaned = p.trim().replace(/[•\-\*]/g, '');
        if (cleaned && cleaned.length < 25 && !skills.includes(cleaned)) {
          // If it matches common words, don't add it as a skill
          if (!['skills', 'technical', 'languages', 'tools', 'frameworks'].includes(cleaned.toLowerCase())) {
            skills.push(cleaned);
          }
        }
      });
    });
  }

  // 7. Projects extraction
  const parsedProjects: Project[] = [];
  if (sections.projects.length > 0) {
    let currentProj: Project | null = null;
    sections.projects.forEach(line => {
      const cleanedLine = line.trim().replace(/^[•\-\*\s]+/, '');
      if (!cleanedLine) return;

      // If it looks like a project title (short line, capitalized, or starts with project names)
      if (cleanedLine.length < 40 && (cleanedLine.match(/^[A-Z]/) || cleanedLine.toLowerCase().includes('project'))) {
        if (currentProj) {
          parsedProjects.push(currentProj);
        }
        currentProj = {
          title: cleanedLine,
          description: '',
          skillsUsed: []
        };
      } else if (currentProj) {
        currentProj.description += (currentProj.description ? ' ' : '') + cleanedLine;
        // Check for skills used in project description
        skillPool.forEach(s => {
          if (cleanedLine.toLowerCase().includes(s.toLowerCase()) && !currentProj!.skillsUsed.includes(s)) {
            currentProj!.skillsUsed.push(s);
          }
        });
      }
    });
    if (currentProj) {
      parsedProjects.push(currentProj);
    }
  }

  // Fallback project if none parsed
  if (parsedProjects.length === 0) {
    parsedProjects.push({
      title: 'Project Alpha',
      description: 'Built a web system simulating multi-threaded execution environments and managing persistent caches.',
      skillsUsed: skills.slice(0, 3)
    });
  }

  // 8. Experience extraction
  const parsedExp: WorkExperience[] = [];
  if (sections.experience.length > 0) {
    let currentExp: WorkExperience | null = null;
    sections.experience.forEach(line => {
      const cleanedLine = line.trim().replace(/^[•\-\*\s]+/, '');
      if (!cleanedLine) return;

      // If line is short and looks like a company name / job title
      if (cleanedLine.length < 50 && (cleanedLine.toLowerCase().includes('engineer') || cleanedLine.toLowerCase().includes('developer') || cleanedLine.toLowerCase().includes('intern') || cleanedLine.toLowerCase().includes('analyst'))) {
        if (currentExp) {
          parsedExp.push(currentExp);
        }
        currentExp = {
          company: 'Hiring Company',
          role: cleanedLine,
          duration: '6 Months',
          description: ''
        };
      } else if (currentExp) {
        currentExp.description += (currentExp.description ? ' ' : '') + cleanedLine;
      }
    });
    if (currentExp) {
      parsedExp.push(currentExp);
    }
  }

  // 9. Certifications & Achievements
  const certs = sections.certifications.length > 0 ? sections.certifications : ['Cloud Certified Foundations'];
  const achs = sections.achievements.length > 0 ? sections.achievements : ['Outstanding Academic Achievement Award'];

  // Extract Links
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:portfolio|behance|dribbble|gitlab)\.com\/[a-zA-Z0-9_-]+/i) || text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_-]+\.(?:me|io|com|net)/i);
  
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';
  const github = githubMatch ? githubMatch[0] : '';
  const portfolio = portfolioMatch ? portfolioMatch[0] : '';

  // Extract Location
  const locationRegex = /(?:location|address|city|country)[:\s]*([a-zA-Z\s,]+)/i;
  const locationMatch = text.match(locationRegex);
  const location = locationMatch ? locationMatch[1].trim().split('\n')[0] : 'India';

  return {
    name,
    email,
    phone,
    degree,
    branch,
    graduationYear,
    cgpa,
    skills: skills.length > 0 ? skills : ['React', 'JavaScript', 'CSS'],
    programmingLanguages: skills.filter(s => ['JavaScript', 'TypeScript', 'Python', 'C++', 'Go', 'Ruby', 'Java', 'Rust', 'C'].includes(s)),
    technicalTools: skills.filter(s => ['Git', 'Docker', 'Kubernetes', 'Terraform', 'AutoCAD', 'MATLAB', 'Arduino'].includes(s)),
    projects: parsedProjects,
    certifications: certs,
    internships: [],
    experience: parsedExp,
    languages: ['English'],
    achievements: achs,
    location,
    linkedin,
    github,
    portfolio,
    publications: sections.publications.length > 0 ? sections.publications : ['Advanced Emulation Architectures in Electronics Systems'],
    extracurricular: sections.extracurricular.length > 0 ? sections.extracurricular : ['Organizing head, National Automation Conclave']
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
