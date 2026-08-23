import React from 'react';
import { ShieldCheck, QrCode, Download, Printer, MapPin, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

export interface DigitalAccessPassProps {
  accessPassCode: string;
  studentName: string;
  studentRegNo: string;
  labName: string;
  roomNo: string;
  dateSlot: string;
  purpose: string;
  approverName: string;
  qrPayload?: string;
  onDownload?: () => void;
}

export const DigitalAccessPass: React.FC<DigitalAccessPassProps> = ({
  accessPassCode = 'PASS-LAB-AI-88192',
  studentName = 'Rahul Sharma',
  studentRegNo = '2023-CSE-042',
  labName = 'Advanced AI Lab',
  roomNo = 'Room C-204',
  dateSlot = 'Tomorrow (24 Aug 2026), 14:00 - 16:00',
  purpose = 'B.Tech Capstone Project Work',
  approverName = 'Prof. A. K. Samanta',
  onDownload,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-700/80 max-w-xl mx-auto space-y-6 relative overflow-hidden animate-fade-in">
      {/* Background Subtle Pattern Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Permit Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
              Official Entry Permit
            </span>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              SOA Digital Access Pass
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {accessPassCode}
        </span>
      </div>

      {/* QR Code Matrix & Permit Key Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-sm relative z-10">
        {/* Visual Simulated QR Code Box */}
        <div className="w-32 h-32 bg-white rounded-xl p-2.5 flex flex-col items-center justify-center shrink-0 shadow-subtle text-slate-900 space-y-1">
          <QrCode className="w-20 h-20 text-slate-900" />
          <span className="text-[8px] font-mono font-bold uppercase text-slate-500 tracking-tighter">
            SCAN AT ENTRY GATE
          </span>
        </div>

        {/* Slot & Room Metadata */}
        <div className="space-y-2 text-xs text-slate-300 min-w-0">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{roomNo} ({labName})</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{dateSlot}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Student: <strong className="text-white">{studentName}</strong> ({studentRegNo})</span>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
            Sign-off: <strong className="text-emerald-400">{approverName}</strong> (Lab In-Charge)
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="space-y-2 text-xs text-slate-300 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Usage Guidelines & Policy
        </span>
        <ul className="space-y-1 text-[11px] text-slate-300">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Carry physical SOA Student ID card at all times inside laboratory.
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Permit auto-terminates strictly at end of slot time.
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Food and beverages strictly prohibited inside GPU computing lab.
          </li>
        </ul>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-3 relative z-10">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified HITL Approval
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          <button
            onClick={onDownload || (() => alert('Downloading official SOA Digital Access Permit...'))}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
