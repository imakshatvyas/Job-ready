import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  KanbanSquare, 
  GraduationCap, 
  Building2, 
  Bell,
  Sparkles,
  LogOut,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificationCount: number;
  setShowNotifications: (show: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  notificationCount,
  setShowNotifications
}) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase },
    { id: 'resume', label: 'Resume Parser', icon: FileText },
    { id: 'tailor', label: 'Resume Tailor', icon: Sparkles },
    { id: 'tracker', label: 'Application Tracker', icon: KanbanSquare },
    { id: 'learning', label: 'Learning Hub', icon: GraduationCap },
    { id: 'placement', label: 'Placement Insights', icon: Compass },
    { id: 'companies', label: 'Company Pages', icon: Building2 },
  ];

  return (
    <aside className="w-64 glass h-screen sticky top-0 flex flex-col justify-between border-r border-white/5 p-4 z-40">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-100 bg-clip-text text-transparent m-0 p-0 text-left">
              OptiJob AI
            </h1>
            <span className="text-[10px] text-indigo-400 font-medium tracking-widest uppercase">
              Eligibility Engine
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white border-l-4 border-violet-500 shadow-md shadow-violet-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-violet-400' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Alert Icon */}
      <div className="border-t border-white/5 pt-4">
        <button 
          onClick={() => setShowNotifications(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-sm mb-2"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {notificationCount}
                </span>
              )}
            </div>
            <span className="text-gray-300">Live Alerts</span>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
            Active
          </span>
        </button>

        {user && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-white/2 border border-white/5 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/10">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                <p className="text-[9px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
