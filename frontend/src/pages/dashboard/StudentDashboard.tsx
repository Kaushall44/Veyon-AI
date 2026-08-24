import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  Hourglass,
  ArrowRight,
  Plus,
  Bell,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Send,
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [promptInput, setPromptInput] = useState('');
  const [warningMessage, setWarningMessage] = useState<string | null>(
    (location.state as { unauthorizedWarning?: string })?.unauthorizedWarning || null
  );

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promptInput.trim() || 'check my transcript status';
    navigate('/assistant', { state: { initialPrompt: query } });
  };

  const handleTagClick = (tagPrompt: string) => {
    navigate('/assistant', { state: { initialPrompt: tagPrompt } });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-[#1B231F]">
      {/* Access Denied Warning Toast Banner */}
      {warningMessage && (
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-4 flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3 text-[#E65100] text-xs font-semibold">
            <ShieldAlert className="w-5 h-5 text-[#F57F17] shrink-0" />
            <span>{warningMessage}</span>
          </div>
          <button
            onClick={() => setWarningMessage(null)}
            className="text-[#E65100] hover:text-[#BF360C] p-1 rounded-lg hover:bg-[#FFECB3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Main Hero Request Box (Exact Match to Image 3) */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#1B231F] leading-tight">
            State your request.<br />
            <span className="text-[#152E22] italic font-normal">We will route it to the right desk.</span>
          </h1>
        </div>

        {/* Search Input Box (Exact Match to Image 3) */}
        <form onSubmit={handlePromptSubmit} className="space-y-3">
          <div className="bg-white border border-[#D9D5C7] rounded-full p-2 pl-5 flex items-center justify-between shadow-xs hover:border-[#152E22] focus-within:border-[#152E22] transition-all">
            <div className="flex items-center gap-3 flex-1">
              <Plus className="w-5 h-5 text-[#8C9C92]" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder='Describe your request — e.g. "check my transcript status"'
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

          {/* Quick Tag Pills (Exact Match to Image 3) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#4A5D52] pt-1">
            <button
              type="button"
              onClick={() => handleTagClick('Check application status')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              Check application status
            </button>
            <button
              type="button"
              onClick={() => handleTagClick('File a confidential grievance')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              File a grievance
            </button>
            <button
              type="button"
              onClick={() => handleTagClick('Request a Bonafide Certificate')}
              className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all"
            >
              Request a document
            </button>
          </div>
        </form>
      </div>

      {/* 2. AT A GLANCE (4 Metric Cards - Exact Match to Image 3) */}
      <div className="space-y-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E63] text-left">
          👁 AT A GLANCE
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: In Progress */}
          <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8C9C92] uppercase block">In Progress</span>
              <span className="text-2xl font-serif-title font-bold text-[#1B231F] block leading-tight">02</span>
              <span className="text-[10px] text-[#5A6E63] font-medium block">Requests being processed</span>
            </div>
          </div>

          {/* Card 2: Under Review */}
          <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#E8EAF6] text-[#283593] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8C9C92] uppercase block">Under Review</span>
              <span className="text-2xl font-serif-title font-bold text-[#1B231F] block leading-tight">01</span>
              <span className="text-[10px] text-[#5A6E63] font-medium block">Requests awaiting review</span>
            </div>
          </div>

          {/* Card 3: Resolved */}
          <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8C9C92] uppercase block">Resolved</span>
              <span className="text-2xl font-serif-title font-bold text-[#1B231F] block leading-tight">05</span>
              <span className="text-[10px] text-[#5A6E63] font-medium block">Requests completed</span>
            </div>
          </div>

          {/* Card 4: Avg. Resolution Time */}
          <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#F3E5F5] text-[#6A1B9A] flex items-center justify-center shrink-0">
              <Hourglass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8C9C92] uppercase block">Avg. Resolution Time</span>
              <span className="text-2xl font-serif-title font-bold text-[#1B231F] block leading-tight">2.4 <span className="text-xs font-sans font-semibold">days</span></span>
              <span className="text-[10px] text-[#5A6E63] font-medium block">This month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 3-Column Layout: Active Requests, Announcements, Need Help (Exact Match to Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: YOUR ACTIVE REQUESTS (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#152E22]" />
                <h3 className="font-bold text-[#1B231F] text-xs uppercase tracking-wider">YOUR ACTIVE REQUESTS</h3>
              </div>
              <button
                onClick={() => navigate('/requests')}
                className="text-xs font-bold text-[#152E22] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div
                onClick={() => navigate('/requests')}
                className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">Transcript Request</h4>
                    <p className="text-[11px] text-[#5A6E63]">Records Office</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                    In Progress
                  </span>
                  <span className="text-[#8C9C92] font-mono text-[10px]">Aug 23, 2026</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9C92] group-hover:text-[#152E22]" />
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => navigate('/services/certificate')}
                className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">Bonafide Certificate</h4>
                    <p className="text-[11px] text-[#5A6E63]">Academic Section</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EAF6] text-[#283593]">
                    Under Review
                  </span>
                  <span className="text-[#8C9C92] font-mono text-[10px]">Aug 21, 2026</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9C92] group-hover:text-[#152E22]" />
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => navigate('/requests')}
                className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] hover:border-[#152E22] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DDD2] text-[#152E22] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">Hostel Allotment</h4>
                    <p className="text-[11px] text-[#5A6E63]">Hostel Office</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFECE3] text-[#5A6E63]">
                    Closed
                  </span>
                  <span className="text-[#8C9C92] font-mono text-[10px]">Aug 18, 2026</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C9C92] group-hover:text-[#152E22]" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/requests')}
            className="w-full py-2.5 rounded-xl bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E5E2D9] text-[#152E22] font-bold text-xs text-center transition-all cursor-pointer"
          >
            View All Requests
          </button>
        </div>

        {/* Column 2: ANNOUNCEMENTS (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#152E22]" />
                <h3 className="font-bold text-[#1B231F] text-xs uppercase tracking-wider">ANNOUNCEMENTS</h3>
              </div>
              <button className="text-xs font-bold text-[#152E22] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Ann 1 */}
              <div className="space-y-1 p-2 border-b border-[#FAF8F3]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                  <h4 className="font-bold text-xs text-[#1B231F]">Semester Registration Open</h4>
                </div>
                <p className="text-[11px] text-[#5A6E63] pl-4 leading-relaxed">
                  Register for upcoming semester by Aug 31, 2026.
                </p>
                <span className="text-[10px] font-mono text-[#8C9C92] pl-4 block">Aug 20, 2026</span>
              </div>

              {/* Ann 2 */}
              <div className="space-y-1 p-2 border-b border-[#FAF8F3]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                  <h4 className="font-bold text-xs text-[#1B231F]">Hostel Re-Registration</h4>
                </div>
                <p className="text-[11px] text-[#5A6E63] pl-4 leading-relaxed">
                  Re-registration for existing students is now open.
                </p>
                <span className="text-[10px] font-mono text-[#8C9C92] pl-4 block">Aug 18, 2026</span>
              </div>

              {/* Ann 3 */}
              <div className="space-y-1 p-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F57F17]"></span>
                  <h4 className="font-bold text-xs text-[#1B231F]">Fee Payment Reminder</h4>
                </div>
                <p className="text-[11px] text-[#5A6E63] pl-4 leading-relaxed">
                  Last date for fee payment is Aug 28, 2026.
                </p>
                <span className="text-[10px] font-mono text-[#8C9C92] pl-4 block">Aug 15, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: NEED HELP? (Span 3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EAE7DF] pb-3">
              <HelpCircle className="w-4 h-4 text-[#152E22]" />
              <h3 className="font-bold text-[#1B231F] text-xs uppercase tracking-wider">NEED HELP?</h3>
            </div>

            <p className="text-xs text-[#5A6E63] leading-relaxed">
              Our AI Assistant is here to help you 24/7.
            </p>

            <button
              onClick={() => navigate('/assistant')}
              className="w-full py-3 rounded-full bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E5E2D9] text-[#152E22] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Chat with AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 space-y-2 border-t border-[#FAF8F3]">
              <span className="text-[10px] font-bold text-[#8C9C92] uppercase tracking-wider block">
                POPULAR REQUESTS
              </span>
              <ul className="space-y-1.5 text-xs font-semibold text-[#4A5D52]">
                <li
                  onClick={() => handleTagClick('Transcript Request')}
                  className="hover:text-[#152E22] cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-3 h-3 text-[#8C9C92]" /> Transcript Request
                </li>
                <li
                  onClick={() => handleTagClick('Bonafide Certificate')}
                  className="hover:text-[#152E22] cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-3 h-3 text-[#8C9C92]" /> Bonafide Certificate
                </li>
                <li
                  onClick={() => handleTagClick('Fee Payment Receipt')}
                  className="hover:text-[#152E22] cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-3 h-3 text-[#8C9C92]" /> Fee Payment Receipt
                </li>
                <li
                  onClick={() => handleTagClick('ID Card Request')}
                  className="hover:text-[#152E22] cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-3 h-3 text-[#8C9C92]" /> ID Card Request
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HOW IT WORKS (4-Step Process Strip - Exact Match to Image 3) */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs text-left space-y-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E63] flex items-center gap-2">
          <span>🌱 HOW IT WORKS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#1B231F]">Describe your request</h4>
              <p className="text-[11px] text-[#5A6E63]">Tell us what you need</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D9D5C7] ml-auto hidden lg:block" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E8EAF6] text-[#283593] flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#1B231F]">We understand</h4>
              <p className="text-[11px] text-[#5A6E63]">AI analyzes and classifies</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D9D5C7] ml-auto hidden lg:block" />
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#1B231F]">Routed to right desk</h4>
              <p className="text-[11px] text-[#5A6E63]">Sent to responsible office</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D9D5C7] ml-auto hidden lg:block" />
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F3E5F5] text-[#6A1B9A] flex items-center justify-center font-bold text-sm shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#1B231F]">Get response</h4>
              <p className="text-[11px] text-[#5A6E63]">Track and receive updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
