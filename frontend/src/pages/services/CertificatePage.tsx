import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, CheckCircle2, ShieldCheck, Download, Printer, ArrowRight, X, QrCode } from 'lucide-react';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';

export const CertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('BONAFIDE');
  const [studentName, setStudentName] = useState('Kaushal Raj Gupta');
  const [fatherName, setFatherName] = useState('Rajesh Sharma');
  const [registrationNo, setRegistrationNo] = useState('23CSE042');
  const [branch, setBranch] = useState('Computer Science and Engineering');
  const [academicYear, setAcademicYear] = useState('2nd year');
  const [purpose, setPurpose] = useState('Jharkhand state e Kalyan Scholarship');
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'PLAN_GENERATED' | 'APPROVED'>('IDLE');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const certTypes = [
    {
      id: 'BONAFIDE',
      title: 'Fee Structure & Bonafide Certificate',
      sub: 'Official ITER SOA certificate for e-Kalyan Scholarship, Bank Loan, or Passport.',
      badge: 'Official Template',
      color: 'border-[#152E22] bg-[#E8F5E9]/50',
    },
    {
      id: 'CONDUCT',
      title: 'Character & Conduct Certificate',
      sub: 'Official character certification for employment or higher studies.',
      badge: '1 Day Processing',
      color: 'border-[#E5E2D9] bg-[#FAF8F3]',
    },
    {
      id: 'GRADE_TRANSCRIPT',
      title: 'Official Academic Transcript',
      sub: 'Certified semester marksheets and CGPA transcript.',
      badge: '2 Days Processing',
      color: 'border-[#E5E2D9] bg-[#FAF8F3]',
    },
  ];

  const demoActionPlan: ActionPlanData = {
    intent: 'CERTIFICATE',
    risk_level: 'MEDIUM',
    requires_approval: true,
    assigned_approver_role: 'Faculty',
    summary: '4-Step Execution Plan to issue official ITER Fee Structure & Bonafide Certificate PDF.',
    steps: [
      {
        step_number: 1,
        title: 'Verify Student Active Enrollment',
        description: `Confirmed active registration no. ${registrationNo} in ITER CSE Department.`,
        status: 'PASSED',
        assigned_actor: 'Academic Database',
      },
      {
        step_number: 2,
        title: 'Validate Purpose & Fee Clearance',
        description: 'No pending tuition fee dues recorded for current semester.',
        status: 'CHECKED',
        assigned_actor: 'Accounts Service',
      },
      {
        step_number: 3,
        title: 'Dean / Academic Officer Sign-off',
        description: 'Routed to Dean, Faculty of Engg. & Tech., ITER for approval.',
        status: 'PENDING_APPROVAL',
        assigned_actor: 'DEAN (Faculty of Engg. & Tech., ITER)',
      },
      {
        step_number: 4,
        title: 'Generate Official Watermarked PDF',
        description: 'Create tamper-proof ITER PDF certificate with embedded verification QR code.',
        status: 'PENDING',
        assigned_actor: 'PDF Engine',
      },
    ],
  };

  const handleGeneratePlan = () => {
    setRequestStatus('PLAN_GENERATED');
  };

  const handleSimulateApprove = () => {
    setRequestStatus('APPROVED');
    setShowPreviewModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#E8F5E9]" /> Official ITER SOA Template
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Fee Structure & Bonafide Certificate Portal
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Generate official Siksha 'O' Anusandhan (ITER) Bonafide & Fee Structure certificates with Dean signature seal and scannable QR verification code.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'I need a Bonafide Certificate for my passport application.' } })}
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Request via AI Copilot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Type Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#5A6E63] uppercase tracking-wider">Select Certificate Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certTypes.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedType(cert.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedType === cert.id
                      ? `${cert.color} border-[#152E22] shadow-xs ring-1 ring-[#152E22]`
                      : 'bg-white border-[#E5E2D9] hover:border-[#152E22]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                      {cert.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1B231F] text-xs">{cert.title}</h3>
                  <p className="text-[11px] text-[#5A6E63] line-clamp-2">{cert.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Request Form */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">Student Parameters & Purpose</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 font-semibold text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Father's Name (S/D/o)</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 font-semibold text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Registration No</label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 font-mono font-bold text-[#152E22] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B231F] mb-1">Branch / Department</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 font-semibold text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Stated Purpose for Applying Certificate</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Jharkhand state e Kalyan Scholarship, Bank Education Loan..."
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Generate ReAct Execution Plan</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {requestStatus !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[#2E7D32] text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Auto-Verification Passed. Click to issue signed official ITER PDF certificate.</span>
                </div>
                <button
                  onClick={handleSimulateApprove}
                  className="px-5 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sign & Issue ITER Certificate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Enrollment Checks & Preview Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" /> ITER Enrollment Checks
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Faculty of Engg. & Tech</span>
                  <span className="text-[#2E7D32] font-bold">ITER (ACTIVE)</span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">Reg: {registrationNo}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Tuition Fee Dues</span>
                  <span className="text-[#2E7D32] font-bold">CLEARED (₹0 Dues)</span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">Accounts portal clearance verified</p>
              </div>
            </div>

            {requestStatus === 'APPROVED' && (
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> View Official ITER PDF Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official SOA ITER Fee Structure & Bonafide Certificate Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAE7DF] space-y-6 relative">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-4">
              <div className="flex items-center gap-2 text-[#1B231F] font-bold text-sm">
                <FileText className="w-5 h-5 text-[#B91C1C]" />
                <span>Official SOA ITER Fee Structure Certificate (Ref: ITER/SOA/219)</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-full text-[#8C9C92] hover:text-[#1B231F] hover:bg-[#FAF8F3] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Container Matching Photograph Exact Template */}
            <div className="bg-[#fffdf9] border border-slate-300 p-6 sm:p-8 rounded-2xl relative space-y-4 text-black font-serif shadow-inner overflow-x-auto">
              {/* Header */}
              <div className="flex justify-between items-start border-b-0 pb-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-900 text-white font-bold flex flex-col items-center justify-center text-[9px] text-center leading-tight shrink-0">
                    <span>SIKSHA 'O'</span>
                    <span>ANUSANDHAN</span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-black text-red-900 uppercase tracking-wide">
                      SIKSHA 'O' ANUSANDHAN
                    </h2>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">
                      (A Deemed to be University declared u/s 3 of UGC Act, 1956)
                    </p>
                    <p className="text-[11px] font-bold text-slate-700">
                      Accredited (3rd Cycle) by NAAC with A++ Grade
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-bold space-y-1 shrink-0">
                  <div>Ref: <strong>ITER/SOA/219</strong></div>
                  <div>Date: <strong>27.01.2026</strong></div>
                </div>
              </div>

              {/* Title Block */}
              <div className="border-t-2 border-b-2 border-black text-center py-2 my-3">
                <h3 className="text-base sm:text-lg font-black tracking-wider uppercase">FEE STRUCTURE CERTIFICATE</h3>
                <p className="text-[11px] font-bold tracking-wide uppercase">FOR B. TECH. PROGRAMME 2024 - 2028 BATCH</p>
              </div>

              {/* Body Text */}
              <p className="text-xs sm:text-sm leading-relaxed text-justify">
                This is to certify that Mr./Ms. <strong>{studentName}</strong> S/D/o <strong>{fatherName}</strong> bearing Registration No <strong>{registrationNo}</strong> is a bonafide student of Faculty of Engineering and Technology (Institute of Technical Education & Research), Siksha 'O' Anusandhan Deemed to be University and studying in {academicYear} in <strong>B. Tech. – {branch}</strong> branch during the academic session 2025-2026. This certificate is issued for applying <strong>{purpose}</strong>.
              </p>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full border border-[#D9D5C7] text-xs font-bold text-[#1B231F] hover:bg-[#FAF8F3] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button
                  onClick={() => alert('Downloading official watermarked SOA ITER Fee Structure Certificate PDF (Ref: ITER/SOA/219)...')}
                  className="px-6 py-2 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Official PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
