import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, Sparkles, FileText, Download, Eye, Award, ExternalLink } from 'lucide-react';

export interface VerificationStep {
  id: number;
  title: string;
  actor: string;
  description: string;
  status: 'WAITING' | 'RUNNING' | 'COMPLETED';
  latency?: string;
}

interface CertificateVerificationStepperProps {
  studentRegNo: string;
  studentName: string;
  department: string;
  certId: string;
  onComplete: () => void;
  onViewDocument: () => void;
  onDownloadPdf: () => void;
}

export const CertificateVerificationStepper: React.FC<CertificateVerificationStepperProps> = ({
  studentRegNo,
  studentName,
  department,
  certId,
  onComplete,
  onViewDocument,
  onDownloadPdf,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const initialSteps: VerificationStep[] = [
    {
      id: 1,
      title: 'Institutional Enrollment Verification',
      actor: 'ITER Academic ERP Database',
      description: `Confirmed active student registration for ${studentRegNo} in Faculty of Engg. & Tech.`,
      status: 'RUNNING',
      latency: '12ms',
    },
    {
      id: 2,
      title: 'Financial & Fee Dues Clearance',
      actor: 'SOA Accounts Gateway',
      description: 'Zero outstanding tuition or laboratory dues recorded for current academic session.',
      status: 'WAITING',
      latency: '18ms',
    },
    {
      id: 3,
      title: 'Dean Digital Signature & Seal',
      actor: 'Dean Office (Faculty of Engg. & Tech.)',
      description: 'Authorized digital signature stamp of Prof. P.K. Nanda applied to certificate record.',
      status: 'WAITING',
      latency: '24ms',
    },
    {
      id: 4,
      title: 'ReportLab PDF & Security QR Compilation',
      actor: 'SOA Nexus Document Engine',
      description: `Generated authentic watermarked PDF with verifiable QR payload (${certId}).`,
      status: 'WAITING',
      latency: '31ms',
    },
  ];

  const [steps, setSteps] = useState<VerificationStep[]>(initialSteps);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (currentStepIndex < 4) {
      timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, idx) => {
            if (idx === currentStepIndex) {
              return { ...step, status: 'COMPLETED' };
            }
            if (idx === currentStepIndex + 1) {
              return { ...step, status: 'RUNNING' };
            }
            return step;
          })
        );
        setCurrentStepIndex((prev) => prev + 1);
      }, 750);
    } else {
      setIsFinished(true);
      onComplete();
    }

    return () => clearTimeout(timer);
  }, [currentStepIndex, onComplete]);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex) / 4) * 100));

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-md text-left space-y-6 relative overflow-hidden transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EDE4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#2E7D32]" /> Autonomous Agentic Verification
            </span>
            <span className="text-[11px] font-mono font-bold text-[#5A6E63]">
              Ref: {certId}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif-title text-[#1B231F]">
            Bonafide & Fee Structure Certificate Issuance Pipeline
          </h3>
          <p className="text-xs text-[#5A6E63]">
            Evaluating institutional standing for <strong className="text-[#1B231F]">{studentName}</strong> ({studentRegNo})
          </p>
        </div>

        {/* Live Progress Pill */}
        <div className="shrink-0 flex items-center gap-3 bg-[#FAF8F3] border border-[#E5E2D9] px-4 py-2 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] font-bold text-[#5A6E63] uppercase tracking-wider">Pipeline Progress</div>
            <div className="text-sm font-mono font-black text-[#152E22]">{progressPercent}%</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center border border-[#C8E6C9]">
            {isFinished ? (
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] animate-bounce" />
            ) : (
              <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Animated Gradient Progress Track */}
      <div className="w-full bg-[#F0EDE4] h-2 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-linear-to-r from-[#152E22] via-[#2E7D32] to-[#4CAF50] transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper Steps List */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'COMPLETED';
          const isRunning = step.status === 'RUNNING';
          const isWaiting = step.status === 'WAITING';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCompleted
                  ? 'bg-[#E8F5E9]/30 border-[#C8E6C9] shadow-2xs'
                  : isRunning
                  ? 'bg-white border-[#152E22] ring-2 ring-[#152E22]/20 shadow-xs scale-[1.01]'
                  : 'bg-[#FAF8F3]/60 border-[#E5E2D9] opacity-60'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                {/* Step Icon Badge */}
                <div className="shrink-0 pt-0.5 sm:pt-0">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isRunning ? (
                    <div className="w-7 h-7 rounded-full bg-[#152E22] text-white flex items-center justify-center shadow-xs animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#E5E2D9] text-[#5A6E63] font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Step Description */}
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1B231F]">
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-medium text-[#5A6E63] bg-white px-2 py-0.5 rounded-md border border-[#E5E2D9]">
                      {step.actor}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#5A6E63] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Status Pill on Right */}
              <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-center pl-10 sm:pl-0">
                {isCompleted && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED ({step.latency})</span>
                  </div>
                )}
                {isRunning && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#152E22] bg-[#FAF8F3] px-2.5 py-1 rounded-full border border-[#D9D5C7] animate-pulse">
                    <span>PROCESSING...</span>
                  </div>
                )}
                {isWaiting && (
                  <span className="text-[10px] font-semibold text-[#8C9C92]">
                    QUEUED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Ready Action Callout */}
      {isFinished && (
        <div className="p-5 rounded-2xl bg-[#152E22] text-white space-y-4 animate-fade-in shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#E8F5E9]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#E8F5E9] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" /> Official Document Issued & Digitally Signed
                </div>
                <div className="text-sm font-semibold text-white">
                  SOA ITER Bonafide & Fee Structure Certificate ({certId}) is ready.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onViewDocument}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" /> View Certificate
              </button>
              <button
                type="button"
                onClick={onDownloadPdf}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#FAF8F3] text-[#152E22] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#152E22]" /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateVerificationStepper;
