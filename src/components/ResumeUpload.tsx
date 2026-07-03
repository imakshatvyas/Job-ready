import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, RefreshCw, Sparkles, User, Mail, Phone, BookOpen } from 'lucide-react';
import { userTemplates, parseResumeText } from '../services/aiEngine';
import type { UserProfile } from '../services/aiEngine';

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  if (file.name.endsWith('.pdf')) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  if (file.name.endsWith('.docx')) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    const mammoth = (window as any).mammoth;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
};

interface ResumeUploadProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ userProfile, setUserProfile }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [rawText, setRawText] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateParsing = (profile: UserProfile) => {
    setIsScanning(true);
    setTimeout(() => {
      setUserProfile(profile);
      setIsScanning(false);
    }, 1500);
  };

  const processUploadedFile = async (file: File) => {
    setIsScanning(true);
    try {
      const extractedText = await extractTextFromFile(file);
      const parsed = parseResumeText(extractedText);
      if (parsed.name === 'Unknown Candidate') {
        parsed.name = file.name.split('.')[0].replace(/[-_]/g, ' ');
      }
      setUserProfile(parsed);
    } catch (err: any) {
      alert(`Error parsing file: ${err.message || err}. Please try copying and pasting text directly instead.`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleTemplateSelect = (key: string) => {
    const template = userTemplates[key];
    if (template) {
      simulateParsing(template);
    }
  };

  const handleRawTextSubmit = () => {
    if (!rawText.trim()) return;
    const parsed = parseResumeText(rawText);
    simulateParsing(parsed);
  };

  const handleAddField = (field: 'skills' | 'languages' | 'certifications') => {
    if (!newSkill.trim() || !userProfile) return;
    const updated = { ...userProfile };
    if (field === 'skills') {
      updated.skills = [...updated.skills, newSkill.trim()];
    } else if (field === 'languages') {
      updated.languages = [...updated.languages, newSkill.trim()];
    } else if (field === 'certifications') {
      updated.certifications = [...updated.certifications, newSkill.trim()];
    }
    setUserProfile(updated);
    setNewSkill('');
  };

  const handleRemoveField = (field: 'skills' | 'languages' | 'certifications', index: number) => {
    if (!userProfile) return;
    const updated = { ...userProfile };
    if (field === 'skills') {
      updated.skills = updated.skills.filter((_, i) => i !== index);
    } else if (field === 'languages') {
      updated.languages = updated.languages.filter((_, i) => i !== index);
    } else if (field === 'certifications') {
      updated.certifications = updated.certifications.filter((_, i) => i !== index);
    }
    setUserProfile(updated);
  };

  const handleProfileFieldChange = (key: keyof UserProfile, value: any) => {
    if (!userProfile) return;
    setUserProfile({
      ...userProfile,
      [key]: value
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Heading */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-violet-400" />
          AI Resume Parser & Profile Builder
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Upload your resume, paste raw text, or select one of our templates to automatically build your candidate profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Upload & Parser Sources */}
        <div className="lg:col-span-1 space-y-6">
          {/* Templates Quick Selector */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick-Start Mock Profiles
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleTemplateSelect('fresherCS')}
                className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all text-xs flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">Alex Johnson</p>
                  <p className="text-[10px] text-gray-400">B.Tech CS / React / SQL</p>
                </div>
                <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">CS Graduate</span>
              </button>

              <button
                onClick={() => handleTemplateSelect('automationEEE')}
                className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all text-xs flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">Sarah Chen</p>
                  <p className="text-[10px] text-gray-400">B.E. EE / AutoCAD / PLC / MATLAB</p>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Electrical</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] ${
              dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf,.docx,.txt" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processUploadedFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-white">Drag & drop your Resume</p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, TXT formats</p>
              <span className="mt-4 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all">
                Browse Files
              </span>
            </label>
          </div>

          {/* Paste Raw Text Box */}
          <div className="glass p-5 rounded-2xl border-white/5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-300">Paste Resume Text</h3>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste full text of your resume here to extract fields..."
              className="w-full h-32 rounded-xl bg-black/20 border border-white/5 p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
            />
            <button
              onClick={handleRawTextSubmit}
              disabled={!rawText.trim()}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/40 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-violet-600/20"
            >
              Parse Text with AI
            </button>
          </div>
        </div>

        {/* Right Side: Parsed profile display and editing */}
        <div className="lg:col-span-2 space-y-6">
          {isScanning ? (
            <div className="glass rounded-2xl border-white/5 p-12 flex flex-col items-center justify-center min-h-[450px]">
              <RefreshCw className="w-12 h-12 text-violet-400 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white">Extracting Profile Details...</h3>
              <p className="text-xs text-gray-400 mt-1 text-center max-w-sm">
                Our AI parser is structuring your contact info, skills, education, and experiences for instant matching.
              </p>
            </div>
          ) : userProfile ? (
            <div className="glass rounded-2xl border-white/5 p-6 space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Candidate Profile Loaded
                  </h3>
                  <p className="text-xs text-gray-400">Review and tweak your details. Values update the matching scores dynamically.</p>
                </div>
                <button
                  onClick={() => setUserProfile(null as any)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs rounded-xl font-medium transition-all"
                >
                  Clear Profile
                </button>
              </div>

              {/* Personal Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={userProfile.phone}
                      onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Degree</label>
                    <input
                      type="text"
                      value={userProfile.degree}
                      onChange={(e) => handleProfileFieldChange('degree', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Grad Year</label>
                    <input
                      type="number"
                      value={userProfile.graduationYear}
                      onChange={(e) => handleProfileFieldChange('graduationYear', parseInt(e.target.value) || 2026)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">CGPA</label>
                    <input
                      type="text"
                      value={userProfile.cgpa}
                      onChange={(e) => handleProfileFieldChange('cgpa', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Graduation Branch</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={userProfile.branch}
                      onChange={(e) => handleProfileFieldChange('branch', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Tags Modifier */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-400">Skills & Tech Stack</label>
                <div className="flex flex-wrap gap-2 p-3 bg-black/20 border border-white/5 rounded-xl min-h-[60px]">
                  {userProfile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs rounded-lg"
                    >
                      {skill}
                      <button 
                        onClick={() => handleRemoveField('skills', index)}
                        className="hover:text-white transition-all font-bold text-[10px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill (e.g. Docker, MATLAB)..."
                    className="flex-1 px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={() => handleAddField('skills')}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Display Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400">Projects</h4>
                <div className="space-y-2">
                  {userProfile.projects.map((proj, index) => (
                    <div key={index} className="p-3 bg-white/2 border border-white/5 rounded-xl">
                      <p className="text-sm font-semibold text-white">{proj.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{proj.description}</p>
                      <div className="flex gap-1.5 mt-2">
                        {proj.skillsUsed.map((su, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-full">
                            {su}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl border-white/5 p-12 flex flex-col items-center justify-center min-h-[450px]">
              <FileText className="w-12 h-12 text-gray-500 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-white">No Candidate Loaded</h3>
              <p className="text-xs text-gray-400 mt-1 text-center max-w-sm">
                Select a quick template on the left, drop a resume, or paste raw text to view match calculations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
