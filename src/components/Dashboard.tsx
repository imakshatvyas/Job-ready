import React from 'react';
import { calculateAtsScore, calculateMatch } from '../services/aiEngine';
import type { UserProfile } from '../services/aiEngine';
import { mockJobs } from '../data/jobs';
import type { Job } from '../data/jobs';
import { Sparkles, TrendingUp, ArrowRight, ArrowUpRight, Flame, MapPin, Clock, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  userProfile: UserProfile | null;
  setActiveTab: (tab: string) => void;
  setSelectedJob: (job: Job) => void;
  applications: Array<{ jobId: string; status: string; notes?: string }>;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userProfile, 
  setActiveTab,
  setSelectedJob,
  applications 
}) => {
  if (!userProfile) {
    return (
      <div className="glass rounded-3xl border-white/5 p-12 text-center max-w-2xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome to OptiJob AI
        </h2>
        <p className="text-gray-400 mt-2 text-sm leading-relaxed">
          The ultimate AI eligibility engine designed to screen matching career roles, detail ATS gaps, and tailor resumes. Load a profile to get started!
        </p>
        <button
          onClick={() => setActiveTab('resume')}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/30"
        >
          Load/Upload Resume
        </button>
      </div>
    );
  }

  // Calculate ATS metrics
  const atsMetrics = calculateAtsScore(userProfile);
  
  // Calculate matches
  const jobMatches = mockJobs.map(job => ({
    job,
    match: calculateMatch(userProfile, job)
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  const matchedCount = jobMatches.filter(jm => jm.match.overallScore >= 50).length;

  // 1. 🔥 New Jobs Today (posted on 2026-07-04)
  const newJobsToday = jobMatches.filter(jm => jm.job.postingDate === '2026-07-04');

  // 2. ⭐ Best Matches (Score >= 75%)
  const bestMatches = jobMatches.filter(jm => jm.match.overallScore >= 75);

  // 3. 📍 Jobs Near Preferred Location (e.g. India/USA based on branch/university)
  const nearbyJobs = jobMatches.filter(jm => 
    jm.job.location.toLowerCase().includes('india') || 
    jm.job.location.toLowerCase().includes('bengaluru')
  );

  // 4. ⏰ Closing Soon (deadline <= 2026-07-15)
  const closingSoon = jobMatches.filter(jm => 
    jm.job.deadline && new Date(jm.job.deadline) <= new Date('2026-07-20')
  );

  // Build skill demand counts based on current job database
  const skillCountMap: Record<string, number> = {};
  mockJobs.forEach(job => {
    job.skillsRequired.forEach(skill => {
      skillCountMap[skill] = (skillCountMap[skill] || 0) + 1;
    });
  });

  const skillData = Object.entries(skillCountMap)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / mockJobs.length) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Top Banner with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-violet-400 font-semibold tracking-wider uppercase">Candidate Profile</span>
            <h3 className="text-lg font-bold text-white mt-1 truncate">{userProfile.name}</h3>
            <p className="text-xs text-gray-400">{userProfile.degree} in {userProfile.branch}</p>
          </div>
          <button 
            onClick={() => setActiveTab('resume')}
            className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 mt-4 transition-all"
          >
            Edit Profile <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ATS Score */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">ATS Compatibility</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{atsMetrics.overall}%</span>
              <span className="text-xs text-emerald-400 font-medium">Optimal</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Parser compatibility rank</p>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${atsMetrics.overall}%` }} />
          </div>
        </div>

        {/* Matched Jobs */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Eligible Matches</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{matchedCount}</span>
              <span className="text-xs text-gray-400">/ {mockJobs.length} total</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Matches scoring &gt;= 50%</p>
          </div>
          <button 
            onClick={() => setActiveTab('jobs')}
            className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 mt-4 transition-all"
          >
            Explore matches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tracked Applications */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Active Tracker</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{applications.length}</span>
              <span className="text-xs text-gray-400">submitted</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Interviews & assessments</p>
          </div>
          <button 
            onClick={() => setActiveTab('tracker')}
            className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 mt-4 transition-all"
          >
            View board <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Priority Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Double-Column (High Matches & New Today) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🔥 New Today */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              New Jobs Today
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {newJobsToday.slice(0, 4).map(({ job, match }) => (
                <div 
                  key={job.id} 
                  onClick={() => {
                    setSelectedJob(job);
                    setActiveTab('jobs');
                  }}
                  className="glass p-4 rounded-xl border-white/5 flex justify-between items-center cursor-pointer hover:border-white/10 hover:translate-y-[-1px] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <img src={job.companyLogo} alt={job.company} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate max-w-[150px]">{job.title}</h4>
                      <p className="text-[10px] text-gray-400">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
                    {match.overallScore}%
                  </span>
                </div>
              ))}
              {newJobsToday.length === 0 && (
                <div className="col-span-2 glass p-4 text-center text-gray-500 text-xs italic">
                  No new jobs aggregated today yet. Check back shortly!
                </div>
              )}
            </div>
          </div>

          {/* ⭐ Best Matches */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-violet-400" />
              Best Profile Matches
            </h3>
            <div className="space-y-2.5">
              {bestMatches.slice(0, 3).map(({ job, match }) => (
                <div 
                  key={job.id} 
                  className="glass p-4 rounded-xl border-white/5 flex justify-between items-center hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                      <p className="text-xs text-gray-400">{job.company} • {job.location} • {job.workMode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 uppercase font-semibold">Match Score</span>
                      <p className="text-sm font-bold text-emerald-400">{match.overallScore}%</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveTab('jobs');
                      }}
                      className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Closing Soon & Location match) */}
        <div className="lg:col-span-1 space-y-6">
          {/* 📍 Jobs Near Preferred Location */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Nearby / Domestic Roles
            </h3>
            <div className="space-y-2">
              {nearbyJobs.slice(0, 2).map(({ job }) => (
                <div 
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setActiveTab('jobs');
                  }}
                  className="p-2.5 bg-white/2 hover:bg-white/5 rounded-xl border border-white/5 cursor-pointer transition-all"
                >
                  <p className="text-xs font-bold text-white leading-tight">{job.title}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{job.company} • {job.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ⏰ Closing Soon */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              Closing Soon
            </h3>
            <div className="space-y-2">
              {closingSoon.map(({ job }) => (
                <div 
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setActiveTab('jobs');
                  }}
                  className="p-2.5 bg-white/2 hover:bg-white/5 rounded-xl border border-white/5 cursor-pointer transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{job.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{job.company}</p>
                  </div>
                  <span className="text-[9px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                    Ends {job.deadline}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill demand metrics */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Market Skill Demand
            </h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0e1322', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontSize: 10 }}
                    itemStyle={{ color: '#818cf8', fontSize: 10 }}
                  />
                  <Bar dataKey="percentage" fill="url(#colorSkill)" radius={4} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
