import React, { useState } from 'react';
import { mockJobs, mockSocialHiringPosts } from '../data/jobs';
import type { Job } from '../data/jobs';
import { calculateMatch, generateSuggestions } from '../services/aiEngine';
import type { UserProfile } from '../services/aiEngine';
import { Search, MapPin, Building, ExternalLink, Bookmark, ShieldAlert, Sparkles, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Mail, Share2 } from 'lucide-react';

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
  const [filterVisa, setFilterVisa] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'social'>('listings');
  const [socialFilter, setSocialFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Compute matches
  const jobItems = mockJobs.map(job => {
    const match = userProfile ? calculateMatch(userProfile, job) : { overallScore: 0, explanation: [], satisfiedSkills: [], missingSkills: [], satisfiedPreferred: [] };
    return { job, match };
  });

  // Filter jobs
  const filteredJobs = jobItems.filter(({ job, match }) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAts = filterAts ? job.atsPlatform === filterAts : true;
    const matchesMode = filterMode ? job.workMode === filterMode : true;
    const matchesVisa = filterVisa ? job.visaRequirement === filterVisa : true;
    const matchesMatch = userProfile ? match.overallScore >= minMatch : true;

    return matchesSearch && matchesAts && matchesMode && matchesVisa && matchesMatch;
  });

  // Filter social posts
  const filteredSocial = mockSocialHiringPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.recruiterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = socialFilter ? post.type === socialFilter : true;
    return matchesSearch && matchesType;
  });

  // Paginated jobs calculation
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const activeJobItem = selectedJob ? jobItems.find(ji => ji.job.id === selectedJob.id) : null;
  const activeMatch = activeJobItem ? activeJobItem.match : null;
  const activeSuggestions = (userProfile && selectedJob) ? generateSuggestions(userProfile, selectedJob) : null;

  const currentApp = selectedJob ? applications.find(app => app.jobId === selectedJob.id) : null;

  const handleApplyRedirect = (job: Job) => {
    if (!applications.some(app => app.jobId === job.id)) {
      addApplication(job.id, 'Applied');
    }
    window.open(job.applyUrl, '_blank');
  };

  // Compose pre-filled email client (mailto:)
  const handleEmailResume = (post: any) => {
    const subject = encodeURIComponent(`Application for GET / Early Career Role - ${post.company}`);
    const body = encodeURIComponent(
      `Dear ${post.recruiterName},\n\n` +
      `I saw your recent LinkedIn post regarding the open hiring cycle at ${post.company} and would love to be considered.\n\n` +
      `My Profile:\n` +
      `- Degree: ${userProfile?.degree || 'B.Tech'}\n` +
      `- Specialization: ${userProfile?.branch || 'Engineering'}\n` +
      `- Key Skills: ${(userProfile?.skills || []).slice(0, 5).join(', ')}\n\n` +
      `Please find my credentials and resume details attached. Looking forward to your response!\n\n` +
      `Best regards,\n` +
      `${userProfile?.name || 'Applicant'}`
    );
    window.location.href = `mailto:${post.contactEmail}?subject=${subject}&body=${body}`;
  };

  const getCompetitiveness = (score: number) => {
    if (score >= 80) return { label: 'High Competitiveness', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 60) return { label: 'Moderate Competitiveness', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Low Competitiveness', color: 'text-gray-400 bg-white/5 border-white/10' };
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Sub Tabs */}
      <div className="flex border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveSubTab('listings')}
          className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 ${
            activeSubTab === 'listings' 
              ? 'border-violet-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Official Job Listings
        </button>
        <button
          onClick={() => setActiveSubTab('social')}
          className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === 'social' 
              ? 'border-violet-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          LinkedIn Recruiter Posts
          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">New Feed</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass p-4 rounded-2xl border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={activeSubTab === 'listings' ? "Search jobs by title, company, or skills (e.g. React, AutoCAD)..." : "Search social posts..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset pagination on search
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          
          {activeSubTab === 'listings' ? (
            <div className="flex flex-wrap gap-2">
              <select
                value={filterAts}
                onChange={(e) => { setFilterAts(e.target.value); setCurrentPage(1); }}
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
                onChange={(e) => { setFilterMode(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={filterVisa}
                onChange={(e) => { setFilterVisa(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="">All Authorization</option>
                <option value="Local Auth Required">Local Auth Required</option>
                <option value="Sponsorship Available">Sponsorship Available</option>
              </select>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={socialFilter}
                onChange={(e) => setSocialFilter(e.target.value)}
                className="px-3 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="">All Social Types</option>
                <option value="Referral">Referrals</option>
                <option value="Hiring">Hiring Announcements</option>
                <option value="Internship">Internship Offers</option>
                <option value="Graduate Program">Graduate Schemes</option>
              </select>
            </div>
          )}
        </div>

        {userProfile && activeSubTab === 'listings' && (
          <div className="flex items-center gap-3 border-t border-white/5 pt-3">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Min Match Score:</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={minMatch} 
              onChange={(e) => { setMinMatch(parseInt(e.target.value)); setCurrentPage(1); }}
              className="w-32 accent-violet-500"
            />
            <span className="text-xs text-violet-400 font-bold">{minMatch}% Match</span>
          </div>
        )}
      </div>

      {activeSubTab === 'listings' ? (
        /* Listings Split View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Jobs List (Left) */}
          <div className={`space-y-3 ${selectedJob ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-gray-400 font-semibold">{filteredJobs.length} Positions Found</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {currentJobs.map(({ job, match }) => {
                const isSaved = savedJobs.includes(job.id);
                const isSelected = selectedJob?.id === job.id;
                
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

                    <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-white/5 pt-2">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="bg-white/5 px-2 py-0.5 rounded-full">{job.workMode}</span>
                        {job.visaRequirement && (
                          <span className={`px-2 py-0.5 rounded-full ${
                            job.visaRequirement === 'Sponsorship Available' 
                              ? 'bg-emerald-500/10 text-emerald-300' 
                              : 'bg-white/5 text-gray-400'
                          }`}>
                            {job.visaRequirement}
                          </span>
                        )}
                      </div>
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
                );
              })}

              {filteredJobs.length === 0 && (
                <div className="glass p-12 rounded-xl text-center text-gray-400 text-sm">
                  No jobs matching your filters.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4 px-1 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-white/5 disabled:opacity-40 hover:bg-white/10 rounded-lg text-white font-semibold transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 bg-white/5 disabled:opacity-40 hover:bg-white/10 rounded-lg text-white font-semibold transition-all flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-semibold">Salary Range</span>
                  <p className="font-semibold text-white mt-0.5">{selectedJob.salary || 'Not disclosed'}</p>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-semibold">Experience</span>
                  <p className="font-semibold text-white mt-0.5">{selectedJob.experienceRequired === 0 ? 'Fresher (0y)' : `${selectedJob.experienceRequired} Years`}</p>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-semibold">Work Mode</span>
                  <p className="font-semibold text-white mt-0.5">{selectedJob.workMode}</p>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-[9px] text-gray-500 uppercase font-semibold">Authorization</span>
                  <p className="font-semibold text-white mt-0.5 truncate">{selectedJob.visaRequirement || 'Not Specified'}</p>
                </div>
              </div>

              {/* AI Match Explanation Panel */}
              {userProfile && activeMatch && activeSuggestions && (
                <div className="p-5 bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border border-violet-500/20 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      AI Eligibility Analysis
                    </h4>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Match Score</span>
                      <p className="text-lg font-black text-emerald-400 leading-none">{activeMatch.overallScore}%</p>
                    </div>
                  </div>

                  {/* Competitiveness Estimate */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Estimated Placement Rank:</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getCompetitiveness(activeMatch.overallScore).color}`}>
                      {getCompetitiveness(activeMatch.overallScore).label}
                    </span>
                  </div>

                  {/* Score Explanations */}
                  <div className="space-y-1.5 text-xs">
                    {activeMatch.explanation.map((exp, i) => (
                      <div key={i} className="text-gray-300">
                        {exp}
                      </div>
                    ))}
                  </div>

                  {/* Project Alignment Highlights */}
                  {userProfile.projects.length > 0 && (
                    <div className="bg-white/2 border border-white/5 p-3 rounded-xl space-y-2 text-xs">
                      <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                        Relevant Project Match:
                      </p>
                      <p className="text-gray-300 leading-normal">
                        Your project <strong className="text-white">"{userProfile.projects[0].title}"</strong> matches skills required for this role.
                      </p>
                    </div>
                  )}

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
                        Aesthetics & ATS Suggestions:
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
      ) : (
        /* LinkedIn Recruiter Social Posts List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSocial.map(post => (
            <div key={post.id} className="glass p-5 rounded-2xl border-white/5 space-y-4 flex flex-col justify-between hover:border-white/10 transition-all duration-200">
              <div>
                {/* Author Info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={post.recruiterAvatar} alt={post.recruiterName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{post.recruiterName}</h4>
                      <p className="text-[9px] text-gray-400 mt-0.5">{post.recruiterRole}</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                    {post.type}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-gray-300 leading-relaxed mt-4 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-white/5 pt-3 mt-4 text-[10px]">
                {post.contactEmail ? (
                  <button
                    onClick={() => handleEmailResume(post)}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Draft Email Resume
                  </button>
                ) : (
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold flex items-center justify-center gap-1 border border-white/10 text-center"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    View Original Post
                  </a>
                )}
                <span className="text-gray-500 self-center px-1">
                  {post.postedTime}
                </span>
              </div>
            </div>
          ))}

          {filteredSocial.length === 0 && (
            <div className="col-span-2 glass p-12 text-center text-gray-500 text-xs italic">
              No matching recruiter posts found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
