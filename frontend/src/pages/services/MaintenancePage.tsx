import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Sparkles, MapPin, CheckCircle2, ShieldAlert, ArrowRight, Clock, User, Camera, UploadCloud, AlertTriangle } from 'lucide-react';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';

export const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('C-Block Room 302');
  const [category, setCategory] = useState('HVAC');
  const [issueDescription, setIssueDescription] = useState('The AC in C-Block Room 302 is leaking water and making noise.');
  const [simulatedPhoto, setSimulatedPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop'
  );
  const [ticketStatus, setTicketStatus] = useState<'IDLE' | 'CREATED' | 'IN_PROGRESS' | 'RESOLVED'>('IDLE');
  const [ticketId, setTicketId] = useState('MT-8842');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Auto-calculated priority rule
  const computedPriority = issueDescription.toLowerCase().includes('server room') || issueDescription.toLowerCase().includes('short circuit')
    ? 'Urgent'
    : issueDescription.toLowerCase().includes('leaking') || issueDescription.toLowerCase().includes('ac')
    ? 'Medium'
    : 'Low';

  const demoActionPlan: ActionPlanData = {
    intent: 'MAINTENANCE',
    risk_level: 'MEDIUM',
    requires_approval: false,
    assigned_approver_role: 'Estates_Staff',
    summary: `4-Step Execution Plan to dispatch Estates Team for ${category} repair at ${location}.`,
    steps: [
      {
        step_number: 1,
        title: 'Extract Issue Parameters & Auto-Classify Priority',
        description: `Parsed location '${location}', Category '${category}'. Priority classified as '${computedPriority}'.`,
        status: 'PASSED',
        assigned_actor: 'AI NLU Classifier',
      },
      {
        step_number: 2,
        title: 'Auto-Assign On-Duty Estates Technician',
        description: 'Assigned Rajesh Kumar (HVAC Senior Technician) based on proximity and skill.',
        status: 'PASSED',
        assigned_actor: 'Estates Dispatch Manager',
      },
      {
        step_number: 3,
        title: 'Dispatch Technician to Location',
        description: `Technician dispatched to ${location} for physical inspection.`,
        status: ticketStatus === 'IDLE' ? 'PENDING' : 'CHECKED',
        assigned_actor: 'Rajesh Kumar (HVAC Lead)',
      },
      {
        step_number: 4,
        title: 'Verify Repair & Log Resolution Notes',
        description: 'Technician replaces worn gasket and uploads completion proof.',
        status: ticketStatus === 'RESOLVED' ? 'PASSED' : 'PENDING',
        assigned_actor: 'Quality Audit Service',
      },
    ],
  };

  const handleCreateTicket = () => {
    setTicketId(`MT-${Math.floor(1000 + Math.random() * 9000)}`);
    setTicketStatus('CREATED');
  };

  const handleSimulateStaffStartRepair = () => {
    setTicketStatus('IN_PROGRESS');
  };

  const handleSimulateStaffResolve = () => {
    setResolutionNotes('Replaced AC drain pipe gasket and cleared condensation line. Verified 18°C cooling performance.');
    setTicketStatus('RESOLVED');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" /> Infrastructure Maintenance Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Infrastructure Maintenance Ticketing
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Report HVAC, electrical, plumbing, or classroom furniture complaints with auto-priority matrix classification and Estates staff dispatch.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'The AC in C-Block Room 302 is leaking water and making noise.' } })}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Report via AI Copilot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Issue Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Report Campus Infrastructure Issue</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Location / Room</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="C-Block Room 302">C-Block Room 302 (Classroom)</option>
                  <option value="C-Block 2nd Floor GPU Lab">C-Block 2nd Floor GPU Lab</option>
                  <option value="B-Block Server Room">B-Block Server Room (Datacenter)</option>
                  <option value="Hostel Block 4 Ground Floor">Hostel Block 4 Ground Floor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Infrastructure Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="HVAC">HVAC & Air Conditioning</option>
                  <option value="ELECTRICAL">Electrical & Lighting</option>
                  <option value="PLUMBING">Plumbing & Sanitation</option>
                  <option value="FURNITURE">Classroom Furniture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Issue Description</label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Simulated Photo Upload Component */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Attach Repair Photo (Simulated)</label>
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">AC_Leakage_Room302.jpg</span>
                    <span className="text-[10px] text-slate-500">1.2 MB • Photo attached</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Photo uploaded successfully!')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Re-upload
                </button>
              </div>
            </div>

            {/* Auto Priority Classification Banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Auto-Priority Matrix Rating:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                computedPriority === 'Urgent'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {computedPriority} Priority
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCreateTicket}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Submit Ticket & Dispatch Estates Team</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {ticketStatus !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              {/* Technician & Estates Staff Control Banner */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-600" /> Technician Dispatch Control (Staff Desk)
                  </span>
                  <div className="flex gap-2">
                    {ticketStatus === 'CREATED' && (
                      <button
                        onClick={handleSimulateStaffStartRepair}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Start Repair (In Progress)
                      </button>
                    )}
                    {ticketStatus === 'IN_PROGRESS' && (
                      <button
                        onClick={handleSimulateStaffResolve}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <span className="font-bold block">Technician Resolution Proof Notes:</span>
                    <p className="text-[11px] text-emerald-800">{resolutionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Ticket Card with Progress Bar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Maintenance Ticket</span>
                <h3 className="font-mono font-extrabold text-slate-900 text-base">#{ticketId}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                ticketStatus === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : ticketStatus === 'IN_PROGRESS'
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {ticketStatus === 'RESOLVED' ? 'Resolved' : ticketStatus === 'IN_PROGRESS' ? 'In Progress' : 'New'}
              </span>
            </div>

            {/* Campus Map Location Badge */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{location}</span>
              </div>
              <p className="text-[11px] text-slate-500">{issueDescription}</p>
            </div>

            {/* Status Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Status Progress</span>
                <span className="text-amber-700">
                  {ticketStatus === 'RESOLVED' ? '100% Completed' : ticketStatus === 'IN_PROGRESS' ? '50% In Progress' : '15% Submitted'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    ticketStatus === 'RESOLVED'
                      ? 'bg-emerald-500 w-full'
                      : ticketStatus === 'IN_PROGRESS'
                      ? 'bg-indigo-500 w-1/2'
                      : 'bg-amber-500 w-1/6'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
                <span>1. New</span>
                <span>2. In Progress</span>
                <span>3. Resolved</span>
              </div>
            </div>

            {/* Technician Avatar & Details */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Rajesh Kumar</h4>
                  <p className="text-[10px] text-slate-500">HVAC Senior Lead (Estates)</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Estates Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
