import React from 'react';
import { ShieldCheck, QrCode, Download, Printer, MapPin, Calendar, Clock, User, CheckCircle2, Cpu, Hash } from 'lucide-react';

export interface DigitalAccessPassProps {
  accessPassCode: string;
  studentName: string;
  studentRegNo: string;
  labName: string;
  roomNo: string;
  workstationNo?: number;
  dateSlot: string;
  purpose: string;
  approverName: string;
  qrPayload?: string;
  gpuNodes?: string;
  onDownload?: () => void;
}

export const DigitalAccessPass: React.FC<DigitalAccessPassProps> = ({
  accessPassCode = 'PASS-LAB-AI-88192',
  studentName = 'Kaushal Raj Gupta',
  studentRegNo = '2023-CSE-042',
  labName = 'Advanced AI & GPU Computing Lab',
  roomNo = 'Room C-204',
  workstationNo = 14,
  dateSlot = 'Tomorrow (24 Aug 2026), 14:00 - 16:00',
  purpose = 'B.Tech Major Capstone Project Work (Deep Learning Training)',
  approverName = 'Prof. A. K. Samanta',
  qrPayload,
  gpuNodes = 'NVIDIA RTX 4090 (24GB VRAM)',
  onDownload,
}) => {
  const qrDisplayPayload = qrPayload || `SOA-NEXUS-PASS|${accessPassCode}|LAB-AI-101|${roomNo}|SEAT-${workstationNo}|${dateSlot}|${studentRegNo}|SIG:VERIFIED_HITL`;

  const handleDownloadPass = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    // Generate text/JSON permit metadata download or trigger browser print
    const passData = `=====================================================
SIKSHA 'O' ANUSANDHAN (DEEMED TO BE UNIVERSITY) - ITER
OFFICIAL LABORATORY ACCESS PERMIT (DIGITAL QR PASS)
=====================================================
Permit ID: ${accessPassCode}
Student: ${studentName} (${studentRegNo})
Department: Computer Science & Engineering
Laboratory: ${labName} (${roomNo})
Assigned Workstation: Node #${workstationNo}
Hardware Profile: ${gpuNodes}
Slot Time: ${dateSlot}
Stated Purpose: ${purpose}
HITL Approver: ${approverName} (Lab In-Charge)
QR Verification Signature: ${qrDisplayPayload}
=====================================================`;
    const blob = new Blob([passData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOA_Lab_Pass_${accessPassCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#2E5E45] max-w-xl mx-auto space-y-6 relative overflow-hidden text-left animate-fade-in">
      {/* Background Subtle Institutional Watermark */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Permit Header */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#E8F5E9] border border-white/20 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A5D6A7] block">
              Official SOA Entry Permit
            </span>
            <h3 className="font-serif-title font-bold text-white text-base tracking-tight">
              SOA Digital Access Pass
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
          {accessPassCode}
        </span>
      </div>

      {/* QR Code Matrix & Workstation Card */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white/10 p-5 rounded-2xl border border-white/15 backdrop-blur-xs relative z-10">
        {/* Visual QR Code Display */}
        <div className="w-32 h-32 bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center shrink-0 shadow-xs text-[#152E22] space-y-1">
          <QrCode className="w-20 h-20 text-[#152E22]" />
          <span className="text-[8px] font-mono font-bold uppercase text-[#5A6E63] tracking-tighter">
            SCAN AT ENTRY GATE
          </span>
        </div>

        {/* Slot & Workstation Details */}
        <div className="space-y-2 text-xs text-[#E0DDD2] min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-white font-bold text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#A5D6A7] shrink-0" />
              {roomNo} ({labName})
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#2E7D32] text-white text-[10px] font-bold">
              Seat #{workstationNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#A5D6A7] shrink-0" />
            <span>{dateSlot}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#A5D6A7] shrink-0" />
            <span>Student: <strong className="text-white">{studentName}</strong> ({studentRegNo})</span>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#A5D6A7] shrink-0" />
            <span className="truncate">{gpuNodes}</span>
          </div>

          <div className="text-[11px] text-[#A5D6A7] pt-1.5 border-t border-white/15 flex items-center justify-between">
            <span>Sign-off: <strong>{approverName}</strong></span>
            <span className="font-mono text-[9px] text-[#E0DDD2]">HMAC-SHA256 Signed</span>
          </div>
        </div>
      </div>

      {/* Usage Policy */}
      <div className="space-y-1.5 text-xs bg-white/5 p-4 rounded-2xl border border-white/10 relative z-10 text-[#E0DDD2]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5D6A7] block">
          Usage Guidelines & Policy
        </span>
        <ul className="space-y-1 text-[11px]">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#A5D6A7] shrink-0" />
            Carry physical SOA Student ID card at all times inside laboratory.
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#A5D6A7] shrink-0" />
            Permit auto-terminates strictly at end of slot time.
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="pt-1 flex items-center justify-between gap-3 relative z-10">
        <span className="text-[11px] text-[#A5D6A7] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPass}
            className="px-4 py-2 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalAccessPass;
