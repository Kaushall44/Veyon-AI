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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#E8F5E9]" /> Infrastructure Maintenance Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Campus Infrastructure Maintenance Ticketing
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Report HVAC, electrical, plumbing, or classroom furniture complaints with auto-priority matrix classification and Estates staff dispatch.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'The AC in C-Block Room 302 is leaking water and making noise.' } })}
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Report via AI Copilot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Issue Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">Report Campus Infrastructure Issue</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Campus Location / Room</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] font-semibold outline-none focus:border-[#152E22]"
                >
                  <option value="C-Block Room 302">C-Block Room 302 (Classroom)</option>
                  <option value="C-Block 2nd Floor GPU Lab">C-Block 2nd Floor GPU Lab</option>
                  <option value="B-Block Server Room">B-Block Server Room (Datacenter)</option>
                  <option value="Hostel Block 4 Ground Floor">Hostel Block 4 Ground Floor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Infrastructure Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] font-semibold outline-none focus:border-[#152E22]"
                >
                  <option value="HVAC">HVAC & Air Conditioning</option>
                  <option value="ELECTRICAL">Electrical & Lighting</option>
                  <option value="PLUMBING">Plumbing & Sanitation</option>
                  <option value="FURNITURE">Classroom Furniture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Detailed Issue Description</label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            {/* Simulated Photo Upload Component */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1B231F]">Attach Repair Photo (Simulated)</label>
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-dashed border-[#D9D5C7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1B231F] block">AC_Leakage_Room302.jpg</span>
                    <span className="text-[10px] text-[#5A6E63]">1.2 MB • Photo attached</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Photo uploaded successfully!')}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2D9] text-[#152E22] text-xs font-bold hover:bg-[#FAF8F3] flex items-center gap-1 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Re-upload
                </button>
              </div>
            </div>

            {/* Auto Priority Classification Banner */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#E65100] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F57F17]" /> Auto-Priority Matrix Rating:
              </span>
              <span className="px-3 py-1 rounded-full font-bold text-xs bg-[#F57F17] text-white">
                {computedPriority} Priority
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCreateTicket}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
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
              <div className="p-5 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#1B231F] uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#152E22]" /> Technician Dispatch Control (Staff Desk)
                  </span>
                  <div className="flex gap-2">
                    {ticketStatus === 'CREATED' && (
                      <button
                        onClick={handleSimulateStaffStartRepair}
                        className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        Start Repair (In Progress)
                      </button>
                    )}
                    {ticketStatus === 'IN_PROGRESS' && (
                      <button
                        onClick={handleSimulateStaffResolve}
                        className="px-4 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {resolutionNotes && (
                  <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32] space-y-1">
                    <span className="font-bold block">Technician Resolution Proof Notes:</span>
                    <p className="text-[11px] text-[#2E7D32]">{resolutionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Ticket Card with Progress Bar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#8C9C92] uppercase tracking-wider block">Maintenance Ticket</span>
                <h3 className="font-mono font-bold text-[#152E22] text-base">#{ticketId}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                ticketStatus === 'RESOLVED'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : ticketStatus === 'IN_PROGRESS'
                  ? 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]'
                  : 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
              }`}>
                {ticketStatus === 'RESOLVED' ? 'Resolved' : ticketStatus === 'IN_PROGRESS' ? 'In Progress' : 'New'}
              </span>
            </div>

            {/* Campus Map Location Badge */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B231F]">
                <MapPin className="w-4 h-4 text-[#152E22] shrink-0" />
                <span>{location}</span>
              </div>
              <p className="text-[11px] text-[#5A6E63]">{issueDescription}</p>
            </div>

            {/* Status Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#5A6E63]">
                <span>Status Progress</span>
                <span className="text-[#152E22]">
                  {ticketStatus === 'RESOLVED' ? '100% Completed' : ticketStatus === 'IN_PROGRESS' ? '50% In Progress' : '15% Submitted'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F3] border border-[#E5E2D9] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    ticketStatus === 'RESOLVED'
                      ? 'bg-[#2E7D32] w-full'
                      : ticketStatus === 'IN_PROGRESS'
                      ? 'bg-[#2563EB] w-1/2'
                      : 'bg-[#F57F17] w-1/6'
                  }`}
                />
              </div>
            </div>

            {/* Technician Avatar & Details */}
            <div className="pt-2 border-t border-[#EAE7DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#152E22] text-white font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-[#1B231F] text-xs">Rajesh Kumar</h4>
                  <p className="text-[10px] text-[#5A6E63]">HVAC Senior Lead (Estates)</p>
                </div>
              </div>
              <span className="text-[10px] text-[#8C9C92] font-mono font-bold">Estates Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
