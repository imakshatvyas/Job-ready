import React, { useState } from 'react';
import type { UserProfile } from '../services/aiEngine';
import { Sparkles, ArrowRight, ArrowLeft, Check, User, BookOpen, Layers, Target } from 'lucide-react';

interface OnboardingProps {
  uid: string;
  onComplete: (profile: UserProfile, preferences: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [prefLocation, setPrefLocation] = useState('');

  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science');
  const [university, setUniversity] = useState('MBM University');
  const [gradYear, setGradYear] = useState(2026);
  const [cgpa, setCgpa] = useState('8.5/10');

  const [isExperienced, setIsExperienced] = useState(false);
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [tools, setTools] = useState('');

  const [prefRoles] = useState<string[]>(['Software Engineer']);
  const [workMode, setWorkMode] = useState('Any');
  const [relocate, setRelocate] = useState(true);

  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    // Construct User Profile
    const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    const parsedLanguages = languages.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTools = tools.split(',').map(s => s.trim()).filter(Boolean);

    const profile: UserProfile = {
      name: name || 'Applicant',
      email: email || 'applicant@example.com',
      phone: '+1 (555) 019-0000',
      degree,
      branch,
      graduationYear: gradYear,
      cgpa: cgpa || '8.0/10',
      skills: [...parsedSkills, ...parsedTools],
      programmingLanguages: parsedLanguages,
      technicalTools: parsedTools,
      projects: [
        {
          title: 'Academic Capstone Project',
          description: `Designed and built an engineering platform aligned with ${branch} systems.`,
          skillsUsed: parsedLanguages.slice(0, 3)
        }
      ],
      certifications: [],
      internships: [],
      experience: [],
      languages: ['English'],
      achievements: []
    };

    const preferences = {
      roles: prefRoles,
      industries: [branch],
      countries: [country],
      workMode,
      willingToRelocate: relocate,
      github,
      linkedin,
      portfolio
    };

    onComplete(profile, preferences);
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass max-w-xl w-full p-8 rounded-3xl border-white/5 space-y-6 z-10 text-left">
        {/* Step Indicator */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Onboarding Step {step} of 4</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(idx => (
              <span 
                key={idx} 
                className={`w-4 h-1.5 rounded-full transition-all ${
                  idx <= step ? 'bg-violet-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-violet-400" /> Personal Details
            </h3>
            <p className="text-xs text-gray-400">Let's set up your primary contact information.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. amit@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Preferred Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / Bangalore"
                    value={prefLocation}
                    onChange={(e) => setPrefLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" /> Educational Qualifications
            </h3>
            <p className="text-xs text-gray-400">Tell us about your university and graduation metrics.</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Degree</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E.">B.E.</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.S.">B.S.</option>
                    <option value="M.S.">M.S.</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">University / College</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(parseInt(e.target.value) || 2026)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Current CGPA (optional)</label>
                  <input
                    type="text"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Experience & Skills */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" /> Experience & Technical Skills
            </h3>
            <p className="text-xs text-gray-400">Add comma-separated values to represent your competencies.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Experience Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExperienced(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                      !isExperienced 
                        ? 'bg-violet-500/20 border-violet-500 text-white' 
                        : 'border-white/5 text-gray-400'
                    }`}
                  >
                    Fresher / Entry-Level
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExperienced(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                      isExperienced 
                        ? 'bg-violet-500/20 border-violet-500 text-white' 
                        : 'border-white/5 text-gray-400'
                    }`}
                  >
                    Experienced (1y+)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Programming Languages</label>
                <input
                  type="text"
                  placeholder="e.g. Python, C++, JavaScript"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Software Frameworks & Core Skills</label>
                <input
                  type="text"
                  placeholder="e.g. React, AutoCAD, PLC Programming, Git"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Developer Tools / Hardware Boards</label>
                <input
                  type="text"
                  placeholder="e.g. Docker, MATLAB, Arduino, VS Code"
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Career Preferences & Links */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" /> Career Preferences & Links
            </h3>
            <p className="text-xs text-gray-400">Configure matching parameters and online profile anchors.</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Any">Any Mode</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Willingness to Relocate</label>
                  <select
                    value={relocate ? 'yes' : 'no'}
                    onChange={(e) => setRelocate(e.target.value === 'yes')}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">LinkedIn Profile (optional)</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">GitHub Link (optional)</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Portfolio (optional)</label>
                  <input
                    type="text"
                    placeholder="https://portfolio.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex gap-2 border-t border-white/5 pt-4">
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="py-2.5 px-4 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && (!name || !email)}
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/40 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/25 animate-pulse"
            >
              Complete Onboarding <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
