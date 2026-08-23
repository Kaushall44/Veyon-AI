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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-400" /> Confidential Redressal Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Confidential Grievance Escalation System
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Submit academic, hostel, or discrimination complaints with strict anonymity protection and a 48-hour institutional SLA resolution guarantee.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'I want to submit a formal confidential grievance regarding lab equipment.' } })}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>File via AI Copilot</span>
        </button>
      </div>

      {/* Confidentiality Assurance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-500/40 flex items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-emerald-300">100% Cryptographic Anonymity Guarantee</h4>
            <p className="text-[11px] text-slate-300">
              When submitting anonymously, your student ID and email are completely stripped from all officer dashboards and logs.
            </p>
          </div>
        </div>

        {/* Anonymity Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => setIsAnonymous(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAnonymous ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" /> Anonymous
          </button>
          <button
            onClick={() => setIsAnonymous(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isAnonymous ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Identified
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">File Grievance Parameters</h2>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    category === cat.id
                      ? 'bg-red-50 border-red-500 shadow-xs ring-2 ring-red-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-bold text-slate-900 text-xs">{cat.title}</h3>
                  <p className="text-[11px] text-slate-500">{cat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Department / Wing</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Complainant Identity Status</label>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 flex items-center justify-between">
                  <span>{isAnonymous ? 'ANONYMOUS_COMPLAINANT' : 'Rahul Sharma (2023-CSE-042)'}</span>
                  {isAnonymous && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">MASKED</span>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Grievance Explanation</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State grievance facts..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitGrievance}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Submit Confidential Grievance</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {statusState !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" /> Redressal Cell Control (Officer Desk)
                </span>
                <div className="flex gap-2">
                  {statusState === 'SUBMITTED' && (
                    <button
                      onClick={handleSimulateOfficerReview}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Begin Officer Inquiry
                    </button>
                  )}
                  {statusState === 'UNDER_REVIEW' && (
                    <button
                      onClick={handleSimulateOfficerResolve}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tracking Token</span>
                <h3 className="font-mono font-extrabold text-slate-900 text-base">#{trackingToken}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                statusState === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : statusState === 'UNDER_REVIEW'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {statusState === 'RESOLVED' ? 'Resolved' : statusState === 'UNDER_REVIEW' ? 'Under Inquiry' : 'Submitted'}
              </span>
            </div>

            {/* Resolution Timeline */}
            <div className="space-y-3 pt-2 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider block text-[10px]">Redressal Timeline</span>
              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</div>
                  <div>
                    <h5 className="font-bold text-slate-900">Grievance Submitted</h5>
                    <p className="text-[11px] text-slate-500">Identity masked as ANONYMOUS_COMPLAINANT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                    statusState === 'UNDER_REVIEW' || statusState === 'RESOLVED' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {statusState === 'UNDER_REVIEW' || statusState === 'RESOLVED' ? '✓' : '2'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Under Inquiry by Officer</h5>
                    <p className="text-[11px] text-slate-500">Assigned to Prof. S. N. Panda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                    statusState === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {statusState === 'RESOLVED' ? '✓' : '3'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Redressal Complete</h5>
                    <p className="text-[11px] text-slate-500">Formal resolution brief filed</p>
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
