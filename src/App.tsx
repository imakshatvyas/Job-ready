import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ResumeUpload } from './components/ResumeUpload';
import { JobExplorer } from './components/JobExplorer';
import { Tracker } from './components/Tracker';
import { ResumeTailor } from './components/ResumeTailor';
import { LearningHub } from './components/LearningHub';
import { CompanyBrowser } from './components/CompanyBrowser';
import { Onboarding } from './components/Onboarding';
import { AuthScreen } from './components/AuthScreen';
import { calculateMatch } from './services/aiEngine';
import type { UserProfile } from './services/aiEngine';
import { mockJobs } from './data/jobs';
import type { Job } from './data/jobs';
import { X, BellRing, RefreshCw } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { FirebaseService } from './services/firebaseService';
import './App.css';

interface Application {
  jobId: string;
  status: string;
  notes?: string;
  reminderDate?: string;
}

interface AlertNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // LocalStorage state management linked to user id if authenticated
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean>(true);

  // Fetch data on login session update
  useEffect(() => {
    if (user) {
      const uPrefix = `optijob_${user.uid}`;
      
      const savedProfile = localStorage.getItem(`${uPrefix}_profile`);
      setUserProfileState(savedProfile ? JSON.parse(savedProfile) : null);

      const savedSaved = localStorage.getItem(`${uPrefix}_saved`);
      setSavedJobs(savedSaved ? JSON.parse(savedSaved) : []);

      const savedApps = localStorage.getItem(`${uPrefix}_apps`);
      setApplications(savedApps ? JSON.parse(savedApps) : []);

      // Load onboarded state from Firebase
      FirebaseService.getUserData(user.uid).then(data => {
        setOnboarded(data.onboarded);
      });

      const savedNotifs = localStorage.getItem(`${uPrefix}_notifications`);
      setNotifications(savedNotifs ? JSON.parse(savedNotifs) : [
        {
          id: 'welcome-alert',
          title: `Welcome, ${user.displayName}!`,
          message: 'Load one of the quick profiles under the Resume Parser tab to run the AI eligibility scanner.',
          type: 'info',
          timestamp: 'Just now',
          read: false
        }
      ]);
    } else {
      setUserProfileState(null);
      setSavedJobs([]);
      setApplications([]);
      setNotifications([]);
      setOnboarded(true);
    }
  }, [user]);

  // Sync data with local storage on state change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`optijob_${user.uid}_saved`, JSON.stringify(savedJobs));
    }
  }, [savedJobs, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`optijob_${user.uid}_apps`, JSON.stringify(applications));
    }
  }, [applications, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`optijob_${user.uid}_notifications`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const setUserProfile = (profile: UserProfile) => {
    if (!user) return;
    setUserProfileState(profile);
    const uPrefix = `optijob_${user.uid}`;
    
    if (profile) {
      localStorage.setItem(`${uPrefix}_profile`, JSON.stringify(profile));
      
      // Calculate matching jobs and trigger notifications for high match scores
      const newNotifications: AlertNotification[] = [];
      mockJobs.forEach(job => {
        const match = calculateMatch(profile, job);
        if (match.overallScore >= 75) {
          newNotifications.push({
            id: `match-${job.id}-${Date.now()}`,
            title: `New High Match: ${job.company}`,
            message: `You are eligible for "${job.title}" with a ${match.overallScore}% match score!`,
            type: 'success',
            timestamp: 'Just now',
            read: false
          });
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    } else {
      localStorage.removeItem(`${uPrefix}_profile`);
    }
  };

  // Handlers
  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      
      // Add notification
      if (!isSaved) {
        const job = mockJobs.find(j => j.id === jobId);
        if (job) {
          setNotifications(old => [
            {
              id: `save-${jobId}-${Date.now()}`,
              title: 'Job Saved Successfully',
              message: `Saved "${job.title}" at ${job.company}. Deadline: ${job.deadline || 'N/A'}.`,
              type: 'info',
              timestamp: 'Just now',
              read: false
            },
            ...old
          ]);
        }
      }
      return updated;
    });
  };

  const addApplication = (jobId: string, status: string) => {
    setApplications(prev => {
      const exists = prev.some(app => app.jobId === jobId);
      const updated = exists 
        ? prev.map(app => app.jobId === jobId ? { ...app, status } : app)
        : [...prev, { jobId, status }];
      
      const job = mockJobs.find(j => j.id === jobId);
      if (job) {
        setNotifications(old => [
          {
            id: `app-${jobId}-${Date.now()}`,
            title: `Status Updated: ${status}`,
            message: `"${job.title}" at ${job.company} moved to ${status}.`,
            type: 'success',
            timestamp: 'Just now',
            read: false
          },
          ...old
        ]);
      }
      return updated;
    });
  };

  const handleOnboardingComplete = async (profile: UserProfile, preferences: any) => {
    if (!user) return;
    setUserProfile(profile);
    await FirebaseService.updateUserData(user.uid, { onboarded: true, preferences });
    setOnboarded(true);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Render Loader if auth session is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center">
        <RefreshCw className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  // Render Authentication screen if signed out
  if (!user) {
    return <AuthScreen />;
  }

  // Render Onboarding if not completed
  if (!onboarded) {
    return <Onboarding uid={user.uid} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex bg-[#070b13] min-h-screen text-gray-100 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'jobs') setSelectedJob(null);
        }}
        notificationCount={unreadCount}
        setShowNotifications={setShowNotifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 relative overflow-y-auto h-screen max-w-7xl mx-auto">
        {/* Render pages dynamically */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            userProfile={userProfile} 
            setActiveTab={setActiveTab}
            setSelectedJob={setSelectedJob}
            applications={applications}
          />
        )}

        {activeTab === 'jobs' && (
          <JobExplorer
            userProfile={userProfile}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            savedJobs={savedJobs}
            toggleSaveJob={toggleSaveJob}
            applications={applications}
            addApplication={addApplication}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeUpload 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
          />
        )}

        {activeTab === 'tailor' && (
          <ResumeTailor 
            userProfile={userProfile} 
          />
        )}

        {activeTab === 'tracker' && (
          <Tracker 
            applications={applications}
            setApplications={setApplications}
            setActiveTab={setActiveTab}
            setSelectedJob={setSelectedJob}
          />
        )}

        {activeTab === 'learning' && (
          <LearningHub 
            userProfile={userProfile} 
          />
        )}

        {activeTab === 'companies' && (
          <CompanyBrowser 
            setActiveTab={setActiveTab}
            setSelectedJob={setSelectedJob}
          />
        )}
      </main>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-96 glass h-full p-6 flex flex-col justify-between border-l border-white/10 shadow-2xl animate-slide-in-right">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-indigo-400" />
                  Live Platform Alerts
                </h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-xl border relative ${
                      notif.read ? 'bg-white/2 border-white/5 text-gray-400' : 'bg-indigo-500/5 border-indigo-500/20 text-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-white">{notif.title}</p>
                      <button 
                        onClick={() => clearNotification(notif.id)}
                        className="text-gray-500 hover:text-white text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">{notif.message}</p>
                    <span className="text-[9px] text-gray-500 mt-2 block">{notif.timestamp}</span>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center text-xs text-gray-500 py-12">
                    No active notifications.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all border border-white/5"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setNotifications([])}
                className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
