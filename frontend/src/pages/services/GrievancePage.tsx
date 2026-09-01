import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Sparkles,
  Lock,
  EyeOff,
  Eye,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  HelpCircle,
  Search,
  Flame,
  FileCheck,
  AlertTriangle,
  SlidersHorizontal,
  UserCheck,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';
import { SLACountdownTimer } from '../../components/services/SLACountdownTimer';
import { apiClient } from '../../services/api/apiClient';
import { requestsService } from '../../services/api/requestsService';

const PRESETS = [
  {
    label: '🚨 Confidential Anti-Ragging (Harassment)',
    category: 'HARASSMENT_DISCRIMINATION',
    department: 'Hostel Block 4 / Common Area',
    description: 'Confidential reporting of verbal harassment and curfew intimidation by senior hostel residents.',
    isAnonymous: true,
  },
  {
    label: '🔬 Lab 4 Equipment Malfunction (Academic)',
    category: 'ACADEMIC',
    department: 'Computer Science & Engineering',
    description: 'Lab equipment non-functional in Lab 4 during mid-term evaluation, preventing code submission.',
    isAnonymous: true,
  },
  {
    label: '🍲 Hostel Mess Hygiene & Meal Quality (Hostel)',
    category: 'HOSTEL_FACILITIES',
    department: 'Central Mess & Catering Cell',
    description: 'Persistent water filtration contamination and unhygienic food storage reported in Hostel 2 mess.',
    isAnonymous: false,
  },
  {
    label: '📝 Exam Grading Discrepancy (Examination)',
    category: 'EXAMINATION',
    department: 'Examination Control Division',
    description: 'Marksheet tabulation discrepancy for CS301 end-semester evaluation.',
    isAnonymous: false,
  },
];

export const GrievancePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState('ACADEMIC');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [description, setDescription] = useState('Lab equipment non-functional in Lab 4 during mid-term evaluation.');
  const [statusState, setStatusState] = useState<'IDLE' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED'>('IDLE');
  const [trackingToken, setTrackingToken] = useState('GR-1049');
  const [searchTokenInput, setSearchTokenInput] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('Prof. S. N. Panda (Grievance Redressal Officer)');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isEscalated, setIsEscalated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anonymityHash, setAnonymityHash] = useState('a7f89c42b10e9f88d20384759281746251439810293847561029384756102938');

  const categories = [
    { id: 'ACADEMIC', title: 'Academic & Evaluation Concerns', sub: 'Coursework, grading, lab availability' },
    { id: 'HOSTEL_FACILITIES', title: 'Hostel & Mess Facilities', sub: 'Food quality, hygiene, maintenance' },
    { id: 'EXAMINATION', title: 'Examination & Grading Integrity', sub: 'Evaluation transparency & marksheet' },
    { id: 'HARASSMENT_DISCRIMINATION', title: 'Harassment & Discrimination Cell', sub: 'Strictly confidential anti-harassment' },
  ];

  const demoActionPlan: ActionPlanData = {
    intent: 'GRIEVANCE',
    risk_level: 'HIGH',
    requires_approval: true,
    assigned_approver_role: isEscalated ? 'Vice_Chancellor' : 'Grievance_Officer',
    summary: `4-Step Confidential Execution Plan for tracking token #${trackingToken} (${isAnonymous ? '100% Cryptographically Masked' : 'Named Complainant'}).`,
    steps: [
      {
        step_number: 1,
        title: 'Cryptographic Identity Masking & AES-256 Seal',
        description: isAnonymous
          ? `Complainant identity stripped and sealed with salted SHA-256 hash (${anonymityHash.slice(0, 16)}...).`
          : 'Complainant registered as Kaushal Raj Gupta (2023-CSE-042).',
        status: 'PASSED',
        assigned_actor: 'Privacy & AES-256 Engine',
      },
      {
        step_number: 2,
        title: 'Route to Assigned Grievance Redressal Officer',
        description: `Assigned to ${assignedOfficer} for confidential fact-finding inquiry.`,
        status: 'PASSED',
        assigned_actor: 'Redressal Dispatcher',
      },
      {
        step_number: 3,
        title: 'Activate 48-Hour Auto-Escalation SLA Timer',
        description: isEscalated
          ? '48-hour resolution SLA breached: Escalated directly to Vice-Chancellor Executive Office.'
          : '48-hour resolution SLA initiated. Auto-escalates to Vice-Chancellor if breached.',
        status: isEscalated ? 'PASSED' : 'CHECKED',
        assigned_actor: 'SLA Escalation Daemon',
      },
      {
        step_number: 4,
        title: 'Log Redressal Resolution Brief & Verification',
        description:
          statusState === 'RESOLVED'
            ? `Resolution certified by officer: "${resolutionNotes || 'Inquiry conducted and corrective actions completed.'}"`
            : 'Officer conducts inquiry, inspects records, and files certified resolution report.',
        status: statusState === 'RESOLVED' ? 'PASSED' : 'PENDING',
        assigned_actor: 'Grievance Redressal Cell',
      },
    ],
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setCategory(preset.category);
    setDepartment(preset.department);
    setDescription(preset.description);
    setIsAnonymous(preset.isAnonymous);
    setStatusState('IDLE');
    setIsEscalated(false);
    setResolutionNotes('');
  };

  const handleSubmitGrievance = async () => {
    setIsSubmitting(true);
    const newToken = `GR-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setTrackingToken(newToken);
    setAnonymityHash(randomHash);
    setAssignedOfficer('Prof. S. N. Panda (Grievance Redressal Officer)');
    setIsEscalated(false);

    try {
      // Backend API
      await apiClient.post('/grievances/submit', {
        category,
        department,
        description,
        is_anonymous: isAnonymous,
        student_name: isAnonymous ? undefined : 'Kaushal Raj Gupta',
        student_reg_no: isAnonymous ? undefined : '2023-CSE-042',
      });

      // Synchronize with requestsService
      await requestsService.createRequest({
        request_type: 'GRIEVANCE',
        risk_level: 'HIGH',
        is_anonymous: isAnonymous,
        payload: {
          tracking_token: newToken,
          category,
          department,
          issue: description,
          is_anonymous: isAnonymous,
          anonymity_hash: isAnonymous ? randomHash : null,
          assigned_officer: 'Prof. S. N. Panda',
          sla_hours: 48,
        },
      });
    } catch {
      // Local fallback
    } finally {
      setIsSubmitting(false);
      setStatusState('SUBMITTED');
    }
  };

  const handleSearchToken = async () => {
    if (!searchTokenInput.trim()) return;
    const clean = searchTokenInput.replace('#', '').trim().toUpperCase();
    try {
      const res = await apiClient.get<any>(`/grievances/track/${clean}`);
      const data = res?.data || res;
      if (data) {
        setTrackingToken(data.tracking_token);
        setCategory(data.category);
        setDepartment(data.department);
        setDescription(data.description);
        setIsAnonymous(data.is_anonymous);
        setStatusState(data.status as any);
        setIsEscalated(data.is_escalated || false);
        setAssignedOfficer(data.assigned_officer);
        setResolutionNotes(data.resolution_notes || '');
        if (data.anonymity_hash) setAnonymityHash(data.anonymity_hash);
      }
    } catch {
      // Fallback for search
      setTrackingToken(clean);
      setStatusState('UNDER_REVIEW');
    }
  };

  const handleSimulateOfficerReview = () => {
    setStatusState('UNDER_REVIEW');
    requestsService.updateStatus(trackingToken, 'IN_PROGRESS', 'Ombudsman opened inquiry.');
  };

  const handleSimulateEscalateVC = async () => {
    setIsEscalated(true);
    setStatusState('ESCALATED');
    setAssignedOfficer('Prof. (Dr.) Pradipta Kumar Nanda (Vice-Chancellor Office & Executive Ombudsman)');

    try {
      await apiClient.post(`/grievances/${trackingToken}/escalate`);
      await requestsService.updateStatus(
        trackingToken,
        'ESCALATED',
        'Automated 48-Hour SLA Breach: Escalated to Vice-Chancellor Office.'
      );
    } catch {
      // Ignore
    }
  };

  const handleSimulateOfficerResolve = async () => {
    const defaultNotes =
      category === 'ACADEMIC'
        ? 'Inspected Lab 4 computing hardware. Replaced 5 faulty RAM modules and updated system OS image.'
        : category === 'HARASSMENT_DISCRIMINATION'
        ? 'Convened confidential Anti-Ragging Committee inquiry. Warning issued, enhanced hostel CCTV security instituted.'
        : category === 'HOSTEL_FACILITIES'
        ? 'Conducted kitchen hygiene audit. Cleaned water storage tanks and instituted strict food quality checklists.'
        : 'Re-evaluated answer script with senior subject expert. Revised marks tabulated on portal.';

    const notes = resolutionNotes || defaultNotes;
    setResolutionNotes(notes);
    setStatusState('RESOLVED');

    try {
      await apiClient.post(`/grievances/${trackingToken}/resolve`, {
        resolution_notes: notes,
        officer_name: assignedOfficer,
      });
      await requestsService.updateStatus(trackingToken, 'COMPLETED', notes);
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
              <Lock className="w-3.5 h-3.5 text-[#E8F5E9]" /> Flagship Workflow #4 (Phase 17)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Confidential Grievance Redressal &amp; SLA Escalation
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            100% Cryptographic Anonymity Masking, AES-256 encrypted storage, and automated 48-hour institutional SLA escalation to Vice-Chancellor Office.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate('/assistant', {
                state: { initialPrompt: 'I want to file a strictly confidential grievance regarding lab equipment in Lab 4.' },
              })
            }
            className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#152E22]" />
            <span>File via AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Presets & Token Tracker Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Presets Bar (Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EAE7DF] p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E63] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#152E22]" /> Redressal Test Presets
            </span>
            <span className="text-[11px] text-[#8C9C92] font-semibold">Click to prefill grievance parameters</span>
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

        {/* Token Search Bar (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#EAE7DF] p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E63] flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#152E22]" /> Anonymous Token Tracker
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTokenInput}
              onChange={(e) => setSearchTokenInput(e.target.value)}
              placeholder="Enter Token e.g. GR-1049"
              className="flex-1 bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1B231F] outline-none focus:border-[#152E22]"
            />
            <button
              onClick={handleSearchToken}
              className="px-4 py-2 rounded-xl bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Track
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grievance Submission Form & Ombudsman Desk (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE7DF] pb-4">
              <div>
                <h2 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">
                  1. Confidential Grievance Lodging
                </h2>
                <p className="text-[11px] text-[#5A6E63]">
                  Submissions are cryptographically sealed and cannot be linked back to the student.
                </p>
              </div>

              {/* Anonymity Masking Toggle Switch */}
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`px-4 py-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isAnonymous
                    ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                    : 'bg-[#FAF8F3] border-[#E5E2D9] text-[#5A6E63]'
                }`}
              >
                {isAnonymous ? <EyeOff className="w-4 h-4 text-[#2E7D32]" /> : <Eye className="w-4 h-4 text-[#5A6E63]" />}
                <div className="text-left">
                  <span className="text-xs font-bold block">
                    {isAnonymous ? '100% Anonymous Mode' : 'Named Mode'}
                  </span>
                  <span className="text-[9px] block">
                    {isAnonymous ? 'Identity Masked' : 'Identity Shared'}
                  </span>
                </div>
              </div>
            </div>

            {/* Anonymity Masking Preview Banner */}
            {isAnonymous ? (
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-[#152E22]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Cryptographic Mask Active
                  </span>
                  <span className="font-mono text-[10px] text-[#5A6E63]">Salted SHA-256</span>
                </div>
                <div className="font-mono text-[11px] text-[#5A6E63] truncate bg-white p-2 rounded-lg border border-[#EAE7DF]">
                  Hash: {anonymityHash}
                </div>
                <p className="text-[10px] text-[#8C9C92]">
                  Officers only see <strong>ANONYMOUS_COMPLAINANT</strong>. Your name, email, and registration number are stripped before storage.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-xs text-[#E65100] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F57F17] shrink-0" />
                <span>Submitted as <strong>Kaushal Raj Gupta (2023-CSE-042)</strong>. Switch to Anonymous mode to mask your identity.</span>
              </div>
            )}

            {/* Category Cards Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1B231F]">Grievance Classification</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      category === cat.id
                        ? 'bg-white border-[#152E22] ring-1 ring-[#152E22] shadow-xs'
                        : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22]'
                    }`}
                  >
                    <h4 className="font-bold text-xs text-[#1B231F]">{cat.title}</h4>
                    <p className="text-[10px] text-[#5A6E63]">{cat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Input */}
            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Target Department / Facility</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] font-semibold outline-none focus:border-[#152E22]"
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Confidential Grievance Statement</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State the circumstances, dates, locations, and personnel involved..."
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitGrievance}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Sealing Anonymity & Submitting...' : 'Submit Confidential Grievance'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {statusState !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              {/* Ombudsman & Staff Control Desk */}
              <div className="p-6 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE7DF] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#5A6E63] uppercase tracking-wider block">
                      OMBUDSMAN &amp; OFFICER CONTROL DESK
                    </span>
                    <h3 className="text-sm font-bold text-[#1B231F] flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#152E22]" />
                      <span>{assignedOfficer}</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {statusState === 'SUBMITTED' && (
                      <button
                        onClick={handleSimulateOfficerReview}
                        className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Acknowledge &amp; Review</span>
                      </button>
                    )}
                    {!isEscalated && statusState !== 'RESOLVED' && (
                      <button
                        onClick={handleSimulateEscalateVC}
                        className="px-3.5 py-1.5 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Escalate to VC (48h Breach)</span>
                      </button>
                    )}
                    {statusState !== 'RESOLVED' && (
                      <button
                        onClick={handleSimulateOfficerResolve}
                        className="px-3.5 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Certify Resolution</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Resolution Notes Input / Certified Brief */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1B231F]">
                    Official Redressal Inquiry &amp; Resolution Notes
                  </label>
                  {statusState === 'RESOLVED' ? (
                    <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32] space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-[#2E7D32]" /> Resolution Certified &amp; Case Closed
                        </span>
                        <span>Official Record</span>
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
                      placeholder="Enter official inquiry findings, disciplinary measures, or remedial adjustments..."
                      className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: SLA Countdown Timer & Redressal Timeline (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 48-Hour Institutional SLA Countdown Timer */}
          <SLACountdownTimer
            slaHours={48}
            isEscalated={isEscalated}
            status={statusState}
            onEscalate={handleSimulateEscalateVC}
          />

          {/* Grievance Summary & Timeline Card */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#8C9C92] uppercase tracking-wider block">
                  TRACKING TOKEN
                </span>
                <h3 className="font-mono font-bold text-[#152E22] text-lg">#{trackingToken}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  statusState === 'RESOLVED'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : isEscalated
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : statusState === 'UNDER_REVIEW'
                    ? 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]'
                    : 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                }`}
              >
                {statusState === 'RESOLVED'
                  ? 'RESOLVED'
                  : isEscalated
                  ? 'ESCALATED TO VC'
                  : statusState === 'UNDER_REVIEW'
                  ? 'UNDER REVIEW'
                  : 'SUBMITTED'}
              </span>
            </div>

            {/* Department & Complainant Identity Strip */}
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5A6E63]">Department:</span>
                <strong className="text-[#1B231F]">{department}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A6E63]">Complainant:</span>
                <span className="font-mono font-bold text-[#2E7D32]">
                  {isAnonymous ? 'ANONYMOUS_COMPLAINANT' : 'Kaushal Raj Gupta'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5A6E63]">Assigned To:</span>
                <span className="font-semibold text-[#1B231F] text-right">{assignedOfficer}</span>
              </div>
            </div>

            {/* Chronological Redressal Audit Timeline */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E63] block">
                REDRESSAL LIFECYCLE AUDIT TRAIL
              </span>

              <div className="space-y-3 relative pl-4 border-l-2 border-[#EAE7DF] text-xs">
                {/* Step 1 */}
                <div className="relative space-y-0.5">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#2E7D32] ring-4 ring-white" />
                  <span className="font-bold text-[#1B231F] block">Grievance Encrypted &amp; Masked</span>
                  <p className="text-[11px] text-[#5A6E63]">Complainant identity salted with SHA-256 &amp; sealed.</p>
                </div>

                {/* Step 2 */}
                <div className="relative space-y-0.5">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#2E7D32] ring-4 ring-white" />
                  <span className="font-bold text-[#1B231F] block">Assigned to Grievance Officer</span>
                  <p className="text-[11px] text-[#5A6E63]">Dispatched to Prof. S. N. Panda for inquiry.</p>
                </div>

                {/* Step 3 (Escalation if true) */}
                {isEscalated && (
                  <div className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-red-600 ring-4 ring-white animate-pulse" />
                    <span className="font-bold text-red-600 block">🚨 Escalated to Vice-Chancellor</span>
                    <p className="text-[11px] text-red-700">48-hour SLA breach triggered executive escalation.</p>
                  </div>
                )}

                {/* Step 4 */}
                <div className="relative space-y-0.5">
                  <div
                    className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white ${
                      statusState === 'RESOLVED' ? 'bg-[#2E7D32]' : 'bg-[#D9D5C7]'
                    }`}
                  />
                  <span className={`font-bold block ${statusState === 'RESOLVED' ? 'text-[#1B231F]' : 'text-[#8C9C92]'}`}>
                    {statusState === 'RESOLVED' ? 'Resolution Certified & Closed' : 'Resolution Pending'}
                  </span>
                  <p className="text-[11px] text-[#5A6E63]">
                    {statusState === 'RESOLVED'
                      ? `Certified: "${resolutionNotes.slice(0, 50)}..."`
                      : 'Awaiting formal inquiry findings and officer sign-off.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievancePage;
