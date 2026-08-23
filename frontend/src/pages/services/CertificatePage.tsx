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
      color: 'border-emerald-200 bg-emerald-50/70',
    },
    {
      id: 'CONDUCT',
      title: 'Character & Conduct Certificate',
      sub: 'Official character certification for employment or higher studies.',
      badge: '1 Day Processing',
      color: 'border-indigo-200 bg-indigo-50/70',
    },
    {
      id: 'GRADE_TRANSCRIPT',
      title: 'Official Academic Transcript',
      sub: 'Certified semester marksheets and CGPA transcript.',
      badge: '2 Days Processing',
      color: 'border-purple-200 bg-purple-50/70',
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Official ITER SOA Template
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fee Structure & Bonafide Certificate Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Generate official Siksha 'O' Anusandhan (ITER) Bonafide & Fee Structure certificates with Dean signature seal and scannable QR verification code.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'I need a Bonafide Certificate for my passport application.' } })}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
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
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Certificate Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certTypes.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedType(cert.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedType === cert.id
                      ? `${cert.color} border-emerald-500 shadow-md ring-2 ring-emerald-500/20`
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {cert.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">{cert.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{cert.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Request Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Student Parameters & Purpose</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's Name (S/D/o)</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registration No</label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch / Department</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stated Purpose for Applying Certificate</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Jharkhand state e Kalyan Scholarship, Bank Education Loan..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Generate ReAct Execution Plan</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Execution Plan Card */}
          {requestStatus !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard plan={demoActionPlan} />

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-emerald-900 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Auto-Verification Passed. Click to issue signed official ITER PDF certificate.</span>
                </div>
                <button
                  onClick={handleSimulateApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sign & Issue ITER Certificate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Enrollment Checks & Preview Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ITER Enrollment Checks
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Faculty of Engg. & Tech</span>
                  <span className="text-emerald-600 font-bold">ITER (ACTIVE)</span>
                </div>
                <p className="text-[11px] text-slate-500">Reg: {registrationNo}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Tuition Fee Dues</span>
                  <span className="text-emerald-600 font-bold">CLEARED (₹0 Dues)</span>
                </div>
                <p className="text-[11px] text-slate-500">Accounts portal clearance verified</p>
              </div>
            </div>

            {requestStatus === 'APPROVED' && (
              <button
                onClick={() => setShowPreviewModal(true)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> View Official ITER PDF Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official SOA ITER Fee Structure & Bonafide Certificate Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-modal border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileText className="w-5 h-5 text-red-700" />
                <span>Official SOA ITER Fee Structure Certificate (Ref: ITER/SOA/219)</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Container Matching Photograph Exact Template */}
            <div className="bg-[#fffdf9] border border-slate-300 p-8 rounded-2xl relative space-y-4 text-black font-serif shadow-inner">
              {/* Central Red Circular Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-8 border-double border-red-900/10 rounded-full flex flex-col items-center justify-center text-center text-red-900/10 font-bold pointer-events-none select-none">
                <div className="text-lg">SIKSHA 'O' ANUSANDHAN</div>
                <div className="text-xs font-normal my-1">(DEEMED TO BE UNIVERSITY)</div>
                <div className="text-[10px]">BHUBANESWAR, ODISHA</div>
              </div>

              {/* Header */}
              <div className="flex justify-between items-start border-b-0 pb-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-900 text-white font-bold flex flex-col items-center justify-center text-[9px] text-center leading-tight">
                    <span>SIKSHA 'O'</span>
                    <span>ANUSANDHAN</span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-red-900 uppercase tracking-wide">
                      SIKSHA 'O' ANUSANDHAN
                    </h2>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      (A Deemed to be University declared u/s 3 of UGC Act, 1956)
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      Accredited (3rd Cycle) by NAAC with A++ Grade
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-bold space-y-1">
                  <div>Ref: <strong>ITER/SOA/219</strong></div>
                  <div>Date: <strong>27.01.2026</strong></div>
                </div>
              </div>

              {/* Title Block */}
              <div className="border-t-2 border-b-2 border-black text-center py-2 my-3">
                <h3 className="text-lg font-black tracking-wider uppercase">FEE STRUCTURE CERTIFICATE</h3>
                <p className="text-xs font-bold tracking-wide uppercase">FOR B. TECH. PROGRAMME 2024 - 2028 BATCH</p>
              </div>

              {/* Body Text */}
              <p className="text-xs sm:text-sm leading-relaxed text-justify">
                This is to certify that Mr./Ms. <strong>{studentName}</strong> S/D/o <strong>{fatherName}</strong> bearing Registration No <strong>{registrationNo}</strong> is a bonafide student of Faculty of Engineering and Technology (Institute of Technical Education & Research), Siksha 'O' Anusandhan Deemed to be University and studying in {academicYear} in <strong>B. Tech. – {branch}</strong> branch during the academic session 2025-2026. This certificate is issued for applying <strong>{purpose}</strong>.
              </p>

              <p className="text-xs font-semibold">
                Year-wise expenditure for his/her studies in four year (2024-2028) B. Tech. Programme is given below:
              </p>

              {/* Fee Breakdown Table */}
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="font-bold">
                    <td className="py-1">2nd Year Annual course fee</td>
                    <td className="text-center">:</td>
                    <td className="text-right">Rs. 2,75,000/-</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 font-bold underline">Transportation Fees (Optional)</td>
                  </tr>
                  <tr>
                    <td className="pl-4">For day scholars (per Annum) – For Bhubaneswar</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 25,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">For day scholars (per Annum) – For Khordha</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 30,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">For day scholars (per Annum) – For Cuttack</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 35,000/-</td>
                  </tr>

                  <tr>
                    <td colSpan={3} className="pt-2 font-bold underline">Hostel Fees (Optional) Per Year</td>
                  </tr>
                  <tr>
                    <td className="pl-4">Boarding Charges (A.C. Room – 2 Occupancy)</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 1,25,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">Boarding Charges (A.C. Room – 3 Occupancy)</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 95,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">Boarding Charges (A.C. Room – 4 Occupancy)</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 85,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">Boarding Charges (Non A.C. Room)</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 55,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">Caution Money (One Time and Refundable)</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 5,000/-</td>
                  </tr>
                  <tr>
                    <td className="pl-4">Messing Charge – Extra (per year) Approx</td>
                    <td className="text-center">:</td>
                    <td className="text-right font-semibold">Rs. 45,000/-</td>
                  </tr>

                  <tr>
                    <td colSpan={3} className="pt-3 font-bold">
                      <div>Fees for:</div>
                      <div className="pl-4">
                        3<sup>rd</sup> Year Annual course fee – Rs. 2,75,000/-<br />
                        4<sup>th</sup> Year Annual course fee – Rs. 2,75,000/-
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Seals & Signatures */}
              <div className="flex items-end justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 rounded-full border-2 border-indigo-900 text-indigo-900 text-[8px] font-bold text-center flex flex-col items-center justify-center p-1 leading-tight -rotate-12">
                    <span>FACULTY OF ENGG. & TECH.</span>
                    <span className="font-normal text-[7px]">(ITER)</span>
                    <span>SIKSHA 'O' ANUSANDHAN</span>
                    <span className="font-normal text-[6.5px]">Bhubaneswar</span>
                  </div>

                  {/* QR Code Verification Stamp */}
                  <div className="p-2 border border-slate-300 bg-white rounded-lg text-center">
                    <QrCode className="w-10 h-10 text-slate-900 mx-auto" />
                    <span className="font-mono text-[8px] font-bold block text-slate-700">QR-SOA-ITER-219</span>
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <div className="text-indigo-900 font-serif italic text-lg font-bold">Pas</div>
                  <div className="text-[9px] text-slate-500">27.01.2026</div>
                  <h4 className="font-black text-xs uppercase">DEAN</h4>
                  <div className="text-[10px] font-bold text-slate-800">Faculty of Engg. & Tech., ITER</div>
                  <div className="text-[10px] font-bold text-slate-800">SIKSHA 'O' ANUSANDHAN</div>
                  <div className="text-[9px] text-slate-600">(Deemed to be University)</div>
                </div>
              </div>

              <div className="text-[11px] font-bold pt-2">
                NB: All payment should be made in shape of DD in favour of SIKSHA 'O' ANUSANDHAN
              </div>

              {/* Bottom Page Address Banner */}
              <div className="border-t-2 border-black pt-2 text-center text-[10px] leading-tight space-y-0.5">
                <h4 className="font-black text-xs uppercase">FACULTY OF ENGINEERING & TECHNOLOGY</h4>
                <div className="font-bold text-[11px]">Institute of Technical Education & Research</div>
                <div>Jagamohan Nagar, Khandagiri, Bhubaneswar-751030, Odisha, India</div>
                <div>Tel: 0674-2350181, 2351539, 2351777, Fax: 0674-2351880, 2351217 | www.soa.ac.in</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Official Document
              </button>
              <button
                onClick={() => alert('Downloading official watermarked SOA ITER Fee Structure Certificate PDF (Ref: ITER/SOA/219)...')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
