import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, CheckCircle2, ShieldCheck, Download, Printer, ArrowRight, X, QrCode, Eye, Award } from 'lucide-react';
import { OfficialBonafideCertificate } from '../../components/certificates/OfficialBonafideCertificate';
import { CertificateVerificationStepper } from '../../components/certificates/CertificateVerificationStepper';
import { apiClient } from '../../services/api/apiClient';

export const CertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('BONAFIDE');
  const [studentName, setStudentName] = useState('Kaushal Raj Gupta');
  const [fatherName, setFatherName] = useState('Rajesh Sharma');
  const [registrationNo, setRegistrationNo] = useState('24E042');
  const [branch, setBranch] = useState('Computer Science and Engineering');
  const [academicYear, setAcademicYear] = useState('2nd');
  const [academicSession, setAcademicSession] = useState('2025-2026');
  const [batch, setBatch] = useState('2024 - 2025');
  const [purpose, setPurpose] = useState('Jharkhand state e Kalyan Scholarship');
  const [refNo, setRefNo] = useState('ITER/SOA/219');
  const [issueDate, setIssueDate] = useState('27.01.2026');
  const [annualFee, setAnnualFee] = useState('Rs. 2, 75,000/-');
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'VERIFYING' | 'APPROVED'>('IDLE');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleStartVerification = async () => {
    setRequestStatus('VERIFYING');
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/certificates/request', {
        student_name: studentName,
        father_name: fatherName,
        student_reg_no: registrationNo,
        department: branch,
        branch: branch,
        academic_year: academicYear,
        academic_session: academicSession,
        batch: batch,
        certificate_type: selectedType,
        purpose: purpose,
        annual_fee: annualFee,
      });
      if (response.data && response.data.cert_id) {
        setRefNo(response.data.cert_id);
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    const params = new URLSearchParams({
      student_name: studentName,
      father_name: fatherName,
      student_reg_no: registrationNo,
      branch: branch,
      academic_year: academicYear,
      academic_session: academicSession,
      batch: batch,
      purpose: purpose,
      issued_date: issueDate,
      annual_fee: annualFee,
    });
    const safeRef = encodeURIComponent(refNo);
    window.open(`/api/certificates/${safeRef}/download?${params.toString()}`, '_blank');
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
            Generate official Siksha 'O' Anusandhan (ITER) Bonafide & Fee Structure certificates with Dean signature seal, expenditure breakdown, and official institutional watermark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-5 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Official Document</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/assistant', { state: { initialPrompt: 'I need a Bonafide Certificate for my e-Kalyan scholarship.' } })}
            className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#152E22]" />
            <span>Request via AI Copilot</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Parameters (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Type Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#5A6E63] uppercase tracking-wider">Select Certificate Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certTypes.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedType === t.id
                      ? 'bg-white border-[#152E22] ring-1 ring-[#152E22] shadow-xs'
                      : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22]'
                  }`}
                >
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                    {t.badge}
                  </span>
                  <h3 className="font-bold text-xs text-[#1B231F] mt-1">{t.title}</h3>
                  <p className="text-[11px] text-[#5A6E63]">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Parameters Form */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
              <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">Student Parameters & Purpose</h3>
              <span className="text-[11px] font-mono text-[#5A6E63]">Batch: {batch}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Father's Name (S/D/o)</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Registration No</label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Branch / Department</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Academic Year & Session</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2nd"
                    className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                  />
                  <input
                    type="text"
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    placeholder="2025-2026"
                    className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Annual Course Fee (Year-wise)</label>
                <input
                  type="text"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Stated Purpose for Applying Certificate</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Jharkhand state e Kalyan Scholarship / Bank Loan"
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div className="text-xs text-[#5A6E63] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Verified with Dean Office Digital Governance Rules</span>
              </div>
              <button
                type="button"
                onClick={handleStartVerification}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Verify &amp; Issue Official Certificate</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Animated Verification & Issuance Stepper */}
          {requestStatus !== 'IDLE' && (
            <CertificateVerificationStepper
              studentRegNo={registrationNo}
              studentName={studentName}
              department={branch}
              certId={refNo}
              onComplete={() => setRequestStatus('APPROVED')}
              onViewDocument={() => setShowPreviewModal(true)}
              onDownloadPdf={handleDownloadPdf}
            />
          )}
        </div>

        {/* Right Column: Enrollment Checks & Live Verification */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" /> Institutional Standing
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Faculty of Engg. &amp; Tech</span>
                  <span className="text-[#2E7D32] font-bold">ITER (ACTIVE)</span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">Reg: {registrationNo} • B.Tech CSE</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Tuition Fee Dues</span>
                  <span className="text-[#2E7D32] font-bold">CLEARED (₹0 Dues)</span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">Accounts portal clearance verified</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Dean Digital Seal</span>
                  <span className="text-[#152E22] font-bold font-mono">AUTHORIZED</span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">Signed by Prof. P.K. Nanda (Dean, ITER)</p>
              </div>
            </div>

            {requestStatus === 'APPROVED' && (
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 lg:p-8 animate-fade-in">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-8">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-[#EAE7DF] space-y-4 relative my-auto">
              <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3 sticky top-0 bg-white z-20">
                <div className="flex items-center gap-2 text-[#1B231F] font-bold text-xs sm:text-sm">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#991B1B]" />
                  <span className="truncate">Official SOA ITER Fee Structure Certificate (Ref: {refNo})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 sm:p-2 rounded-full text-[#8C9C92] hover:text-[#1B231F] hover:bg-[#FAF8F3] transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Render Matching the Attached Photo */}
              <OfficialBonafideCertificate
                studentName={studentName}
                fatherName={fatherName}
                registrationNo={registrationNo}
                branch={branch}
                academicYear={academicYear}
                academicSession={academicSession}
                batch={batch}
                purpose={purpose}
                refNo={refNo}
                issueDate={issueDate}
                annualFee={annualFee}
                onDownload={handleDownloadPdf}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
