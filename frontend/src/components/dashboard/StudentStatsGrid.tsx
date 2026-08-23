import React from 'react';
import { Award, CheckCircle2, Zap, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const StudentStatsGrid: React.FC = () => {
  const stats = [
    {
      label: 'Academic CGPA',
      value: '9.53 / 10',
      sub: 'Top 5% Rank in B.Tech CSE',
      icon: Award,
      badge: 'Grade O',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
      trend: '+0.12 CGPA',
      trendColor: 'text-indigo-600',
    },
    {
      label: 'Course Attendance',
      value: '93.3%',
      sub: '42 / 45 Classes Attended',
      icon: CheckCircle2,
      badge: 'Fast-Track',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      trend: 'Eligible for Permits',
      trendColor: 'text-emerald-600',
    },
    {
      label: 'Workstation Capacity',
      value: '25 / 30 Free',
      sub: 'AI Lab C-204 (Tomorrow)',
      icon: Zap,
      badge: 'Available',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200/60',
      trend: 'Low Congestion',
      trendColor: 'text-purple-600',
    },
    {
      label: 'Governance Audit',
      value: '100% Provenance',
      sub: 'Human-in-the-Loop Active',
      icon: ShieldCheck,
      badge: 'HITL Gated',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/60',
      trend: 'Audit Verified',
      trendColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-card hover:shadow-modal hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">
                {item.label}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight block tracking-tight">
                  {item.value}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold truncate block mt-0.5">
                  {item.sub}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-100 font-semibold">
              <span className={`flex items-center gap-0.5 ${item.trendColor}`}>
                <span>{item.trend}</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
              <span className="text-[10px] text-slate-400">Updated Real-time</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
