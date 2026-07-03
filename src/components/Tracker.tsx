import React, { useState } from 'react';
import { mockJobs } from '../data/jobs';
import type { Job } from '../data/jobs';
import { KanbanSquare, Trash2, FileEdit } from 'lucide-react';


interface Application {
  jobId: string;
  status: string;
  notes?: string;
  reminderDate?: string;
}

interface TrackerProps {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  setActiveTab: (tab: string) => void;
  setSelectedJob: (job: Job) => void;
}

export const Tracker: React.FC<TrackerProps> = ({
  applications,
  setApplications,
  setActiveTab,
  setSelectedJob
}) => {
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [reminder, setReminder] = useState('');

  const statuses = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

  const handleUpdateStatus = (jobId: string, newStatus: string) => {
    setApplications(prev => prev.map(app => 
      app.jobId === jobId ? { ...app, status: newStatus } : app
    ));
  };

  const handleDeleteApplication = (jobId: string) => {
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
  };

  const handleSaveNotes = (jobId: string) => {
    setApplications(prev => prev.map(app => 
      app.jobId === jobId ? { ...app, notes: noteText, reminderDate: reminder } : app
    ));
    setEditingJobId(null);
  };

  const handleStartEditing = (app: Application) => {
    setEditingJobId(app.jobId);
    setNoteText(app.notes || '');
    setReminder(app.reminderDate || '');
  };

  // Group applications by status
  const columns = statuses.map(status => {
    const list = applications.filter(app => app.status === status).map(app => {
      const job = mockJobs.find(j => j.id === app.jobId);
      return { app, job };
    }).filter(item => item.job !== undefined) as Array<{ app: Application; job: Job }>;
    return { status, list };
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="text-left flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-violet-400" />
            Application Tracker
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Organize and update your job application pipelines. Store interview notes and test dates.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('jobs')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all border border-white/5"
        >
          Browse Open Positions
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {columns.map(({ status, list }) => (
          <div key={status} className="glass p-3 rounded-2xl border-white/5 min-w-[200px] flex flex-col h-[500px]">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-gray-300">{status}</span>
              <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                {list.length}
              </span>
            </div>

            {/* Application Cards List */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {list.map(({ app, job }) => (
                <div key={job.id} className="p-3 bg-white/2 border border-white/5 hover:border-white/10 rounded-xl space-y-3 transition-all">
                  <div className="flex justify-between items-start gap-1">
                    <div 
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveTab('jobs');
                      }}
                      className="cursor-pointer"
                    >
                      <p className="text-xs font-bold text-white leading-tight hover:text-violet-400 transition-all">{job.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{job.company}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteApplication(job.id)}
                      className="text-gray-500 hover:text-rose-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                      className="w-full text-[10px] bg-black/20 border border-white/5 rounded-lg py-1 px-1.5 text-gray-300 focus:outline-none"
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes / Reminders overview */}
                  {app.notes && (
                    <div className="p-1.5 bg-black/10 rounded-lg text-[9px] text-gray-400 border border-white/5">
                      <p className="font-semibold text-gray-300 truncate">Notes: {app.notes}</p>
                      {app.reminderDate && <p className="text-[8px] text-indigo-400 mt-0.5">Date: {app.reminderDate}</p>}
                    </div>
                  )}

                  <button
                    onClick={() => handleStartEditing(app)}
                    className="w-full py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] text-gray-300 font-semibold transition-all flex items-center justify-center gap-1"
                  >
                    <FileEdit className="w-3 h-3" />
                    Add Note / Date
                  </button>
                </div>
              ))}

              {list.length === 0 && (
                <div className="h-full flex items-center justify-center text-center p-4 border border-dashed border-white/5 rounded-xl">
                  <p className="text-[10px] text-gray-500 italic">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal / Panel (if editing) */}
      {editingJobId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass p-6 rounded-2xl border-white/10 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Edit Tracker Details</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Interview / Deadline Date</label>
                <input
                  type="date"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Meeting Notes / Reminders</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Completed initial screening call. Technical assessment scheduled next Tuesday..."
                  className="w-full h-24 px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSaveNotes(editingJobId)}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingJobId(null)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
