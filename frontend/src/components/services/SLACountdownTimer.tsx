import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SLACountdownTimerProps {
  createdAt?: string;
  slaHours?: number;
  isEscalated?: boolean;
}

export const SLACountdownTimer: React.FC<SLACountdownTimerProps> = ({
  slaHours = 48,
  isEscalated = false,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const percentageRemaining = Math.max(0, Math.min(100, (timeLeft.hours / slaHours) * 100));

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-700 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Clock className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Institutional SLA Resolution Guarantee</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
          isEscalated
            ? 'bg-red-500/20 text-red-300 border-red-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {isEscalated ? 'ESCALATED TO VICE CHANCELLOR' : `${slaHours}-Hour SLA Active`}
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">
          {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Time Remaining</span>
      </div>

      {/* SLA Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000"
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Submitted</span>
          <span>Auto-Escalation Deadline (48 Hours)</span>
        </div>
      </div>
    </div>
  );
};
