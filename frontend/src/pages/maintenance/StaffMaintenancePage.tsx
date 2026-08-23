import React, { useState } from 'react';
import { Wrench, CheckCircle2, MapPin, Clock, AlertTriangle, Search, Filter } from 'lucide-react';

export const StaffMaintenancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  const [tickets, setTickets] = useState([
    {
      ticketId: 'MT-8842',
      location: 'C-Block Room 302',
      category: 'HVAC',
      issueDescription: 'The AC in C-Block Room 302 is leaking water and making noise.',
      priority: 'Medium',
      status: 'New',
      reporterName: 'Rahul Sharma (2023-CSE-042)',
      assignedTechnician: 'Rajesh Kumar (HVAC Lead)',
      createdAt: '2026-08-23 14:00',
      resolutionNotes: '',
    },
    {
      ticketId: 'MT-8843',
      location: 'B-Block Server Room',
      category: 'HVAC',
      issueDescription: 'Primary CRAC cooling unit compressor fault. Room temperature rising to 32°C.',
      priority: 'Urgent',
      status: 'In_Progress',
      reporterName: 'Sysadmin Desk',
      assignedTechnician: 'Amitabh Singh (Senior HVAC Engineer)',
      createdAt: '2026-08-23 13:15',
      resolutionNotes: 'Bypassed auxiliary cooling valve. Primary compressor coil under servicing.',
    },
    {
      ticketId: 'MT-8840',
      location: 'A-Block Auditorium',
      category: 'ELECTRICAL',
      issueDescription: 'Stage projector power outlet tripping main breaker.',
      priority: 'Medium',
      status: 'Resolved',
      reporterName: 'Events Coordinator',
      assignedTechnician: 'Sanjeev Rout (Electrical Team)',
      createdAt: '2026-08-22 16:40',
      resolutionNotes: 'Replaced faulty 16A MCB breaker on DB-3 board. Loaded projector load test passed.',
    },
  ]);

  const handleUpdateStatus = (ticketId: string, newStatus: string, notes?: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId
          ? { ...t, status: newStatus, resolutionNotes: notes || t.resolutionNotes }
          : t
      )
    );
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'NEW' && t.status === 'New') ||
      (activeTab === 'IN_PROGRESS' && t.status === 'In_Progress') ||
      (activeTab === 'RESOLVED' && t.status === 'Resolved');

    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesTab && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-card flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" /> Estates & Facilities Desk
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Staff Maintenance Dispatch Console</h1>
          <p className="text-slate-300 text-xs">Manage campus maintenance queue, dispatch technicians, and log repair resolution notes.</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <span className="text-amber-400">{tickets.filter((t) => t.status !== 'Resolved').length} Active Tickets</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          {(['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.ticketId}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 text-sm">#{ticket.ticketId}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  ticket.priority === 'Urgent'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {ticket.priority} Priority
                </span>
                <span className="text-xs font-bold text-slate-500">[{ticket.category}]</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`px-3 py-1 rounded-full font-bold ${
                  ticket.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ticket.status === 'In_Progress'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Location</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> {ticket.location}
                </span>
              </div>

              <div className="space-y-1 md:col-span-2">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Reported Issue</span>
                <p className="text-slate-800 font-medium">{ticket.issueDescription}</p>
              </div>
            </div>

            {ticket.resolutionNotes && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">Resolution Proof Notes:</span>
                <p className="text-[11px] text-emerald-800">{ticket.resolutionNotes}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" /> Reported {ticket.createdAt} by <strong className="text-slate-700">{ticket.reporterName}</strong>
              </div>

              <div className="flex items-center gap-2">
                {ticket.status === 'New' && (
                  <button
                    onClick={() => handleUpdateStatus(ticket.ticketId, 'In_Progress')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-xs"
                  >
                    Accept & Dispatch
                  </button>
                )}
                {ticket.status === 'In_Progress' && (
                  <button
                    onClick={() => {
                      const notes = prompt('Enter resolution proof notes for this repair:', 'Replaced faulty gasket and tested operation.');
                      if (notes) handleUpdateStatus(ticket.ticketId, 'Resolved', notes);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffMaintenancePage;
