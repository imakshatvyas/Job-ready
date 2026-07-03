import React, { useState } from 'react';
import { Award, GraduationCap, Flame, ArrowUpRight } from 'lucide-react';
import { mockJobs } from '../data/jobs';
import type { Job } from '../data/jobs';


interface PlacementInsightsProps {
  setActiveTab: (tab: string) => void;
  setSelectedJob: (job: Job) => void;
}

export const PlacementInsights: React.FC<PlacementInsightsProps> = ({
  setActiveTab,
  setSelectedJob
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState('MBM University');

  // Recruiters list for MBM
  const mbmPartners = [
    { name: 'Secure Meters', sector: 'Smart Energy / Metering', visits: 'Every September', hiringVolume: '15-20 Trainees', keyStack: ['C', 'Microcontrollers', 'Power Systems'] },
    { name: 'Alstom', sector: 'Transportation / Locomotives', visits: 'Every October', hiringVolume: '5-8 Trainees', keyStack: ['PLC Programming', 'SCADA', 'Control Systems'] },
    { name: 'Schneider Electric', sector: 'Digital Energy & Automation', visits: 'Every November', hiringVolume: '10-12 Trainees', keyStack: ['Power Electronics', 'AutoCAD', 'Electrical Systems'] },
    { name: 'UltraTech Cement', sector: 'Heavy Manufacturing', visits: 'Bi-annual', hiringVolume: '4-6 Trainees', keyStack: ['Instrumentation', 'Control Loops', 'AutoCAD'] },
    { name: 'ArcelorMittal', sector: 'Steel / Automation Plants', visits: 'Annual', hiringVolume: '6-8 Trainees', keyStack: ['SCADA', 'C++', 'Industrial Networks'] },
    { name: 'Apraava Energy', sector: 'Renewables / Green Grid', visits: 'Every December', hiringVolume: '3-5 Trainees', keyStack: ['Control Systems', 'Power Systems'] },
    { name: 'CESC Rajasthan', sector: 'Power Distribution', visits: 'Annual', hiringVolume: '5-10 Trainees', keyStack: ['Electrical Systems', 'Load Flow Analysis'] }
  ];

  // Match jobs in our database that are MBM partner companies
  const activePartnerJobs = mockJobs.filter(job => 
    mbmPartners.some(partner => job.company.toLowerCase() === partner.name.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            University Placement Insights
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Analyze historical recruitment data, recurring recruiters, and tailored suggestions for your campus.
          </p>
        </div>

        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
        >
          <option value="MBM University">MBM University (Jodhpur)</option>
          <option value="IIT Jodhpur">IIT Jodhpur (Guest Mode)</option>
          <option value="BITS Pilani">BITS Pilani (Guest Mode)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruiter Priority list (Left) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-violet-400" />
            MBM University Recruitment Partners
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mbmPartners.map((partner, idx) => (
              <div key={idx} className="glass p-4 rounded-xl border-white/5 flex flex-col justify-between gap-3 hover:border-white/10 transition-all">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-white leading-tight">{partner.name}</h4>
                    <span className="text-[9px] bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded font-semibold uppercase">
                      {partner.sector}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-gray-400">
                    <div>
                      <span className="block text-[8px] text-gray-500 uppercase">Recruitment Cycle</span>
                      <span className="font-medium text-white">{partner.visits}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-gray-500 uppercase">Average Intake</span>
                      <span className="font-medium text-white">{partner.hiringVolume}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-2 flex flex-wrap gap-1">
                  {partner.keyStack.map((tech, tIdx) => (
                    <span key={tIdx} className="text-[8px] bg-white/5 text-gray-300 px-1.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campus Openings & Hiring Cycles (Right) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Partner Jobs */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Active Partner Postings
            </h3>
            
            <div className="space-y-3">
              {activePartnerJobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setActiveTab('jobs');
                  }}
                  className="p-3 bg-white/2 border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{job.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{job.company} • {job.location}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-violet-400 shrink-0" />
                </div>
              ))}

              {activePartnerJobs.length === 0 && (
                <div className="text-center text-gray-500 text-xs italic py-6">
                  No active openings from partner recruiters today. Check back later!
                </div>
              )}
            </div>
          </div>

          {/* Interview tips / placement resources */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              💡 Recruitment Tips & Community Notes
            </h3>
            
            <div className="space-y-3 mt-2">
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
                <span className="text-[9px] text-amber-400 font-bold uppercase">Secure Meters Selection</span>
                <p className="text-gray-300 leading-normal">
                  Focus heavily on basic microcontrollers, ADC conversion lines, and drawing schematic circuits in AutoCAD. Questions usually test circuit debugging.
                </p>
              </div>
              
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
                <span className="text-[9px] text-amber-400 font-bold uppercase">Alstom Technical Round</span>
                <p className="text-gray-300 leading-normal">
                  PLC ladder logic configurations (timers, counters) and control loop responses are key topics during selection cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
