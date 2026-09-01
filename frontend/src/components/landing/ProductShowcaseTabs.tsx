import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Layers, 
  ArrowRight,
  Clock,
  Sparkles,
  QrCode,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShowcaseTab {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  route: string;
  preview: React.ReactNode;
}

export const ProductShowcaseTabs: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('assistant');

  const tabs: ShowcaseTab[] = [
    {
      id: 'assistant',
      name: 'Conversational ReAct Agent',
      badge: 'MULTI-TURN NLU',
      icon: Bot,
      headline: 'Natural intent gathering with zero-hallucination policy grounding.',
      description:
        'Interactively guides students through prerequisite validation, slot selection, and declarative 4-step action plans without executing unauthorized side effects.',
      route: '/assistant',
      preview: (
        <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs space-y-4 text-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#152E22] text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1B231F]">Veyon Institutional Agent</h4>
                <p className="text-[10px] text-[#5A6E63]">Policy Ref: 2025-LAB-CIRCULAR-v4.pdf</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
              GROUNDED (0.94 score)
            </span>
          </div>

          {/* Chat Bubble Simulation */}
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#EAE7DF] text-xs text-[#1B231F] max-w-[85%]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#5A6E63] block mb-1">
                Student Request
              </span>
              "I need to book the AI Research Lab for Deep Learning tomorrow from 2 PM to 4 PM."
            </div>

            <div className="p-3.5 rounded-2xl bg-[#152E22] text-white text-xs max-w-[95%] space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#A3B8AD]">
                <Sparkles className="w-3.5 h-3.5 text-[#E8F5E9]" />
                <span>Action Plan Generated (Approval Required)</span>
              </div>
              <p className="text-[11px] text-[#E8F5E9] leading-relaxed">
                Prerequisites verified (CGPA 8.7 &gt; 7.5, Attendance 88%). Workstation Node #14 selected. Awaiting Faculty In-Charge approval.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'approvals',
      name: 'Faculty Approvals Desk',
      badge: 'HUMAN-IN-THE-LOOP',
      icon: CheckCircle2,
      headline: 'Human-in-the-loop review queue for institutional workflows.',
      description:
        'Faculty and department heads inspect structured risk levels, policy citations, and student credentials with one-click cryptographic approvals.',
      route: '/approvals',
      preview: (
        <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-ping" />
              <h4 className="text-xs font-bold text-[#1B231F]">Pending Approval Task #TASK-4018</h4>
            </div>
            <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#FDE68A]">
              WAITING REVIEW
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#EAE7DF] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B231F]">Aarav Sharma (Reg: 220101004)</span>
              <span className="font-mono text-[10px] text-[#5A6E63]">AI Lab • Workstation 14</span>
            </div>
            <p className="text-[11px] text-[#5A6E63]">
              Slot: Tomorrow, 14:00 - 16:00 • Purpose: PyTorch Distributed Training
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-[#152E22] text-white text-[10px] font-bold">
                ✓ Approve &amp; Sign Pass
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#EAE7DF] text-[#5A6E63] text-[10px] font-bold">
                ✕ Reject Request
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'audit',
      name: 'Immutable Audit Console',
      badge: 'ZERO TAMPERING',
      icon: ShieldCheck,
      headline: 'Cryptographically sealed audit logs for every agent mutation.',
      description:
        'Every intent classification, RAG retrieval score, state transition, and approver identity is saved with database triggers preventing modifications.',
      route: '/audit',
      preview: (
        <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#152E22]" />
              <h4 className="text-xs font-bold text-[#1B231F]">Append-Only PostgreSQL Provenance</h4>
            </div>
            <span className="text-[10px] font-mono text-[#5A6E63]">Trigger: NO_UPDATE_DELETE</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#152E22] text-white font-mono text-[10px] space-y-1 overflow-x-auto">
            <p className="text-[#A3B8AD]">// Structured Telemetry Payload</p>
            <p className="text-[#E8F5E9]">{`{"action": "APPROVAL_DECISION", "status": "APPROVED",`}</p>
            <p className="text-[#E8F5E9]">{` "approver": "prof.samanta@soa.ac.in",`}</p>
            <p className="text-[#E8F5E9]">{` "pass_code": "PASS-LB-2025-7894", "hash": "sha256:d8a2...3f"}`}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'knowledge',
      name: 'Vector Knowledge Base',
      badge: '768-DIM RAG',
      icon: Database,
      headline: 'Real-time policy circular ingestion & semantic vector retrieval.',
      description:
        'Upload academic policies and lab regulations. Our pipeline generates 768-dimensional embeddings with lexical fallback to ensure 100% compliant execution.',
      route: '/admin/knowledge',
      preview: (
        <div className="bg-white rounded-2xl border border-[#EAE7DF] p-5 shadow-xs space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2E7D32]" />
              <h4 className="text-xs font-bold text-[#1B231F]">Active Vector Chunks (768-Dim)</h4>
            </div>
            <span className="text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full">
              190 Chunks Indexed
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#EAE7DF] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B231F]">lab_regulations_2025.pdf</span>
              <span className="text-[10px] font-mono text-[#2E7D32]">24 Chunks • ACTIVE</span>
            </div>
            <p className="text-[10px] text-[#5A6E63]">
              "Section 4.2: AI Lab Booking Guidelines &amp; GPU Workstation Prerequisites"
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="dashboard-showcase" className="py-16 sm:py-24 bg-[#FAF8F3] text-left">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#152E22]/5 border border-[#152E22]/15 text-[#152E22] text-[11px] font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Product Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#152E22] leading-tight">
            Visibility at every step.
          </h2>
          <p className="text-[#5A6E63] text-sm sm:text-base leading-relaxed">
            Interact with live product surfaces designed for end-to-end institutional accountability.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#152E22] text-white shadow-xs'
                    : 'bg-white text-[#5A6E63] border border-[#EAE7DF] hover:border-[#152E22] hover:text-[#152E22]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive 3D Perspective Card Display */}
        <div className="perspective-1000">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-transform duration-500 hover:rotate-x-1 hover:-rotate-y-1 hover:shadow-md">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9] inline-block">
                {currentTab.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#152E22] leading-snug">
                {currentTab.headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6E63] leading-relaxed">
                {currentTab.description}
              </p>
              <button
                onClick={() => navigate(currentTab.route)}
                className="px-5 py-2.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Interactive Preview Column */}
            <div className="lg:col-span-6">{currentTab.preview}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseTabs;
