import React from 'react';
import { Bot, FileText, Wrench, ShieldAlert, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface QuickServiceGridProps {
  onLaunchService: (cardId: string, prompt: string) => void;
}

export const QuickServiceGrid: React.FC<QuickServiceGridProps> = ({ onLaunchService }) => {
  const serviceCards = [
    {
      id: 'lab-booking',
      title: 'Book AI Lab Slot',
      subtitle: 'Reserve Workstations & GPU Computing Slots',
      prompt: 'I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.',
      icon: Bot,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80',
      badgeText: 'Flagship Service',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      hoverBorder: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
    },
    {
      id: 'certificate',
      title: 'Request Certificate',
      subtitle: 'Bonafide Fee Structure PDF Generation',
      prompt: 'I need a Bonafide Certificate for my passport application.',
      icon: FileText,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
      badgeText: 'Instant PDF',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
    },
    {
      id: 'maintenance',
      title: 'Report Maintenance',
      subtitle: 'HVAC, Electrical & Hostel Repair Tickets',
      prompt: 'The AC in C-Block Room 302 is leaking water and making noise.',
      icon: Wrench,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/80',
      badgeText: 'Odia / Hindi NLU',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80',
      hoverBorder: 'hover:border-amber-300 hover:shadow-amber-500/10',
    },
    {
      id: 'grievance',
      title: 'File Grievance',
      subtitle: 'Confidential Redressal & Identity Masking',
      prompt: 'I want to submit a formal grievance regarding non-functional computers in Lab 4.',
      icon: ShieldAlert,
      iconBg: 'bg-red-50 text-red-600 border border-red-200/80',
      badgeText: 'Encrypted',
      badgeColor: 'bg-red-50 text-red-700 border-red-200/80',
      hoverBorder: 'hover:border-red-300 hover:shadow-red-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Quick Institutional Services
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">Select a service card to open execution wizard</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onLaunchService(card.id, card.prompt)}
              className={`bg-white p-5 rounded-3xl border border-slate-200/90 ${card.hoverBorder} shadow-card hover:shadow-modal hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor}`}>
                    {card.badgeText}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs font-bold text-slate-800 border-t border-slate-100">
                <span className="group-hover:text-indigo-600 transition-colors">Launch Service</span>
                <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
