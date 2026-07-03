import React, { useState } from 'react';
import { mockJobs } from '../data/jobs';
import type { Job } from '../data/jobs';
import { Building2, ExternalLink, Briefcase, TrendingUp, Wallet } from 'lucide-react';


interface CompanyBrowserProps {
  setActiveTab: (tab: string) => void;
  setSelectedJob: (job: Job) => void;
}

export const CompanyBrowser: React.FC<CompanyBrowserProps> = ({
  setActiveTab,
  setSelectedJob
}) => {
  const companies = Array.from(new Set(mockJobs.map(j => j.company)));
  const [selectedCompany, setSelectedCompany] = useState(companies[0] || 'Google');

  const companyJobs = mockJobs.filter(j => j.company === selectedCompany);
  const sampleJob = companyJobs[0];

  // Helper metadata based on companies
  const companyMetadata: Record<string, {
    overview: string;
    salaryRange: string;
    trends: string;
    skills: string[];
    careerUrl: string;
  }> = {
    Google: {
      overview: 'Google is a global technology leader focused on organizing the world\'s information and making it universally accessible and useful.',
      salaryRange: '$120,000 - $210,000',
      trends: 'Increasing demand for WebAssembly, machine learning UI integrations, and front-end system optimization.',
      skills: ['React', 'TypeScript', 'JavaScript', 'Algorithms', 'Go', 'Python'],
      careerUrl: 'https://careers.google.com'
    },
    Stripe: {
      overview: 'Stripe builds financial infrastructure for the internet, helping businesses of all sizes accept payments and manage transactions globally.',
      salaryRange: '$110,000 - $185,000',
      trends: 'Active expansion of infrastructure API products, focus on high-throughput backend architecture.',
      skills: ['Ruby', 'Go', 'Python', 'Docker', 'SQL', 'Git'],
      careerUrl: 'https://stripe.com/jobs'
    },
    SpaceX: {
      overview: 'SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded to revolutionize space transportation.',
      salaryRange: '$90,000 - $155,000',
      trends: 'Heavy focus on launchpad automation systems, safety-critical telemetry, and high-precision sensor systems.',
      skills: ['PLC Programming', 'AutoCAD', 'SCADA', 'Power Electronics', 'C++', 'MATLAB'],
      careerUrl: 'https://www.spacex.com/careers'
    },
    Tesla: {
      overview: 'Tesla designs and manufactures electric vehicles, battery energy storage from home to grid-scale, solar panels and solar roof tiles.',
      salaryRange: '$105,000 - $170,000',
      trends: 'Hiring heavily for Autopilot systems, battery manufacturing automation, and embedded firmware controls.',
      skills: ['C', 'C++', 'Microcontrollers', 'RTOS', 'MATLAB', 'Python'],
      careerUrl: 'https://www.tesla.com/careers'
    },
    Figma: {
      overview: 'Figma is a leading collaborative design tool that connects everyone in the design process to build better products, faster.',
      salaryRange: '$140,000 - $210,000',
      trends: 'Expanding multiplayer engine operations, WebAssembly compilation pipelines, and canvas performance testing.',
      skills: ['React', 'TypeScript', 'WebAssembly', 'Canvas API', 'Webpack'],
      careerUrl: 'https://www.figma.com/careers'
    },
    Netflix: {
      overview: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, and documentaries.',
      salaryRange: '$220,000 - $480,000',
      trends: 'Heavy optimization of global caching networks, CDN node routing systems, and high-performance microservices.',
      skills: ['Java', 'Spring Boot', 'Distributed Systems', 'AWS', 'NoSQL', 'System Design'],
      careerUrl: 'https://jobs.netflix.com'
    },
    HashiCorp: {
      overview: 'HashiCorp is a leader in multi-cloud infrastructure automation software. Our software suite enables organizations to provision, secure, connect, and run application environments.',
      salaryRange: '$95,000 - $145,000',
      trends: 'Growing client adoption of managed cloud services (HCP), active hiring for Go and security-oriented positions.',
      skills: ['Go', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Vault'],
      careerUrl: 'https://www.hashicorp.com/jobs'
    }
  };

  const meta = companyMetadata[selectedCompany] || {
    overview: 'Innovative tech organization offering career growth and creative challenges.',
    salaryRange: 'Competitive',
    trends: 'Steady expansion in engineering departments.',
    skills: ['JavaScript', 'System Design'],
    careerUrl: '#'
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-violet-400" />
          Company Profiles & Hiring Trends
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Explore profile details, typical compensation, frequently requested stacks, and current active openings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Company Sidebar List */}
        <div className="lg:col-span-1 glass p-4 rounded-2xl border-white/5 space-y-1">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-2">Hiring Organizations</span>
          <div className="space-y-1 mt-2">
            {companies.map(comp => {
              const isActive = comp === selectedCompany;
              return (
                <button
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-500/20 text-white border-l-3 border-violet-500'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Details Pane */}
        <div className="lg:col-span-3 glass p-6 rounded-2xl border-white/5 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/5 pb-5">
            <div className="flex items-center gap-4">
              {sampleJob && (
                <img 
                  src={sampleJob.companyLogo} 
                  alt={selectedCompany} 
                  className="w-14 h-14 rounded-2xl object-cover border border-white/5 shadow-md" 
                />
              )}
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCompany}</h3>
                <a
                  href={meta.careerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 mt-1 transition-all"
                >
                  Visit Official Career Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Grid Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/2 border border-white/5 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Average Engineering Salary</span>
              </div>
              <p className="font-bold text-white text-sm mt-1">{meta.salaryRange}</p>
            </div>

            <div className="bg-white/2 border border-white/5 p-4 rounded-xl space-y-1 md:col-span-2">
              <div className="flex items-center gap-1.5 text-gray-400">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <span>Hiring & Technology Trends</span>
              </div>
              <p className="text-gray-300 leading-normal mt-1">{meta.trends}</p>
            </div>
          </div>

          {/* Overview text */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">About the Company</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{meta.overview}</p>
          </div>

          {/* Requested stack */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Frequently Requested Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {meta.skills.map((skill, idx) => (
                <span key={idx} className="bg-white/5 text-gray-300 px-2.5 py-1 rounded-lg text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Active Career Openings */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Active Job Postings
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companyJobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setActiveTab('jobs');
                  }}
                  className="p-3 bg-white/2 border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer space-y-2"
                >
                  <p className="text-xs font-bold text-white leading-tight">{job.title}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>{job.location} • {job.workMode}</span>
                    <span className="text-indigo-400 font-semibold">{job.employmentType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
