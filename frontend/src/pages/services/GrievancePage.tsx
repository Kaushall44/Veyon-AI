import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Sparkles, Lock, EyeOff, Eye, CheckCircle2, ArrowRight, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';
import { SLACountdownTimer } from '../../components/services/SLACountdownTimer';

export const GrievancePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState('ACADEMIC');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [description, setDescription] = useState('Lab equipment non-functional in Lab 4 during mid-term evaluation.');
  const [statusState, setStatusState] = useState<'IDLE' | 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED'>('IDLE');
  const [trackingToken, setTrackingToken] = useState('GR-1049');

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
    assigned_approver_role: 'Grievance_Officer',
    summary: `4-Step Confidential Execution Plan for tracking token #${trackingToken}.`,
    steps: [
      {
        step_number: 1,
        title: 'Cryptographic Identity Masking',
        description: isAnonymous
          ? 'Complainant identity strictly masked as ANONYMOUS_COMPLAINANT.'
          : 'Complainant registered as Kaushal Raj Gupta.',
        status: 'PASSED',
        assigned_actor: 'Privacy Engine',
      },
      {
        step_number: 2,
        title: 'Route to Grievance Redressal Officer',
        description: 'Assigned to Prof. S. N. Panda (Senior Grievance Redressal Officer).',
        status: 'PASSED',
        assigned_actor: 'Redressal Dispatcher',
      },
      {
        step_number: 3,
        title: 'Activate 48-Hour Auto-Escalation SLA Timer',
        description: '48-hour resolution SLA initiated. Auto-escalates to Vice-Chancellor if breached.',
        status: 'CHECKED',
        assigned_actor: 'SLA Monitor',
      },
      {
        step_number: 4,
        title: 'Log Redressal Resolution Brief',
        description: 'Officer conducts inquiry and files confidential resolution report.',
        status: statusState === 'RESOLVED' ? 'PASSED' : 'PENDING',
        assigned_actor: 'Grievance Redressal Cell',
      },
    ],
  };

  const handleSubmitGrievance = () => {
    setTrackingToken(`GR-${Math.floor(1000 + Math.random() * 9000)}`);
    setStatusState('SUBMITTED');
  };

  const handleSimulateOfficerReview = () => {
    setStatusState('UNDER_REVIEW');
  };

  const handleSimulateOfficerResolve = () => {
    setStatusState('RESOLVED');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E8F5E9]" /> Confidential Redressal Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Confidential Grievance Escalation System
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Submit academic, hostel, or discrimination complaints with strict anonymity protection and a 48-hour institutional SLA resolution guarantee.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'I want to submit a formal confidential grievance regarding lab equipment.' } })}
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>File via AI Copilot</span>
        </button>
      </div>

      {/* Confidentiality Assurance Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#FAF8F3] border border-[#E5E2D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 border border-[#C8E6C9] font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1B231F]">100% Cryptographic Anonymity Guarantee</h4>
            <p className="text-[11px] text-[#5A6E63]">
              When submitting anonymously, your student ID and email are completely stripped from all officer dashboards and logs.
            </p>
          </div>
        </div>

        {/* Anonymity Toggle */}
        <div className="flex items-center bg-white p-1 rounded-full border border-[#D9D5C7] shrink-0">
          <button
            onClick={() => setIsAnonymous(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAnonymous ? 'bg-[#152E22] text-white shadow-xs' : 'text-[#5A6E63] hover:text-[#1B231F]'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" /> Anonymous
          </button>
          <button
            onClick={() => setIsAnonymous(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              !isAnonymous ? 'bg-[#152E22] text-white shadow-xs' : 'text-[#5A6E63] hover:text-[#1B231F]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Identified
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">File Grievance Parameters</h2>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    category === cat.id
                      ? 'bg-white border-[#152E22] shadow-xs ring-1 ring-[#152E22]'
                      : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22]'
                  }`}
                >
                  <h3 className="font-bold text-[#1B231F] text-xs">{cat.title}</h3>
                  <p className="text-[11px] text-[#5A6E63]">{cat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Target Department / Wing</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 font-semibold text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Complainant Identity Status</label>
                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#D9D5C7] font-mono font-bold text-[#152E22] flex items-center justify-between text-xs">
                  <span>{isAnonymous ? 'ANONYMOUS_COMPLAINANT' : 'Rahul Sharma (2023-CSE-042)'}</span>
                  {isAnonymous && <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">MASKED</span>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Detailed Grievance Explanation</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State grievance facts..."
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitGrievance}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Submit Confidential Grievance</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {statusState !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              <div className="p-4 rounded-2xl bg-white border border-[#EAE7DF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-bold text-[#1B231F] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#B91C1C]" /> Redressal Cell Control (Officer Desk)
                </span>
                <div className="flex gap-2">
                  {statusState === 'SUBMITTED' && (
                    <button
                      onClick={handleSimulateOfficerReview}
                      className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      Begin Officer Inquiry
                    </button>
                  )}
                  {statusState === 'UNDER_REVIEW' && (
                    <button
                      onClick={handleSimulateOfficerResolve}
                      className="px-4 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sign-Off Resolution
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: SLA Countdown & Tracking Timeline */}
        <div className="space-y-6">
          {/* SLA Countdown Component */}
          <SLACountdownTimer slaHours={48} />

          {/* Tracking Token Card & Timeline */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#8C9C92] uppercase tracking-wider block">Tracking Token</span>
                <h3 className="font-mono font-bold text-[#152E22] text-base">#{trackingToken}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                statusState === 'RESOLVED'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : statusState === 'UNDER_REVIEW'
                  ? 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]'
                  : 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
              }`}>
                {statusState === 'RESOLVED' ? 'Resolved' : statusState === 'UNDER_REVIEW' ? 'Under Inquiry' : 'Submitted'}
              </span>
            </div>

            {/* Resolution Timeline */}
            <div className="space-y-3 pt-2 text-xs">
              <span className="font-bold text-[#1B231F] uppercase tracking-wider block text-[10px]">Redressal Timeline</span>
              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE7DF]">
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</div>
                  <div>
                    <h5 className="font-bold text-[#1B231F]">Grievance Submitted</h5>
                    <p className="text-[11px] text-[#5A6E63]">Identity masked as ANONYMOUS_COMPLAINANT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                    statusState === 'UNDER_REVIEW' || statusState === 'RESOLVED' ? 'bg-[#2563EB] text-white' : 'bg-[#E5E2D9] text-[#8C9C92]'
                  }`}>
                    {statusState === 'UNDER_REVIEW' || statusState === 'RESOLVED' ? '✓' : '2'}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1B231F]">Under Inquiry by Officer</h5>
                    <p className="text-[11px] text-[#5A6E63]">Assigned to Prof. S. N. Panda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                    statusState === 'RESOLVED' ? 'bg-[#2E7D32] text-white' : 'bg-[#E5E2D9] text-[#8C9C92]'
                  }`}>
                    {statusState === 'RESOLVED' ? '✓' : '3'}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1B231F]">Redressal Complete</h5>
                    <p className="text-[11px] text-[#5A6E63]">Formal resolution brief filed</p>
                  </div>
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
