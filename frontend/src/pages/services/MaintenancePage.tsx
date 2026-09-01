import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Clock,
  User,
  Camera,
  UploadCloud,
  AlertTriangle,
  Flame,
  Zap,
  Droplet,
  Tv,
  Armchair,
  Check,
  RefreshCw,
  Phone,
  FileCheck,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { apiClient } from '../../services/api/apiClient';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';
import { requestsService } from '../../services/api/requestsService';

interface TechnicianInfo {
  team: string;
  technician: string;
  role: string;
  contact: string;
}

const TECHNICIAN_ROSTER: Record<string, TechnicianInfo> = {
  HVAC: {
    team: 'Estates Team - HVAC & Thermal Management',
    technician: 'Rajesh Kumar',
    role: 'HVAC Lead Technician',
    contact: '+91 98610 23451',
  },
  ELECTRICAL: {
    team: 'Estates Team - Electrical & Power Distribution',
    technician: 'Suresh Jena',
    role: 'Senior Electrical Engineer',
    contact: '+91 98610 34562',
  },
  PLUMBING: {
    team: 'Estates Team - Water Supply & Sanitation',
    technician: 'Pradeep Mohanty',
    role: 'Master Plumber & Pipefitter',
    contact: '+91 98610 45673',
  },
  IT_INFRA: {
    team: 'Network & Audio-Visual Support',
    technician: 'Alok Das',
    role: 'Systems & Network Specialist',
    contact: '+91 98610 56784',
  },
  FURNITURE: {
    team: 'Estates Team - Civil, Carpentry & Infrastructure',
    technician: 'Kanhu Sahoo',
    role: 'Carpentry & Civil Supervisor',
    contact: '+91 98610 67895',
  },
};

const PRESETS = [
  {
    label: '🚨 Server Room AC (Urgent)',
    location: 'B-Block Server Room (Datacenter)',
    category: 'HVAC',
    description: 'Server room AC cooling unit tripped, temperature rising above 29°C risking rack shutdown!',
    priority: 'URGENT',
  },
  {
    label: '⚡ Main Panel Sparking (Urgent)',
    location: 'Substation & Main Switchboard',
    category: 'ELECTRICAL',
    description: 'Sparks and smoke observed from main distribution panel board on Ground Floor.',
    priority: 'URGENT',
  },
  {
    label: '📽️ Exam Hall Projector (High)',
    location: 'Examination Hall 3 (Auditorium)',
    category: 'IT_INFRA',
    description: 'Central exam projector and display audio dead right before semester examination.',
    priority: 'HIGH',
  },
  {
    label: '💧 Classroom AC Leak (Medium)',
    location: 'C-Block Room 302 (Classroom)',
    category: 'HVAC',
    description: 'The AC in C-Block Room 302 is leaking water on student benches and making rattling noise.',
    priority: 'MEDIUM',
  },
  {
    label: '🪑 Desk Loose Screw (Low)',
    location: 'Classroom A-101 (Old Block)',
    category: 'FURNITURE',
    description: 'Classroom desk wooden armrest is loose with a missing screw.',
    priority: 'LOW',
  },
];

export const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('B-Block Server Room (Datacenter)');
  const [category, setCategory] = useState('HVAC');
  const [issueDescription, setIssueDescription] = useState(
    'Server room AC cooling unit tripped, temperature rising above 29°C risking rack shutdown!'
  );
  const [reporterName] = useState('Kaushal Raj Gupta (2023-CSE-042)');
  const [simulatedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop'
  );
  const [ticketStatus, setTicketStatus] = useState<'IDLE' | 'CREATED' | 'IN_PROGRESS' | 'RESOLVED'>('IDLE');
  const [ticketId, setTicketId] = useState('MT-8842');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvedAt, setResolvedAt] = useState<string | null>(null);

  // Dynamic rule-based Priority Matrix Classifier
  const priorityData = useMemo(() => {
    const loc = location.toLowerCase();
    const desc = issueDescription.toLowerCase();

    // 1. Urgent (SLA 1 hr)
    const urgentLocations = ['server room', 'data center', 'substation', 'transformer', 'ups room', 'main panel', 'hpc cluster'];
    const urgentKeywords = ['short circuit', 'spark', 'sparking', 'fire', 'smoke', 'gas leak', 'blackout', 'overheating', 'explosion', 'burnt', 'tripped', 'server room ac'];

    if (urgentLocations.some((u) => loc.includes(u)) || urgentKeywords.some((k) => desc.includes(k))) {
      return {
        priority: 'URGENT',
        sla_hours: 1,
        color: 'bg-red-500 text-white',
        border: 'border-red-500',
        bg: 'bg-red-50',
        textColor: 'text-red-700',
        badge: 'bg-red-600 text-white',
        icon: Flame,
        rationale: 'Critical Infrastructure Hazard: Urgent automated dispatch with 1-hour SLA escalation.',
      };
    }

    // 2. High (SLA 4 hrs)
    const highLocations = ['exam hall', 'examination', 'gpu lab', 'lab c-204', 'auditorium', 'central library', 'hostel mess'];
    const highKeywords = ['water burst', 'flooding', 'lift stuck', 'elevator trapped', 'pipe burst', 'no power in whole floor', 'projector dead'];

    if (highLocations.some((h) => loc.includes(h)) || highKeywords.some((k) => desc.includes(k))) {
      return {
        priority: 'HIGH',
        sla_hours: 4,
        color: 'bg-amber-500 text-white',
        border: 'border-amber-400',
        bg: 'bg-amber-50',
        textColor: 'text-amber-800',
        badge: 'bg-amber-600 text-white',
        icon: AlertTriangle,
        rationale: 'High Operational/Academic Disruption: 4-hour priority resolution SLA.',
      };
    }

    // 3. Low (SLA 24 hrs)
    const lowKeywords = ['broken chair', 'desk armrest', 'paint', 'notice board', 'bulb flickering', 'loose screw', 'door stopper', 'minor scratch'];
    if (lowKeywords.some((l) => desc.includes(l)) && !desc.includes('ac') && !desc.includes('leak') && !desc.includes('power')) {
      return {
        priority: 'LOW',
        sla_hours: 24,
        color: 'bg-slate-500 text-white',
        border: 'border-slate-300',
        bg: 'bg-slate-50',
        textColor: 'text-slate-700',
        badge: 'bg-slate-600 text-white',
        icon: Wrench,
        rationale: 'Cosmetic or non-blocking infrastructure maintenance: Standard 24-hour SLA.',
      };
    }

    // 4. Medium (SLA 8 hrs)
    return {
      priority: 'MEDIUM',
      sla_hours: 8,
      color: 'bg-yellow-500 text-slate-900',
      border: 'border-yellow-300',
      bg: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      badge: 'bg-yellow-500 text-slate-950 font-bold',
      icon: Clock,
      rationale: 'Standard classroom/hostel utility maintenance: 8-hour SLA response target.',
    };
  }, [location, issueDescription]);

  const assignedTech = TECHNICIAN_ROSTER[category] || TECHNICIAN_ROSTER.HVAC;

  const demoActionPlan: ActionPlanData = {
    intent: 'MAINTENANCE',
    risk_level: priorityData.priority === 'URGENT' ? 'HIGH' : priorityData.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
    requires_approval: false,
    assigned_approver_role: 'Estates_Staff',
    summary: `4-Step Execution Plan to dispatch ${assignedTech.team} (${assignedTech.technician}) for ${priorityData.priority} priority repair at ${location}.`,
    steps: [
      {
        step_number: 1,
        title: 'Extract Issue Parameters & Auto-Classify Priority Matrix',
        description: `Parsed location '${location}', Category '${category}'. Priority classified as '${priorityData.priority}' (${priorityData.sla_hours}-hr SLA). ${priorityData.rationale}`,
        status: 'PASSED',
        assigned_actor: 'Rule-Based NLU Matrix Engine',
      },
      {
        step_number: 2,
        title: 'Auto-Assign On-Duty Estates Lead Technician',
        description: `Assigned ${assignedTech.technician} (${assignedTech.role}, Tel: ${assignedTech.contact}) based on skill trade and proximity.`,
        status: 'PASSED',
        assigned_actor: 'Estates Dispatch Orchestrator',
      },
      {
        step_number: 3,
        title: 'Technician Physical Dispatch & Triage',
        description:
          ticketStatus === 'IDLE' || ticketStatus === 'CREATED'
            ? `Dispatched technician to ${location} for physical inspection.`
            : `Technician ${assignedTech.technician} on-site at ${location}, repair in progress.`,
        status: ticketStatus === 'IDLE' || ticketStatus === 'CREATED' ? 'PENDING' : 'PASSED',
        assigned_actor: assignedTech.technician,
      },
      {
        step_number: 4,
        title: 'Verify Repair & Log Resolution Proof Notes',
        description:
          ticketStatus === 'RESOLVED'
            ? `Repair verified: "${resolutionNotes || 'Replaced faulty component, tested nominal operating state.'}"`
            : 'Technician replaces worn components and logs resolution notes for quality audit.',
        status: ticketStatus === 'RESOLVED' ? 'PASSED' : 'PENDING',
        assigned_actor: 'Quality & Estates Audit Service',
      },
    ],
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setLocation(preset.location);
    setCategory(preset.category);
    setIssueDescription(preset.description);
    setTicketStatus('IDLE');
    setResolutionNotes('');
  };

  const handleCreateTicket = async () => {
    setIsSubmitting(true);
    const newId = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(newId);

    try {
      // Create in backend API
      await apiClient.post('/maintenance/create', {
        location,
        category,
        issue_description: issueDescription,
        reporter_name: reporterName,
        photo_url: simulatedPhoto,
      });

      // Synchronize with persistent requests service
      await requestsService.createRequest({
        request_type: 'MAINTENANCE',
        risk_level: priorityData.priority === 'URGENT' ? 'HIGH' : priorityData.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
        payload: {
          ticket_id: newId,
          location,
          category,
          issue: issueDescription,
          priority: priorityData.priority,
          assigned_team: assignedTech.team,
          assigned_technician: assignedTech.technician,
          technician_contact: assignedTech.contact,
          sla_hours: priorityData.sla_hours,
        },
      });
    } catch {
      // Local fallback
    } finally {
      setIsSubmitting(false);
      setTicketStatus('CREATED');
    }
  };

  const handleSimulateStaffStartRepair = async () => {
    setTicketStatus('IN_PROGRESS');
    try {
      await apiClient.post('/maintenance/update-status', {
        ticket_id: ticketId,
        new_status: 'IN_PROGRESS',
        technician_name: assignedTech.technician,
      });
      await requestsService.updateStatus(ticketId, 'IN_PROGRESS', 'Technician dispatched on-site.');
    } catch {
      // Ignore
    }
  };

  const handleSimulateStaffResolve = async () => {
    const defaultProofNotes =
      category === 'HVAC'
        ? 'Replaced AC compressor contactor and cleared condensation drain line. Verified cooling temperature at 18.2°C.'
        : category === 'ELECTRICAL'
        ? 'Replaced blown 32A MCB circuit breaker, balanced load phase, and tightened terminal connections.'
        : category === 'PLUMBING'
        ? 'Replaced high-pressure inlet valve and sealed leak with PTFE threading tape.'
        : category === 'IT_INFRA'
        ? 'Replaced faulty HDMI cable transmitter and recalibrated ceiling projector resolution.'
        : 'Tightened loose joint bolts, fitted heavy-duty steel bracket, and buffed desk surface.';

    const notesToUse = resolutionNotes || defaultProofNotes;
    setResolutionNotes(notesToUse);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setResolvedAt(nowTime);
    setTicketStatus('RESOLVED');

    try {
      await apiClient.post('/maintenance/update-status', {
        ticket_id: ticketId,
        new_status: 'RESOLVED',
        resolution_notes: notesToUse,
        technician_name: assignedTech.technician,
      });
      await requestsService.updateStatus(ticketId, 'COMPLETED', notesToUse);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#E8F5E9]" /> Flagship Workflow #3 (Phase 16)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Campus Infrastructure Maintenance &amp; Estates Dispatch
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Automated priority matrix classification (Server Room AC = Urgent; Classroom Fan = Medium), on-duty technician routing, and live resolution verification.
          </p>
        </div>

        <button
          onClick={() =>
            navigate('/assistant', {
              state: { initialPrompt: 'Report urgent server room AC failure in B-Block Datacenter.' },
            })
          }
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#152E22]" />
          <span>Report via AI Copilot</span>
        </button>
      </div>

      {/* Preset Evaluation Scenarios Bar */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E63] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#152E22]" /> Priority Matrix Test Presets (Instant Classification)
          </span>
          <span className="text-[11px] text-[#8C9C92] font-semibold">Click any preset to test auto-classification</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-white hover:border-[#152E22] border border-[#E5E2D9] text-[#1B231F] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issue Submission Form & Staff Portal (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <h2 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">
                1. Report Campus Infrastructure Issue
              </h2>
              <span className="text-[11px] font-semibold text-[#5A6E63]">
                Reporter: <strong>Kaushal Raj Gupta (Student)</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Campus Location / Facility</label>
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setTicketStatus('IDLE');
                  }}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] font-semibold outline-none focus:border-[#152E22]"
                >
                  <option value="B-Block Server Room (Datacenter)">B-Block Server Room (Datacenter)</option>
                  <option value="Substation & Main Switchboard">Substation &amp; Main Switchboard</option>
                  <option value="Examination Hall 3 (Auditorium)">Examination Hall 3 (Auditorium)</option>
                  <option value="C-Block 2nd Floor GPU Lab C-204">C-Block 2nd Floor GPU Lab C-204</option>
                  <option value="C-Block Room 302 (Classroom)">C-Block Room 302 (Classroom)</option>
                  <option value="Central Library Reading Hall">Central Library Reading Hall</option>
                  <option value="Hostel Block 4 Ground Floor">Hostel Block 4 Ground Floor</option>
                  <option value="Classroom A-101 (Old Block)">Classroom A-101 (Old Block)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Infrastructure Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setTicketStatus('IDLE');
                  }}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] font-semibold outline-none focus:border-[#152E22]"
                >
                  <option value="HVAC">HVAC &amp; Air Conditioning</option>
                  <option value="ELECTRICAL">Electrical &amp; Power Distribution</option>
                  <option value="PLUMBING">Plumbing &amp; Water Supply</option>
                  <option value="IT_INFRA">Network &amp; Audio-Visual IT</option>
                  <option value="FURNITURE">Classroom Furniture &amp; Civil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Detailed Issue Description</label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => {
                  setIssueDescription(e.target.value);
                  setTicketStatus('IDLE');
                }}
                placeholder="Describe the defect, symptoms, or acute hazards in detail..."
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            {/* Simulated Photo Upload Component */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1B231F]">Attach Defect Photo (Simulated)</label>
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-dashed border-[#D9D5C7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1B231F] block">
                      {category === 'HVAC'
                        ? 'Server_AC_Compressor_Fault.jpg'
                        : category === 'ELECTRICAL'
                        ? 'Distribution_Panel_Fault.jpg'
                        : 'Infrastructure_Defect_Proof.jpg'}
                    </span>
                    <span className="text-[10px] text-[#5A6E63]">1.8 MB • Timestamped Photo Attached</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Photo verified and attached to audit log!')}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2D9] text-[#152E22] text-xs font-bold hover:bg-[#FAF8F3] flex items-center gap-1 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Re-upload
                </button>
              </div>
            </div>

            {/* Dynamic Rule-Based Priority Matrix Classification Banner */}
            <div className={`p-4 rounded-2xl border ${priorityData.bg} ${priorityData.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
              <div className="flex items-start gap-2.5">
                <priorityData.icon className={`w-5 h-5 ${priorityData.textColor} shrink-0 mt-0.5`} />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${priorityData.badge}`}>
                      {priorityData.priority} Priority
                    </span>
                    <span className="font-bold text-[#1B231F]">SLA Target: ≤ {priorityData.sla_hours} Hour{priorityData.sla_hours > 1 ? 's' : ''}</span>
                  </div>
                  <p className={`text-[11px] ${priorityData.textColor} font-medium leading-relaxed`}>
                    {priorityData.rationale}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCreateTicket}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Wrench className="w-4 h-4" />
                <span>{isSubmitting ? 'Dispatching Estates Team...' : 'Submit Ticket & Dispatch Estates Team'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {ticketStatus !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              {/* Staff Resolution Portal (Estates Technician Desk) */}
              <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE7DF] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#5A6E63] uppercase tracking-wider block">
                      STAFF RESOLUTION PORTAL
                    </span>
                    <h3 className="text-sm font-bold text-[#1B231F] flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#152E22]" />
                      <span>Estates Staff &amp; Technician Control Desk</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {ticketStatus === 'CREATED' && (
                      <button
                        onClick={handleSimulateStaffStartRepair}
                        className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Start Work (Mark In Progress)</span>
                      </button>
                    )}
                    {ticketStatus === 'IN_PROGRESS' && (
                      <button
                        onClick={handleSimulateStaffResolve}
                        className="px-4 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Verified &amp; Resolved</span>
                      </button>
                    )}
                    {ticketStatus === 'RESOLVED' && (
                      <span className="px-3.5 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-bold text-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ticket Closed &amp; Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Resolution Notes Input / Proof */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1B231F]">
                    Technician Resolution Proof Notes
                  </label>
                  {ticketStatus === 'RESOLVED' ? (
                    <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32] space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-[#2E7D32]" /> Resolution Certified by {assignedTech.technician}
                        </span>
                        <span>{resolvedAt ? `Closed at ${resolvedAt}` : 'Verified'}</span>
                      </div>
                      <p className="text-[11px] text-[#2E7D32] leading-relaxed font-medium">
                        "{resolutionNotes}"
                      </p>
                    </div>
                  ) : (
                    <textarea
                      rows={2}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder={`Enter diagnostic notes, parts replaced, and performance test results (or click 'Mark Verified & Resolved' for auto-notes)...`}
                      className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Ticket Card, SLA Monitor & Technician Profile (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#8C9C92] uppercase tracking-wider block">
                  ACTIVE TICKET
                </span>
                <h3 className="font-mono font-bold text-[#152E22] text-lg">#{ticketId}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  ticketStatus === 'RESOLVED'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : ticketStatus === 'IN_PROGRESS'
                    ? 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]'
                    : ticketStatus === 'CREATED'
                    ? 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                    : 'bg-[#FAF8F3] text-[#5A6E63] border-[#E5E2D9]'
                }`}
              >
                {ticketStatus === 'RESOLVED'
                  ? 'RESOLVED'
                  : ticketStatus === 'IN_PROGRESS'
                  ? 'IN PROGRESS'
                  : ticketStatus === 'CREATED'
                  ? 'DISPATCHED'
                  : 'DRAFT'}
              </span>
            </div>

            {/* Campus Map Location Badge */}
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B231F]">
                <MapPin className="w-4 h-4 text-[#152E22] shrink-0" />
                <span>{location}</span>
              </div>
              <p className="text-[11px] text-[#5A6E63] leading-relaxed">{issueDescription}</p>
            </div>

            {/* SLA Response Timer Gauge */}
            <div className="p-4 rounded-2xl bg-[#152E22] text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C9C92] uppercase text-[10px] font-bold tracking-wider">
                  SLA Response Guarantee
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 border border-white/20">
                  {priorityData.priority} PRIORITY
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-serif-title font-bold text-white">
                  ≤ {priorityData.sla_hours} Hour{priorityData.sla_hours > 1 ? 's' : ''}
                </span>
                <span className="text-xs text-[#8C9C92]">Target Turnaround</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    ticketStatus === 'RESOLVED'
                      ? 'bg-[#A5D6A7] w-full'
                      : ticketStatus === 'IN_PROGRESS'
                      ? 'bg-amber-400 w-2/3'
                      : 'bg-emerald-400 w-1/3'
                  }`}
                />
              </div>
            </div>

            {/* Assigned Technician Profile & Direct Dispatch */}
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E63] block">
                ASSIGNED ON-DUTY LEAD
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#152E22] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {assignedTech.technician.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B231F] text-xs">{assignedTech.technician}</h4>
                    <p className="text-[10px] text-[#5A6E63]">{assignedTech.role}</p>
                  </div>
                </div>
                <a
                  href={`tel:${assignedTech.contact}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#E5E2D9] hover:border-[#152E22] text-[#152E22] text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                >
                  <Phone className="w-3 h-3 text-[#2E7D32]" />
                  <span>Call</span>
                </a>
              </div>
              <div className="text-[10px] text-[#8C9C92] pt-1 border-t border-[#EAE7DF] flex items-center justify-between">
                <span>{assignedTech.team}</span>
                <span className="text-[#2E7D32] font-semibold">● On-Duty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
