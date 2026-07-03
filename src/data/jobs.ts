export interface Job {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  jobId: string;
  applyUrl: string;
  atsPlatform: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  salary?: string;
  requiredDegree: string[];
  acceptedBranches: string[];
  experienceRequired: number; // in years (0 for freshers)
  skillsRequired: string[];
  preferredSkills: string[];
  postingDate: string;
  deadline?: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  description: string;
  companyOverview?: string;
  hiringTrends?: string;
  visaRequirement?: 'Sponsorship Available' | 'Local Auth Required' | 'Not Specified';
}

export interface SocialHiringPost {
  id: string;
  recruiterName: string;
  recruiterRole: string;
  recruiterAvatar: string;
  company: string;
  content: string;
  postedTime: string;
  contactEmail?: string;
  applyLink?: string;
}

export const mockJobs: Job[] = [
  {
    id: 'google-swe-1',
    company: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&auto=format&fit=crop&q=80',
    title: 'Software Engineer - Front End, Early Career',
    jobId: 'GOOG-2026-9812',
    applyUrl: 'https://careers.google.com/jobs/results/early-career-swe-frontend',
    atsPlatform: 'Company Career Page',
    location: 'Mountain View, CA',
    workMode: 'Hybrid',
    salary: '$128,000 - $165,000 + equity',
    requiredDegree: ["B.Tech", "B.E.", "M.S.", "BS", "MS", "B.S.", "MCA"],
    acceptedBranches: ['Computer Science', 'Information Technology', 'Software Engineering', 'Electrical Engineering'],
    experienceRequired: 0,
    skillsRequired: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Algorithms', 'Data Structures'],
    preferredSkills: ['Next.js', 'Web Performance Optimization', 'Node.js', 'Figma'],
    postingDate: '2026-07-02',
    deadline: '2026-08-15',
    employmentType: 'Full-time',
    description: 'As a Software Engineer in the Front End team, you will build user interfaces that empower users around the globe. You will work closely with designers, product managers, and other engineers to deliver high-quality, performant web applications using modern web standards.',
    companyOverview: 'Google is a global technology leader focused on improving the ways people connect with information.',
    hiringTrends: 'Highly active hiring for early career talent in front-end and full-stack positions.',
    visaRequirement: 'Local Auth Required'
  },
  {
    id: 'nvidia-get-ece',
    company: 'NVIDIA',
    companyLogo: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=128&auto=format&fit=crop&q=80',
    title: 'Graduate Engineer Trainee - Hardware & Silicon Validation',
    jobId: 'NV-GET-2026-01',
    applyUrl: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAIndiaCareers/silicon-validation-get',
    atsPlatform: 'Workday',
    location: 'Bengaluru, India',
    workMode: 'On-site',
    salary: '₹14,00,000 - ₹18,00,000',
    requiredDegree: ["B.Tech", "B.E.", "M.Tech", "M.S."],
    acceptedBranches: ['Electronics & Communication', 'Electrical Engineering', 'Instrumentation', 'Computer Science'],
    experienceRequired: 0,
    skillsRequired: ['C++', 'Verilog', 'VLSI', 'Python', 'Microcontrollers', 'SystemVerilog'],
    preferredSkills: ['MATLAB', 'RTOS', 'Git'],
    postingDate: '2026-07-03',
    deadline: '2026-07-30',
    employmentType: 'Full-time',
    description: 'NVIDIA is hiring Graduate Engineer Trainees for our Silicon Validation team in Bangalore. You will participate in silicon bring-up, write test sequences in SystemVerilog, automate diagnostics workflows using Python, and troubleshoot embedded system boards.',
    companyOverview: 'NVIDIA pioneered GPU-accelerated computing and is a global leader in AI chips and software systems.',
    hiringTrends: 'Expanding early career program across Indian design centers. High conversion for electrical majors.',
    visaRequirement: 'Local Auth Required'
  },
  {
    id: 'secure-meters-get',
    company: 'Secure Meters',
    companyLogo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=128&auto=format&fit=crop&q=80',
    title: 'Graduate Engineer Trainee - Embedded Systems',
    jobId: 'SECURE-GET-891',
    applyUrl: 'https://careers.securemeters.com/jobs/embedded-get-mbm',
    atsPlatform: 'Company Career Page',
    location: 'Udaipur, Rajasthan',
    workMode: 'On-site',
    salary: '₹6,50,000 - ₹8,00,000',
    requiredDegree: ["B.Tech", "B.E.", "B.S."],
    acceptedBranches: ['Electrical Engineering', 'Electronics & Communication', 'Instrumentation'],
    experienceRequired: 0,
    skillsRequired: ['C', 'Microcontrollers', 'Power Electronics', 'AutoCAD', 'Control Systems'],
    preferredSkills: ['MATLAB', 'Arduino', 'LTSpice'],
    postingDate: '2026-07-04',
    deadline: '2026-08-01',
    employmentType: 'Full-time',
    description: 'Secure Meters is visiting MBM University and premier engineering campuses. We are seeking Embedded GETs to design industrial energy meters. You will configure microcontrollers, write optimized C firmware, and check power electronics layouts.',
    companyOverview: 'Secure Meters is a leading multinational smart energy solution provider headquartered in India.',
    hiringTrends: 'Primary campus recruiter for core branches in Rajasthan engineering institutions.',
    visaRequirement: 'Local Auth Required'
  },
  {
    id: 'alstom-control-get',
    company: 'Alstom',
    companyLogo: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=128&auto=format&fit=crop&q=80',
    title: 'GET - Control Systems & Automation',
    jobId: 'ALS-GET-4421',
    applyUrl: 'https://jobsearch.alstom.com/job/GET-Control-Systems',
    atsPlatform: 'Company Career Page',
    location: 'Vadodara, India',
    workMode: 'On-site',
    salary: '₹7,00,000 - ₹9,00,000',
    requiredDegree: ["B.Tech", "B.E."],
    acceptedBranches: ['Electrical Engineering', 'Instrumentation', 'Mechanical Engineering'],
    experienceRequired: 0,
    skillsRequired: ['PLC Programming', 'SCADA', 'AutoCAD', 'Control Systems', 'Electrical Engineering'],
    preferredSkills: ['MATLAB', 'Modbus', 'LabVIEW'],
    postingDate: '2026-07-03',
    deadline: '2026-07-28',
    employmentType: 'Full-time',
    description: 'Alstom is looking for young engineers to join our transport automation unit. You will collaborate on PLC systems configuration, draw wiring layouts in AutoCAD, and support SCADA telemetry integration for metro systems.',
    companyOverview: 'Alstom is a global leader in sustainable mobility and rail transport systems.',
    hiringTrends: 'Recruiting fresh talent for railway signaling and electrical grid infrastructure.',
    visaRequirement: 'Local Auth Required'
  },
  {
    id: 'qualcomm-early-career',
    company: 'Qualcomm',
    companyLogo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80',
    title: 'Embedded Software Engineer - Early Career',
    jobId: 'QCOM-EMB-1082',
    applyUrl: 'https://qualcomm.wd5.myworkdayjobs.com/QualcommCareers/early-career-embedded',
    atsPlatform: 'Workday',
    location: 'San Diego, CA',
    workMode: 'Hybrid',
    salary: '$105,000 - $135,000',
    requiredDegree: ["B.S.", "M.S.", "B.Tech", "M.Tech"],
    acceptedBranches: ['Computer Science', 'Electrical Engineering', 'Electronics & Communication'],
    experienceRequired: 1,
    skillsRequired: ['C', 'Embedded Systems', 'RTOS', 'Microcontrollers', 'Linux', 'Git'],
    preferredSkills: ['C++', 'Python', 'Oscilloscopes', 'CAN Bus'],
    postingDate: '2026-07-02',
    deadline: '2026-08-20',
    employmentType: 'Full-time',
    description: 'Work on Qualcomm Snapdragon firmware layers. You will debug low-level hardware modules, configure RTOS kernel tasks, and program interfaces in C for Wi-Fi and Bluetooth controllers.',
    companyOverview: 'Qualcomm is a global leader in wireless technology and mobile chipsets.',
    hiringTrends: 'Highly active hiring for wireless software, early career candidates.',
    visaRequirement: 'Sponsorship Available'
  },
  {
    id: 'schneider-graduate-rotational',
    company: 'Schneider Electric',
    companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80',
    title: 'Global Graduate Rotational Program - Energy Management',
    jobId: 'SCHN-GRAD-2026',
    applyUrl: 'https://schneider.greenhouse.io/jobs/global-graduate-rotational',
    atsPlatform: 'Greenhouse',
    location: 'Frankfurt, Germany',
    workMode: 'Hybrid',
    salary: '€55,000 - €62,000',
    requiredDegree: ["B.S.", "M.S.", "B.Tech", "M.Tech"],
    acceptedBranches: ['Electrical Engineering', 'Electronics & Communication', 'Power Systems'],
    experienceRequired: 0,
    skillsRequired: ['Power Electronics', 'Control Systems', 'AutoCAD', 'Electrical Engineering', 'Project Management'],
    preferredSkills: ['PLC Programming', 'SCADA', 'Python'],
    postingDate: '2026-07-01',
    deadline: '2026-07-25',
    employmentType: 'Full-time',
    description: 'Schneider Electric\'s Graduate Program offers EEE graduates three rotations across smart-grid management, power distribution engineering, and industrial automation control systems.',
    companyOverview: 'Schneider Electric is a global specialist in digital automation and energy management.',
    hiringTrends: 'Focusing on smart grid and carbon-neutral green power distribution networks.',
    visaRequirement: 'Sponsorship Available'
  },
  {
    id: 'l-t-control-trainee',
    company: 'Larsen & Toubro',
    companyLogo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=128&auto=format&fit=crop&q=80',
    title: 'Graduate Engineer Trainee - Power & Systems Group',
    jobId: 'LT-GET-2026-SYS',
    applyUrl: 'https://careers.lntecc.com/jobs/get-power-systems-mbm',
    atsPlatform: 'Company Career Page',
    location: 'Chennai, India',
    workMode: 'On-site',
    salary: '₹6,00,000 - ₹7,50,000',
    requiredDegree: ["B.Tech", "B.E."],
    acceptedBranches: ['Electrical Engineering', 'Electronics & Communication', 'Instrumentation'],
    experienceRequired: 0,
    skillsRequired: ['AutoCAD', 'Control Systems', 'Power Electronics', 'Electrical Engineering', 'Git'],
    preferredSkills: ['PLC Programming', 'MATLAB', 'System Engineering'],
    postingDate: '2026-07-02',
    deadline: '2026-07-25',
    employmentType: 'Full-time',
    description: 'L&T is recruiting EEE and ECE GETs. You will support grid layouts, design substation line diagrams using AutoCAD, and monitor PLC controller networks.',
    companyOverview: 'Larsen & Toubro is an Indian multinational conglomerate engaged in EPC projects, manufacturing, and services.',
    hiringTrends: 'A major core recruiter for GET positions across premier state engineering universities.',
    visaRequirement: 'Local Auth Required'
  }
];

export const mockSocialHiringPosts: SocialHiringPost[] = [
  {
    id: 'sp-1',
    recruiterName: 'Pranav Sharma',
    recruiterRole: 'Talent Acquisition Manager at Secure Meters',
    recruiterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    company: 'Secure Meters',
    content: 'We are hiring GETs for our Udaipur R&D center! Looking for EEE and ECE fresh graduates with basic familiarity in C firmware, microcontrollers, and AutoCAD schematic layout. If you are looking to build a career in smart grid and energy metering, send your resume to pranav.sharma@securemeters.com with subject "GET Embedded Udaipur".',
    postedTime: '2 hours ago',
    contactEmail: 'pranav.sharma@securemeters.com'
  },
  {
    id: 'sp-2',
    recruiterName: 'Elena Rostova',
    recruiterRole: 'Engineering Recruiter at Siemens Energy',
    recruiterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    company: 'Siemens Energy',
    content: 'Hey early-career engineers! My team at Siemens Energy is looking for Junior Control Systems Developers (0-1y experience). Location: Erlangen, Germany. Skills: PLC Programming, SCADA networks, and basic Python automation scripts. Visa sponsorship is available for outstanding candidates. Drop your portfolio / CV to elena.rostova@siemens-energy.com or DM directly.',
    postedTime: '5 hours ago',
    contactEmail: 'elena.rostova@siemens-energy.com'
  },
  {
    id: 'sp-3',
    recruiterName: 'Rajesh Nair',
    recruiterRole: 'Co-Founder at EmbeddedSystems Lab',
    recruiterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80',
    company: 'EmbeddedSystems Lab',
    content: 'We are a fast-growing smart-home automation startup in Pune! Hiring EEE/ECE Interns for 6 months. Requirements: Familiarity with Arduino platforms, basic soldering, reading circuit schematics, and clean C/C++ coding skills. High performance will lead to a full-time offer. Apply via rajesh@embedsystemslab.co.in.',
    postedTime: '1 day ago',
    contactEmail: 'rajesh@embedsystemslab.co.in'
  }
];
