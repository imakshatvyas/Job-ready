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
    requiredDegree: ["B.Tech", "B.E.", "M.S.", "BS", "MS", "B.S."],
    acceptedBranches: ['Computer Science', 'Information Technology', 'Software Engineering', 'Electrical Engineering'],
    experienceRequired: 0, // Freshers eligible
    skillsRequired: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Algorithms', 'Data Structures'],
    preferredSkills: ['Next.js', 'Web Performance Optimization', 'Node.js', 'Figma'],
    postingDate: '2026-07-02',
    deadline: '2026-08-15',
    employmentType: 'Full-time',
    description: 'As a Software Engineer in the Front End team, you will build user interfaces that empower users around the globe. You will work closely with designers, product managers, and other engineers to deliver high-quality, performant web applications using modern web standards.',
    companyOverview: 'Google is a global technology leader focused on improving the ways people connect with information.',
    hiringTrends: 'Highly active hiring for early career talent in front-end and full-stack positions.'
  },
  {
    id: 'stripe-swe-intern',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    title: 'Software Engineering Intern (Fall 2026)',
    jobId: 'STRIPE-INT-4821',
    applyUrl: 'https://jobs.lever.co/stripe/software-engineering-intern',
    atsPlatform: 'Lever',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    salary: '$45 - $55 / hour',
    requiredDegree: ["B.Tech", "B.E.", "B.S.", "M.S.", "BS", "MS"],
    acceptedBranches: ['Computer Science', 'Information Technology', 'Mathematics', 'Data Science'],
    experienceRequired: 0,
    skillsRequired: ['Ruby', 'Python', 'Go', 'SQL', 'Git', 'Problem Solving'],
    preferredSkills: ['Distributed Systems', 'Docker', 'REST APIs'],
    postingDate: '2026-07-03',
    deadline: '2026-07-20',
    employmentType: 'Internship',
    description: 'Stripe is looking for curious, collaborative software engineering interns to join our teams. You will work on real projects that directly impact Stripe customers, from payment processing reliability to building developer tools.',
    companyOverview: 'Stripe is a financial infrastructure platform for the internet.',
    hiringTrends: 'Strong conversion rate from internship to full-time roles. Focus on high technical rigor.'
  },
  {
    id: 'spacex-ctrl-eng',
    company: 'SpaceX',
    companyLogo: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=128&auto=format&fit=crop&q=80',
    title: 'Controls Engineer',
    jobId: 'SPX-CTRL-442',
    applyUrl: 'https://spacex.workdayjobs.com/SpaceX_Careers/controls-engineer-automation',
    atsPlatform: 'Workday',
    location: 'Brownsville, TX (Starbase)',
    workMode: 'On-site',
    salary: '$95,000 - $130,000',
    requiredDegree: ["B.Tech", "B.E.", "B.S.", "M.S."],
    acceptedBranches: ['Electrical Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Instrumentation'],
    experienceRequired: 1,
    skillsRequired: ['PLC Programming', 'AutoCAD', 'SCADA', 'Power Electronics', 'C++', 'Control Systems'],
    preferredSkills: ['MATLAB', 'Arduino', 'LabVIEW', 'Python'],
    postingDate: '2026-07-01',
    deadline: '2026-08-30',
    employmentType: 'Full-time',
    description: 'Join the launch engineering team to design, program, and commission launchpad control networks. You will write PLC code, design electrical schematics in AutoCAD, and integrate SCADA systems to ensure rockets can launch safely and efficiently.',
    companyOverview: 'SpaceX designs, manufactures, and launches advanced rockets and spacecraft.',
    hiringTrends: 'Focusing on aerospace controls and hardware-in-the-loop automation setups.'
  },
  {
    id: 'tesla-embedded-1',
    company: 'Tesla',
    companyLogo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=128&auto=format&fit=crop&q=80',
    title: 'Embedded Systems Developer',
    jobId: 'TSLA-EMB-883',
    applyUrl: 'https://careers.tesla.com/job/embedded-systems-autopilot',
    atsPlatform: 'Company Career Page',
    location: 'Palo Alto, CA',
    workMode: 'On-site',
    salary: '$110,000 - $145,000',
    requiredDegree: ["B.Tech", "B.E.", "B.S.", "M.Tech", "M.S."],
    acceptedBranches: ['Computer Science', 'Electrical Engineering', 'Electronics & Communication', 'Robotics'],
    experienceRequired: 2,
    skillsRequired: ['C', 'C++', 'Microcontrollers', 'Embedded Systems', 'RTOS', 'Python'],
    preferredSkills: ['MATLAB', 'CAN Bus', 'Oscilloscopes', 'Arduino'],
    postingDate: '2026-06-28',
    deadline: '2026-07-15',
    employmentType: 'Full-time',
    description: 'Work on Tesla Autopilot and low-level firmware. You will write highly optimized C/C++ firmware, debug microcontrollers, and work with real-time operating systems (RTOS) to deliver next-generation autonomous vehicle technology.',
    companyOverview: 'Tesla accelerates the world transition to sustainable energy through electric vehicles and clean power solutions.',
    hiringTrends: 'Consistently hiring embedded and hardware-centric developers for Autopilot and Powerpack teams.'
  },
  {
    id: 'figma-frontend-dev',
    company: 'Figma',
    companyLogo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=128&auto=format&fit=crop&q=80',
    title: 'Frontend Engineer - Editor UI',
    jobId: 'FIGMA-EDIT-901',
    applyUrl: 'https://boards.greenhouse.io/figma/jobs/editor-ui-frontend',
    atsPlatform: 'Greenhouse',
    location: 'New York, NY',
    workMode: 'Remote',
    salary: '$150,000 - $190,000',
    requiredDegree: ["B.S.", "M.S.", "B.Tech", "B.E."],
    acceptedBranches: ['Computer Science', 'Software Engineering', 'Design Computing'],
    experienceRequired: 3,
    skillsRequired: ['React', 'TypeScript', 'WebAssembly', 'Canvas API', 'Webpack', 'CSS Modules'],
    preferredSkills: ['Figma API', 'Three.js', 'Performance Profiling'],
    postingDate: '2026-07-02',
    deadline: '2026-08-01',
    employmentType: 'Full-time',
    description: 'Build the core rendering and user interface controls of the Figma design editor. Optimize frame rates, integrate WebAssembly engines, and create beautiful, responsive controls that designers use daily.',
    companyOverview: 'Figma is a collaborative web application for interface design.',
    hiringTrends: 'Highly remote-friendly, looking for strong system architecture and layout designers.'
  },
  {
    id: 'netflix-backend-swe',
    company: 'Netflix',
    companyLogo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?w=128&auto=format&fit=crop&q=80',
    title: 'Senior Distributed Systems Engineer',
    jobId: 'NFLX-SR-BACK',
    applyUrl: 'https://netflix.wd1.myworkdayjobs.com/NetflixCareers/senior-backend',
    atsPlatform: 'Workday',
    location: 'Los Gatos, CA',
    workMode: 'Hybrid',
    salary: '$280,000 - $450,000',
    requiredDegree: ["B.S.", "M.S.", "Ph.D.", "B.Tech", "M.Tech"],
    acceptedBranches: ['Computer Science', 'Computer Engineering'],
    experienceRequired: 5,
    skillsRequired: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'Distributed Systems', 'NoSQL', 'System Design'],
    preferredSkills: ['GraphQL', 'Kubernetes', 'Apache Kafka'],
    postingDate: '2026-06-25',
    deadline: '2026-07-30',
    employmentType: 'Full-time',
    description: 'Design and operate Netflix high-throughput content delivery microservices. Architect fault-tolerant distributed databases, deploy global caches on AWS, and improve latency profiles for millions of simultaneous viewers.',
    companyOverview: 'Netflix is the world leading entertainment streaming service.',
    hiringTrends: 'Highly selective hiring focusing heavily on senior level engineers with distributed systems expertise.'
  },
  {
    id: 'hashicorp-cloud-eng',
    company: 'HashiCorp',
    companyLogo: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=128&auto=format&fit=crop&q=80',
    title: 'Cloud Infrastructure Associate',
    jobId: 'HASHI-CLD-102',
    applyUrl: 'https://ashbyhq.com/hashicorp/jobs/cloud-associate',
    atsPlatform: 'Ashby',
    location: 'Remote (US/Canada)',
    workMode: 'Remote',
    salary: '$85,000 - $115,000',
    requiredDegree: ["B.S.", "B.Tech", "B.E.", "BCA", "MCA"],
    acceptedBranches: ['Computer Science', 'Information Technology', 'Computer Applications'],
    experienceRequired: 1,
    skillsRequired: ['Go', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Git'],
    preferredSkills: ['AWS', 'Consul', 'Vault', 'CI/CD'],
    postingDate: '2026-07-03',
    deadline: '2026-07-28',
    employmentType: 'Full-time',
    description: 'Help develop and operate HashiCorp Cloud Platform (HCP). Write Go microservices, build infrastructure modules using Terraform, and deploy containerized workloads using Kubernetes.',
    companyOverview: 'HashiCorp provides infrastructure automation software for multi-cloud environments.',
    hiringTrends: 'Actively building out cloud platforms, focusing on graduates with Docker and Terraform interest.'
  }
];
