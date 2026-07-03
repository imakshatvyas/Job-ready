import React, { useState } from 'react';
import { tailorResume, calculateMatch } from '../services/aiEngine';
import type { UserProfile } from '../services/aiEngine';
import { mockJobs } from '../data/jobs';
import { Sparkles, CheckCircle, FileDown, Layers } from 'lucide-react';


interface ResumeTailorProps {
  userProfile: UserProfile | null;
}

export const ResumeTailor: React.FC<ResumeTailorProps> = ({ userProfile }) => {
  const [selectedJobId, setSelectedJobId] = useState(mockJobs[0]?.id || '');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredProfile, setTailoredProfile] = useState<UserProfile | null>(null);

  const selectedJob = mockJobs.find(j => j.id === selectedJobId);

  const handleTailor = () => {
    if (!userProfile || !selectedJob) return;
    setIsTailoring(true);
    setTimeout(() => {
      const tailored = tailorResume(userProfile, selectedJob);
      setTailoredProfile(tailored);
      setIsTailoring(false);
    }, 1200);
  };

  const handleDownload = () => {
    if (!tailoredProfile || !selectedJob) return;
    
    // Create text file representing tailored resume
    const content = `
=========================================
TAILORED RESUME - OPTIMIZED FOR:
${selectedJob.company} - ${selectedJob.title}
=========================================

NAME: ${tailoredProfile.name}
EMAIL: ${tailoredProfile.email}
PHONE: ${tailoredProfile.phone}

EDUCATION:
- Degree: ${tailoredProfile.degree}
- Major: ${tailoredProfile.branch}
- Graduation: ${tailoredProfile.graduationYear}
- CGPA: ${tailoredProfile.cgpa}

SKILLS PROFILE (Optimized Keywords):
${tailoredProfile.skills.join(', ')}

PROJECTS (Tailored Bullet Points):
${tailoredProfile.projects.map(p => `
* ${p.title}
  Skills: ${p.skillsUsed.join(', ')}
  Description: ${p.description}
`).join('\n')}

CERTIFICATIONS:
${tailoredProfile.certifications.map(c => `* ${c}`).join('\n')}

ACHIEVEMENTS:
${tailoredProfile.achievements.map(a => `* ${a}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tailoredProfile.name.replace(/\s+/g, '_')}_tailored_${selectedJob.company.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!userProfile) {
    return (
      <div className="glass p-8 text-center rounded-2xl text-gray-400 text-sm max-w-lg mx-auto">
        Please load or create a Candidate Profile under the Resume Parser tab first to start tailoring.
      </div>
    );
  }

  const initialMatch = selectedJob ? calculateMatch(userProfile, selectedJob) : null;
  const tailoredMatch = (tailoredProfile && selectedJob) ? calculateMatch(tailoredProfile, selectedJob) : null;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" />
          AI Resume Tailoring Suite
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Optimize your project descriptions and highlight key skills to align perfectly with specific job descriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection Pane (Left) */}
        <div className="lg:col-span-1 glass p-5 rounded-2xl border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">Select Target Position</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Pick a seeded job:</label>
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setTailoredProfile(null);
                }}
                className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {mockJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.company} - {job.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
                <p className="text-xs font-bold text-white">{selectedJob.company}</p>
                <p className="text-[10px] text-gray-400">{selectedJob.location} • {selectedJob.workMode}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedJob.skillsRequired.map((s, idx) => (
                    <span key={idx} className="text-[9px] bg-white/5 text-gray-300 px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleTailor}
              disabled={isTailoring || !selectedJob}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-violet-600/20"
            >
              {isTailoring ? 'Generating optimizations...' : 'Tailor Resume Now'}
            </button>
          </div>
        </div>

        {/* Comparison and Output Pane (Right) */}
        <div className="lg:col-span-2 space-y-6">
          {tailoredProfile && selectedJob ? (
            <div className="glass rounded-2xl border-white/5 p-6 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Tailored Resume Ready
                  </h3>
                  <p className="text-xs text-gray-400">Match score increased from <span className="text-amber-400 font-bold">{initialMatch?.overallScore}%</span> to <span className="text-emerald-400 font-bold">{tailoredMatch?.overallScore}%</span>.</p>
                </div>
                <button
                  onClick={handleDownload}
                  className="py-2 px-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <FileDown className="w-4 h-4" />
                  Download Document
                </button>
              </div>

              {/* Bullet points comparison */}
              <div className="space-y-4 text-xs">
                <h4 className="font-semibold text-gray-300">Optimized Project Bullet Points</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                    <span className="text-[9px] bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded font-bold uppercase">Original Project description</span>
                    <p className="font-semibold text-white">{userProfile.projects[0]?.title || 'Project'}</p>
                    <p className="text-gray-400 leading-relaxed">{userProfile.projects[0]?.description || 'N/A'}</p>
                  </div>
                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">Tailored Description (High ATS coverage)</span>
                    <p className="font-semibold text-white">{tailoredProfile.projects[0]?.title || 'Project'}</p>
                    <p className="text-gray-300 leading-relaxed">{tailoredProfile.projects[0]?.description || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Skills injection review */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-gray-300">Added Keywords</h4>
                <p className="text-gray-400 text-[11px]">The following skills were aligned to match the employer search terms:</p>
                <div className="flex flex-wrap gap-1.5 p-3 bg-black/20 rounded-xl">
                  {tailoredProfile.skills.map((s, idx) => {
                    const isNew = !userProfile.skills.includes(s);
                    return (
                      <span 
                        key={idx} 
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          isNew 
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {s} {isNew && ' (Optimized)'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl border-white/5 p-12 flex flex-col items-center justify-center min-h-[300px]">
              <Layers className="w-12 h-12 text-gray-500 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Compare Tailored Outputs</h3>
              <p className="text-xs text-gray-400 mt-1 text-center max-w-sm">
                Select a target job and click "Tailor Resume Now" to view suggestions and optimized keyword coverage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
