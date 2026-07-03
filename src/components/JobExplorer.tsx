import React, { useState } from 'react';
import { mockJobs } from '../data/jobs';
import type { Job } from '../data/jobs';
import { calculateMatch, generateSuggestions } from '../services/aiEngine';
import type { UserProfile } from '../services/aiEngine';
import { Search, MapPin, Building, ExternalLink, Bookmark, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';


interface JobExplorerProps {
  userProfile: UserProfile | null;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  savedJobs: string[];
  toggleSaveJob: (jobId: string) => void;
  applications: Array<{ jobId: string; status: string }>;
  addApplication: (jobId: string, status: string) => void;
}

export const JobExplorer: React.FC<JobExplorerProps> = ({
  userProfile,
  selectedJob,
  setSelectedJob,
  savedJobs,
  toggleSaveJob,
  applications,
  addApplication
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAts, setFilterAts] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [minMatch, setMinMatch] = useState(0);

  // Compute matches
  const jobItems = mockJobs.map(job => {
    const match = userProfile ? calculateMatch(userProfile, job) : { overallScore: 0, explanation: [], satisfiedSkills: [], missingSkills: [] };
    return { job, match };
  });

  // Filter jobs
  const filteredJobs = jobItems.filter(({ job, match }) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAts = filterAts ? job.atsPlatform === filterAts : true;
    const matchesMode = filterMode ? job.workMode === filterMode : true;
    const matchesMatch = userProfile ? match.overallScore >= minMatch : true;

    return matchesSearch && matchesAts && matchesMode && matchesMatch;
  });

  const activeJobItem = selectedJob ? jobItems.find(ji => ji.job.id === selectedJob.id) : null;
  const activeMatch = activeJobItem ? activeJobItem.match : null;
  const activeSuggestions = (userProfile && selectedJob) ? generateSuggestions(userProfile, selectedJob) : null;

  const currentApp = selectedJob ? applications.find(app => app.jobId === selectedJob.id) : null;

  const handleApplyRedirect = (job: Job) => {
    // Add to applied status tracking automatically
    if (!applications.some(app => app.jobId === job.id)) {
      addApplication(job.id, 'Applied');
    }
    // Redirect to official career URL
    window.open(job.applyUrl, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Search and Filters */}
      <div className="glass p-4 rounded-2xl border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills (e.g. React, AutoCAD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterAts}
              onChange={(e) => setFilterAts(e.target.value)}
              className="px-3 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="">All ATS Platforms</option>
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lever">Lever</option>
              <option value="Workday">Workday</option>
              <option value="Ashby">Ashby</option>
              <option value="Company Career Page">Company Career Page</option>
            </select>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-3 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        {userProfile && (
          <div className="flex items-center gap-3 border-t border-white/5 pt-3">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Min Match Score:</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={minMatch} 
              onChange={(e) => setMinMatch(parseInt(e.target.value))}
              className="w-32 accent-violet-500"
            />
            <span className="text-xs text-violet-400 font-bold">{minMatch}% Match</span>
          </div>
        )}
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Jobs List (Left) */}
        <div className={`space-y-3 ${selectedJob ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-gray-400 font-semibold">{filteredJobs.length} Positions Found</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredJobs.map(({ job, match }) => {
              const isSaved = savedJobs.includes(job.id);
              const isSelected = selectedJob?.id === job.id;
              
              // Score badge coloring
              let scoreColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
              if (match.overallScore >= 70) {
                scoreColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              } else if (match.overallScore >= 50) {
                scoreColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              }

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected 
                      ? 'glass border-violet-500/50 shadow-md shadow-violet-500/5' 
                      : 'glass border-white/5 hover:border-white/10 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-tight">{job.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{job.company} • {job.location}</p>
                      </div>
                    </div>

                    {userProfile && (
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${scoreColor}`}>
                        {match.overallScore}% Match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-2">
                    <div className="flex gap-2">
                      <span className="bg-white/5 px-2 py-0.5 rounded-full">{job.workMode}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded-full">{job.employmentType}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className={`p-1 rounded-lg hover:bg-white/10 transition-all ${isSaved ? 'text-violet-400' : 'text-gray-400'}`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="glass p-12 rounded-xl text-center text-gray-400 text-sm">
                No jobs matching your filters. Try adjusting your search query or criteria.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Explanation View (Right) */}
        {selectedJob && (
          <div className="lg:col-span-7 glass rounded-2xl border-white/5 p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div className="flex items-start gap-4">
                <img src={selectedJob.companyLogo} alt={selectedJob.company} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{selectedJob.title}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-gray-500" />{selectedJob.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" />{selectedJob.location}</span>
                    <span className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">{selectedJob.atsPlatform}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1 rounded hover:bg-white/5"
              >
                Close
              </button>
            </div>

            {/* Core Info Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Salary Range</span>
                <p className="font-semibold text-white mt-0.5">{selectedJob.salary || 'Not disclosed'}</p>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Experience Required</span>
                <p className="font-semibold text-white mt-0.5">{selectedJob.experienceRequired === 0 ? 'Fresher (0y)' : `${selectedJob.experienceRequired} Years`}</p>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 rounded-xl col-span-2 md:col-span-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Job Type</span>
                <p className="font-semibold text-white mt-0.5">{selectedJob.employmentType}</p>
              </div>
            </div>

            {/* AI Match Explanation Panel */}
            {userProfile && activeMatch && activeSuggestions && (
              <div className="p-5 bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border border-violet-500/20 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    AI Eligibility Verification
                  </h4>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">Calculated Match</span>
                    <p className="text-lg font-black text-emerald-400 leading-none">{activeMatch.overallScore}%</p>
                  </div>
                </div>

                {/* Score Explanations */}
                <div className="space-y-1.5 text-xs">
                  {activeMatch.explanation.map((exp, i) => (
                    <div key={i} className="text-gray-300">
                      {exp}
                    </div>
                  ))}
                </div>

                {/* Missing Skills Alert */}
                {activeMatch.missingSkills.length > 0 && (
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex gap-3 text-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-300">Missing Core Skills</p>
                      <p className="text-rose-200/80 mt-0.5">{activeMatch.missingSkills.join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Resume Improvements recommendations */}
                {activeSuggestions.suggestions.length > 0 && (
                  <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-xs space-y-2">
                    <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
                      Wording & ATS suggestions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 pl-1">
                      {activeSuggestions.suggestions.slice(0, 3).map((sug, i) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Job Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Job Description</h4>
              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-4">
              <button
                onClick={() => handleApplyRedirect(selectedJob)}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs flex justify-center items-center gap-2 shadow-lg shadow-violet-600/20 transition-all"
              >
                Apply on Official Career Page
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleSaveJob(selectedJob.id)}
                className={`py-3 px-4 border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  savedJobs.includes(selectedJob.id) 
                    ? 'border-violet-500 bg-violet-500/10 text-violet-300' 
                    : 'border-white/10 hover:bg-white/5 text-gray-300'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save'}
              </button>

              <select
                value={currentApp?.status || 'Track'}
                onChange={(e) => addApplication(selectedJob.id, e.target.value)}
                className="px-3 py-3 border border-white/10 bg-black/20 hover:bg-white/5 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="Track" disabled>Track Status</option>
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
