import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Wallet,
  Building,
  FileText,
  ShieldAlert,
  Grid,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Lock,
  Clock,
  ShieldCheck,
  Cpu,
  Wrench,
  HelpCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ServicesDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim() || 'Describe your request';
    navigate('/assistant', { state: { initialPrompt: query } });
  };

  const handleTagClick = (tag: string) => {
    navigate('/assistant', { state: { initialPrompt: tag } });
  };

  const serviceCategories = [
    {
      id: 'certificates',
      title: 'Fee Structure & Bonafide Certificates',
      subtitle: 'Official signed certificates for e-Kalyan, loan, or passport verification.',
      badge: 'Instant / 1-Day',
      icon: FileText,
      iconBg: 'bg-[#E8F5E9] text-[#2E7D32]',
      target: '/services/certificate',
    },
    {
      id: 'labs',
      title: 'Advanced AI & GPU Lab Reservation',
      subtitle: 'Reserve 30 RTX 4090 & A100 workstations in Room C-204.',
      badge: 'Fast-Track (CGPA ≥ 7.5)',
      icon: Cpu,
      iconBg: 'bg-[#E8EAF6] text-[#283593]',
      target: '/services/lab-booking',
    },
    {
      id: 'maintenance',
      title: 'Campus Infrastructure & Maintenance',
      subtitle: 'Hostel room fans, lab HVAC, lighting repairs with technician dispatch.',
      badge: 'Auto-Dispatch',
      icon: Wrench,
      iconBg: 'bg-[#FFF8E1] text-[#E65100]',
      target: '/services/maintenance',
    },
    {
      id: 'grievances',
      title: 'Grievance Redressal & Anti-Ragging',
      subtitle: 'Confidential encrypted complaints with mandatory 48-hour SLA resolution.',
      badge: '48-Hour SLA Timer',
      icon: ShieldAlert,
      iconBg: 'bg-[#FFEBEE] text-[#C62828]',
      target: '/services/grievance',
    },
    {
      id: 'finance',
      title: 'Fee Payment & Accounts Verification',
      subtitle: 'PNB Collect integration, official annual tuition fees & refund rules.',
      badge: 'Accounts Section',
      icon: Wallet,
      iconBg: 'bg-[#E0F2F1] text-[#00695C]',
      target: '/services/certificate',
    },
    {
      id: 'academics',
      title: 'Academic Regulations & Policies',
      subtitle: 'Cohort-based course regulations, grading scales & promotion criteria.',
      badge: '19 IQAC Policies',
      icon: BookOpen,
      iconBg: 'bg-[#F3E5F5] text-[#6A1B9A]',
      target: '/documents',
    },
    {
      id: 'admissions',
      title: 'Admissions & SAAT Merit Info',
      subtitle: '11 B.Tech engineering branches, MCA, BCA & document verification.',
      badge: '2026 Catalog',
      icon: GraduationCap,
      iconBg: 'bg-[#E1F5FE] text-[#0277BD]',
      target: '/documents',
    },
    {
      id: 'all_requests',
      title: 'All Student Requests & Approvals',
      subtitle: 'Unified audit tracker for pending, under-review, and approved requests.',
      badge: 'Live Status',
      icon: Grid,
      iconBg: 'bg-[#EFECE3] text-[#152E22]',
      target: '/requests',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* 1. Official Institutional Banner */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-[#E8F5E9]" /> SOA ITER Service Directory
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Institutional Services & Resource Hub
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-2xl leading-relaxed">
            One-stop central gateway for laboratory bookings, official certificates, infrastructure maintenance, academic circulars, and grievance redressal at Siksha 'O' Anusandhan.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'Show me available university services and how to apply.' } })}
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#152E22]" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* 2. Natural Language AI Prompt Bar */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-[#1B231F]">
            State your requirement in your own words.
          </h2>
          <p className="text-xs text-[#5A6E63]">
            Our AI Agent will automatically extract the intent, verify prerequisite eligibility, and route it to the designated dean or lab in-charge.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="bg-white border border-[#D9D5C7] rounded-full p-2 pl-5 flex items-center justify-between shadow-xs hover:border-[#152E22] focus-within:border-[#152E22] transition-all">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-4 h-4 text-[#8C9C92]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder='e.g. "I want to reserve the AI Lab for tomorrow" or "Apply for a Bonafide Certificate"'
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1B231F] placeholder-[#8C9C92] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#4A5D52] pt-1">
            <button
              type="button"
              onClick={() => handleTagClick('Book AI Lab tomorrow from 2 PM to 4 PM')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              ⚡ Book GPU Lab Slot
            </button>
            <button
              type="button"
              onClick={() => handleTagClick('Request a Bonafide Certificate for my passport application')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              📄 Request Bonafide Certificate
            </button>
            <button
              type="button"
              onClick={() => handleTagClick('AC leaking in C-Block Room 204')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              🔧 Report Campus Issue
            </button>
            <button
              type="button"
              onClick={() => handleTagClick('Submit a confidential grievance')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              🛡️ File Confidential Grievance
            </button>
          </div>
        </form>
      </div>

      {/* 3. Service Catalogs Grid (8 Primary University Desks) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E63] block">
              CAMPUS DIRECTORY
            </span>
            <h2 className="text-xl font-serif-title font-bold text-[#1B231F]">
              Explore University Service Desks
            </h2>
          </div>
          <button
            onClick={() => navigate('/requests')}
            className="text-xs font-bold text-[#152E22] hover:underline flex items-center gap-1"
          >
            Track All Requests <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(cat.target)}
                className="bg-white rounded-3xl border border-[#EAE7DF] p-5 hover:border-[#152E22] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl ${cat.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] text-[#5A6E63]">
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#1B231F] group-hover:text-[#152E22] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-[#5A6E63] mt-1 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#FAF8F3] flex items-center justify-between text-xs font-bold text-[#152E22]">
                  <span>Access Desk</span>
                  <ChevronRight className="w-4 h-4 text-[#8C9C92] group-hover:text-[#152E22] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Workspace: Live Institutional Health & Quick Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Active Request Status (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#152E22]" />
                <h3 className="font-bold text-[#1B231F] text-xs uppercase tracking-wider">
                  RECENT SERVICE ACTIVITY
                </h3>
              </div>
              <button
                onClick={() => navigate('/requests')}
                className="text-xs font-bold text-[#152E22] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Row 1: Lab Booking */}
              <div
                onClick={() => navigate('/services/lab-booking')}
                className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">
                      AI Lab Reservation (Room C-204)
                    </h4>
                    <p className="text-[11px] text-[#5A6E63]">Tomorrow, 14:00 - 16:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                    Confirmed
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9C92] group-hover:text-[#152E22]" />
                </div>
              </div>

              {/* Row 2: Bonafide */}
              <div
                onClick={() => navigate('/services/certificate')}
                className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">
                      Bonafide Certificate PDF
                    </h4>
                    <p className="text-[11px] text-[#5A6E63]">Academic Section</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EAF6] text-[#283593]">
                    Under Review
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9C92] group-hover:text-[#152E22]" />
                </div>
              </div>

              {/* Row 3: Maintenance */}
              <div
                onClick={() => navigate('/services/maintenance')}
                className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">
                      Classroom AC Service Order
                    </h4>
                    <p className="text-[11px] text-[#5A6E63]">Estates Department</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8E1] text-[#E65100]">
                    Dispatched
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9C92] group-hover:text-[#152E22]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Institutional System Health (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#152E22]" />
                <h3 className="font-bold text-[#1B231F] text-xs uppercase tracking-wider">
                  CAMPUS SERVICE STATUS
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                All Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'GPU Lab C-204 Workstations', status: '25/30 Free', icon: Cpu },
                { name: 'Certificate PDF Engine', status: 'Active (Dean Seal)', icon: FileText },
                { name: 'Estates Work Order Dispatch', status: 'Normal SLA', icon: Wrench },
                { name: '48-Hr Grievance Gateway', status: 'Encrypted Queue', icon: ShieldAlert },
                { name: 'PNB Collect Fee Integration', status: 'Synchronized', icon: Wallet },
                { name: 'RAG Knowledge Retriever', status: '19 IQAC Policies', icon: BookOpen },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-[#1B231F] truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2E7D32] shrink-0 bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] font-medium text-[#5A6E63] flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#8C9C92]" />
            <span>End-to-End Encrypted Institutional Service Bus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDirectoryPage;
