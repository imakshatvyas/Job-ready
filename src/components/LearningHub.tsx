import React from 'react';
import { calculateMatch } from '../services/aiEngine';
import type { UserProfile } from '../services/aiEngine';
import { mockJobs } from '../data/jobs';
import { GraduationCap, Award, Clock, ExternalLink } from 'lucide-react';


interface LearningHubProps {
  userProfile: UserProfile | null;
}

export const LearningHub: React.FC<LearningHubProps> = ({ userProfile }) => {
  if (!userProfile) {
    return (
      <div className="glass p-8 text-center rounded-2xl text-gray-400 text-sm max-w-lg mx-auto">
        Please load or create a Candidate Profile under the Resume Parser tab first to view learning suggestions.
      </div>
    );
  }

  // Find all missing skills across the database
  const missingSkillsMap: Record<string, number> = {};
  let matchedJobsCount = 0;

  mockJobs.forEach(job => {
    const match = calculateMatch(userProfile, job);
    if (match.overallScore >= 40) { // Relevant jobs
      matchedJobsCount++;
      match.missingSkills.forEach(skill => {
        missingSkillsMap[skill] = (missingSkillsMap[skill] || 0) + 1;
      });
    }
  });

  const missingSkillsList = Object.entries(missingSkillsMap)
    .map(([name, count]) => ({
      name,
      count,
      demandRatio: Math.round((count / (matchedJobsCount || 1)) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Recommendations with mock resources
  const courseDatabase: Record<string, Array<{ title: string; platform: string; duration: string; link: string }>> = {
    'PLC Programming': [
      { title: 'PLC Programming from Scratch', platform: 'Udemy', duration: '8.5 Hours', link: 'https://www.udemy.com' },
      { title: 'Introduction to Industrial Automation', platform: 'Coursera (UC Boulder)', duration: '12 Hours', link: 'https://www.coursera.org' }
    ],
    'AutoCAD': [
      { title: 'AutoCAD 2026 Complete Guide', platform: 'LinkedIn Learning', duration: '6 Hours', link: 'https://www.linkedin.com/learning' },
      { title: 'Autodesk Certified Professional Prep', platform: 'Coursera', duration: '15 Hours', link: 'https://www.coursera.org' }
    ],
    'SCADA': [
      { title: 'SCADA Systems Basics & Design', platform: 'Udemy', duration: '4 Hours', link: 'https://www.udemy.com' }
    ],
    'Docker': [
      { title: 'Docker for Web Developers', platform: 'Frontend Masters', duration: '5 Hours', link: 'https://frontendmasters.com' },
      { title: 'Docker & Kubernetes: The Practical Guide', platform: 'Academind', duration: '20 Hours', link: 'https://www.udemy.com' }
    ],
    'Kubernetes': [
      { title: 'Certified Kubernetes Administrator (CKA)', platform: 'KodeKloud', duration: '18 Hours', link: 'https://kodekloud.com' }
    ],
    'Go': [
      { title: 'Programming with Google Go', platform: 'Coursera (UCI)', duration: '14 Hours', link: 'https://www.coursera.org' },
      { title: 'Go Class for Beginners', platform: 'Google Open Source', duration: '4 Hours', link: 'https://go.dev/doc/tutorial/getting-started' }
    ],
    'TypeScript': [
      { title: 'Understanding TypeScript - 2026 Edition', platform: 'Udemy', duration: '15 Hours', link: 'https://www.udemy.com' }
    ],
    'System Design': [
      { title: 'Grokking the System Design Interview', platform: 'DesignGurus', duration: '10 Hours', link: 'https://www.designgurus.io' }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-violet-400" />
          Personalized Learning Hub
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Bridge your technical gaps by learning skills currently demanded by roles matching your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill gaps lists */}
        <div className="lg:col-span-1 glass p-5 rounded-2xl border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-amber-400" />
            Your Top Skill Gaps
          </h3>
          <p className="text-[11px] text-gray-400">Demand is calculated across the career opportunities in your pipeline.</p>

          <div className="space-y-3">
            {missingSkillsList.map(skill => (
              <div key={skill.name} className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{skill.name}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-semibold">
                    Requested in {skill.demandRatio}% of jobs
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div className="bg-amber-400 h-1 rounded-full" style={{ width: `${skill.demandRatio}%` }} />
                </div>
              </div>
            ))}

            {missingSkillsList.length === 0 && (
              <div className="text-center text-gray-500 text-xs italic py-6">
                No major skill gaps identified! You are fully qualified for the matching positions in the index.
              </div>
            )}
          </div>
        </div>

        {/* Course recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">Recommended Courses & Guides</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missingSkillsList.slice(0, 4).map(skill => {
              const courses = courseDatabase[skill.name] || [
                { title: `Mastering ${skill.name} Professional Guide`, platform: 'Udemy / Coursera', duration: '6 Hours', link: 'https://www.udemy.com' }
              ];

              return (
                <div key={skill.name} className="glass p-4 rounded-xl border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-violet-400 uppercase font-semibold">Skill: {skill.name}</span>
                    <div className="space-y-2.5 mt-2">
                      {courses.map((course, idx) => (
                        <div key={idx} className="p-2.5 bg-black/20 rounded-lg space-y-1">
                          <p className="text-xs font-semibold text-white leading-tight">{course.title}</p>
                          <div className="flex justify-between text-[9px] text-gray-400">
                            <span>{course.platform}</span>
                            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{course.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={courses[0]?.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-white flex items-center justify-center gap-1.5 mt-4 border-t border-white/5 pt-2.5 transition-all"
                  >
                    Start Learning <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}

            {missingSkillsList.length === 0 && (
              <div className="col-span-2 glass p-8 text-center text-gray-500 text-xs italic">
                All skills loaded correctly! Complete online practices or build projects to showcase your expertise.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
