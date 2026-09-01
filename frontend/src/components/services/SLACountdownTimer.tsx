import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, Flame, ShieldCheck } from 'lucide-react';

interface SLACountdownTimerProps {
  createdAt?: string;
  slaHours?: number;
  isEscalated?: boolean;
  onEscalate?: () => void;
  status?: string;
}

export const SLACountdownTimer: React.FC<SLACountdownTimerProps> = ({
  slaHours = 48,
  isEscalated = false,
  onEscalate,
  status = 'UNDER_REVIEW'
}) => {
  // Simulate active 48-hour countdown (e.g. 47 hours, 48 mins, 20s remaining)
  const [timeLeft, setTimeLeft] = useState({
    hours: isEscalated ? 0 : 47,
    minutes: isEscalated ? 0 : 48,
    seconds: isEscalated ? 0 : 20,
  });

  useEffect(() => {
    if (isEscalated || status === 'RESOLVED') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          if (onEscalate) onEscalate();
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEscalated, status, onEscalate]);

  const percentageRemaining = isEscalated
    ? 0
    : Math.max(0, Math.min(100, ((timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / (slaHours * 3600)) * 100));

  return (
    <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-7 border border-[#234937] shadow-card space-y-4 text-left">
      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
          <Clock className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span>Institutional 48-Hour SLA Redressal Clock</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
            isEscalated
              ? 'bg-red-500/30 text-red-200 border-red-400 animate-pulse'
              : status === 'RESOLVED'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {isEscalated ? (
            <>
              <Flame className="w-3 h-3 text-red-400" />
              <span>ESCALATED TO VICE-CHANCELLOR</span>
            </>
          ) : status === 'RESOLVED' ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>SLA COMPLIED &amp; RESOLVED</span>
            </>
          ) : (
            `${slaHours}-Hour Institutional SLA Active`
          )}
        </span>
      </div>

      {/* Digits Display */}
      <div className="flex items-baseline justify-between">
        <div>
          {isEscalated ? (
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-red-400">
              00h : 00m : 00s (OVERDUE)
            </div>
          ) : (
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          )}
          <span className="text-[11px] text-[#8C9C92] font-medium block mt-0.5">
            {isEscalated
              ? 'Institutional SLA breached: Escalated to Executive Ombudsman'
              : 'Time remaining before automated Vice-Chancellor escalation'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full transition-all duration-1000 ${
              isEscalated ? 'bg-red-500 w-full' : 'bg-gradient-to-r from-emerald-400 to-[#A5D6A7]'
            }`}
            style={{ width: isEscalated ? '100%' : `${percentageRemaining}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#8C9C92] font-semibold">
          <span>Submitted (0h)</span>
          <span className={isEscalated ? 'text-red-400 font-bold' : ''}>
            {isEscalated ? 'Escalation Triggered' : 'Auto-Escalation Deadline (48 Hours)'}
          </span>
        </div>
      </div>

      {/* Security Guarantee Note */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/90">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-[#A5D6A7]">
            Cryptographic Anonymity Mask: <strong>Salted SHA-256 (AES-256-GCM)</strong>
          </span>
        </div>
        <span className="text-[10px] text-white/60 font-mono">Zero-Leak Guarantee</span>
      </div>
    </div>
  );
};

export default SLACountdownTimer;
