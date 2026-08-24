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
  ShieldCheck
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

  const serviceCategories = [
    {
      id: 'admissions',
      title: 'Admissions',
      subtitle: 'Programs, eligibility, applications',
      icon: GraduationCap,
      iconBg: 'bg-[#E8F1FF] text-[#2563EB]',
      target: '/services/lab-booking',
    },
    {
      id: 'academics',
      title: 'Academics',
      subtitle: 'Courses, exams, academic records',
      icon: BookOpen,
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      target: '/services/lab-booking',
    },
    {
      id: 'finance',
      title: 'Finance',
      subtitle: 'Fees, refunds, scholarships',
      icon: Wallet,
      iconBg: 'bg-[#ECFDF5] text-[#059669]',
      target: '/services/certificate',
    },
    {
      id: 'hostel',
      title: 'Hostel',
      subtitle: 'Allotment, leave, facilities',
      icon: Building,
      iconBg: 'bg-[#FFF7ED] text-[#EA580C]',
      target: '/services/maintenance',
    },
    {
      id: 'documents',
      title: 'Documents',
      subtitle: 'Certificates, transcripts, NOCs',
      icon: FileText,
      iconBg: 'bg-[#EFF6FF] text-[#1D4ED8]',
      target: '/services/certificate',
    },
    {
      id: 'grievances',
      title: 'Grievances',
      subtitle: 'Report issues, track resolution',
      icon: ShieldAlert,
      iconBg: 'bg-[#FEF2F2] text-[#DC2626]',
      target: '/services/grievance',
    },
    {
      id: 'other',
      title: 'Other Services',
      subtitle: 'Transport, events, more',
      icon: Grid,
      iconBg: 'bg-[#F3F4F6] text-[#4B5563]',
      target: '/requests',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto font-sans text-[#1B231F] py-4">
      {/* 1. Center Hero Greeting (Exact Match to Image 2) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative py-6">
        <span className="text-xs font-semibold text-[#6B7280]">
          Good evening, {user?.name ? user.name.split(' ')[0] : 'Kaushal'}.
        </span>

        <div className="relative inline-block">
          {/* Blue Orbit Ring */}
          <div className="absolute -inset-4 border border-[#2563EB]/30 rounded-full blur-xs animate-pulse pointer-events-none"></div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-[#1B231F] leading-tight relative z-10">
            How can we help<br />
            you <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">today?</span>
          </h1>
        </div>

        {/* Centered Search Box */}
        <form onSubmit={handleSearchSubmit} className="pt-4 max-w-2xl mx-auto space-y-3">
          <div className="bg-white border-2 border-[#2563EB]/40 rounded-full p-2 pl-6 flex items-center justify-between shadow-lg shadow-[#2563EB]/5 hover:border-[#2563EB] transition-all">
            <div className="flex items-center gap-3 flex-1">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Describe your request in your own words..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1B231F] placeholder-[#9CA3AF] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-11 h-11 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0 shadow-md"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#4B5563]">
            <button
              type="button"
              onClick={() => setSearchInput('Check application status')}
              className="px-4 py-2 rounded-full bg-white border border-[#E5E7EB] hover:border-[#2563EB] shadow-2xs transition-all"
            >
              Check application status
            </button>
            <button
              type="button"
              onClick={() => setSearchInput('Request a document')}
              className="px-4 py-2 rounded-full bg-white border border-[#E5E7EB] hover:border-[#2563EB] shadow-2xs transition-all"
            >
              Request a document
            </button>
            <button
              type="button"
              onClick={() => setSearchInput('File a grievance')}
              className="px-4 py-2 rounded-full bg-white border border-[#E5E7EB] hover:border-[#2563EB] shadow-2xs transition-all"
            >
              File a grievance
            </button>
            <button
              type="button"
              onClick={() => setSearchInput('Track my request')}
              className="px-4 py-2 rounded-full bg-white border border-[#E5E7EB] hover:border-[#2563EB] shadow-2xs transition-all"
            >
              Track my request
            </button>
          </div>
        </form>
      </div>

      {/* 2. Explore Services Grid (7 Horizontal Cards - Exact Match to Image 2) */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1B231F]">Explore services</h2>
          <button
            onClick={() => navigate('/requests')}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            View all services <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(cat.target)}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 hover:border-[#2563EB] shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <div className={`w-11 h-11 rounded-2xl ${cat.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-xs text-[#1B231F] group-hover:text-[#2563EB] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-[#6B7280] leading-snug">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Two Column Workspace Grid: Recent Activity & Service Status (Exact Match to Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        {/* Left Card: Your recent activity */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
            <h3 className="font-bold text-xs text-[#1B231F]">Your recent activity</h3>
            <button onClick={() => navigate('/requests')} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Row 1 */}
            <div
              onClick={() => navigate('/requests')}
              className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#2563EB]">Transcript Request</h4>
                  <p className="text-[10px] text-[#6B7280]">Records Office</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB]">
                  In Progress
                </span>
                <span className="text-[#9CA3AF] text-[10px] font-mono">23 Aug, 2026</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2563EB]" />
              </div>
            </div>

            {/* Row 2 */}
            <div
              onClick={() => navigate('/services/certificate')}
              className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#2563EB]">Bonafide Certificate</h4>
                  <p className="text-[10px] text-[#6B7280]">Academic Section</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8FF] text-[#9333EA]">
                  Under Review
                </span>
                <span className="text-[#9CA3AF] text-[10px] font-mono">21 Aug, 2026</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2563EB]" />
              </div>
            </div>

            {/* Row 3 */}
            <div
              onClick={() => navigate('/requests')}
              className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#2563EB]">Hostel Allotment</h4>
                  <p className="text-[10px] text-[#6B7280]">Hostel Office</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3F4F6] text-[#6B7280]">
                  Closed
                </span>
                <span className="text-[#9CA3AF] text-[10px] font-mono">18 Aug, 2026</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2563EB]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Service status */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
            <h3 className="font-bold text-xs text-[#1B231F]">Service status</h3>
            <span className="text-[11px] font-bold text-[#059669] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
              All systems operational
            </span>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Admissions', icon: GraduationCap },
              { name: 'Academics', icon: BookOpen },
              { name: 'Finance', icon: Wallet },
              { name: 'Hostel', icon: Building },
              { name: 'Documents', icon: FileText },
              { name: 'Grievances', icon: ShieldAlert },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-transparent hover:border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#1B231F]">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Operational
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 text-xs font-semibold text-[#6B7280] flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5" />
        <span>Secure. Private. Built for students.</span>
      </div>
    </div>
  );
};

export default ServicesDirectoryPage;
