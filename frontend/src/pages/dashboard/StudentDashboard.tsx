import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, X, Calendar, Clock, Video, BookOpen, ChevronRight, UserCheck, Sparkles, Trophy } from 'lucide-react';
import { GreetingHeader } from '../../components/dashboard/GreetingHeader';
import { StudentStatsGrid } from '../../components/dashboard/StudentStatsGrid';
import { QuickServiceGrid } from '../../components/dashboard/QuickServiceGrid';
import { ActiveRequestsList } from '../../components/dashboard/ActiveRequestsList';
import { NotificationDrawer } from '../../components/dashboard/NotificationDrawer';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(
    (location.state as { unauthorizedWarning?: string })?.unauthorizedWarning || null
  );

  const handleLaunchService = (cardId: string, prompt: string) => {
    if (cardId === 'lab-booking') {
      navigate('/services/lab-booking');
    } else if (cardId === 'certificate') {
      navigate('/services/certificate');
    } else if (cardId === 'maintenance') {
      navigate('/services/maintenance');
    } else if (cardId === 'grievance') {
      navigate('/services/grievance');
    } else {
      navigate('/assistant', { state: { initialPrompt: prompt } });
    }
  };

  const handleViewRequestDetail = (requestId: string) => {
    navigate(`/requests?id=${requestId}`);
  };

  const scheduleEvents = [
    { time: '09:00 AM', title: 'CS301 Machine Learning & Neural Networks', room: 'Lab C-204', faculty: 'Dr. Michael Kim', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { time: '11:00 AM', title: 'CS302 Data Structures & Algorithms', room: 'Auditorium 2', faculty: 'Dr. Emily Chen', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { time: '02:00 PM', title: 'Advanced AI GPU Model Training', room: 'AI Lab C-204', faculty: 'Prof. A. K. Samanta', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Access Denied Warning Toast Banner */}
      {warningMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-subtle animate-fade-in">
          <div className="flex items-center gap-3 text-amber-800 text-xs font-semibold">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{warningMessage}</span>
          </div>
          <button
            onClick={() => setWarningMessage(null)}
            className="text-amber-600 hover:text-amber-900 p-1 rounded-lg hover:bg-amber-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Greeting Header Banner */}
      <GreetingHeader onOpenAssistant={(prompt) => navigate('/assistant', { state: { initialPrompt: prompt || 'I want to book the AI Lab tomorrow.' } })} />

      {/* 2. Top Metric Cards */}
      <StudentStatsGrid />

      {/* 3. Quick Service Launcher Cards Grid */}
      <QuickServiceGrid onLaunchService={handleLaunchService} />

      {/* 4. Academic Schedule & Campus Events Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class & Lab Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Today's Academic & Lab Schedule</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              ITER March 2026 Term
            </span>
          </div>

          <div className="space-y-3">
            {scheduleEvents.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-indigo-200 hover:shadow-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500 shrink-0 w-20 bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
                    {item.time}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{item.room} • {item.faculty}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/services/lab-booking')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 self-start sm:self-center ${item.color}`}
                >
                  Join Lab
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Campus Events Calendar Mini-Widget */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-card border border-slate-800 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Campus Summit
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                April 2026
              </span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">SOA National Hackathon</span>
              <h4 className="font-extrabold text-sm text-white">AI Agentic Governance Challenge</h4>
              <p className="text-[11px] text-slate-300">April 5, 2026 • Main Convention Center</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/assistant', { state: { initialPrompt: 'Show upcoming academic events and exam dates.' } })}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <span>Ask AI Copilot for Events</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Active Requests & Pass Gallery List */}
      <ActiveRequestsList onViewRequestDetail={handleViewRequestDetail} />

      {/* 6. Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </div>
  );
};

export default StudentDashboard;
