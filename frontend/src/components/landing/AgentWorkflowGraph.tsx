import React from 'react';
import { 
  Bot, 
  Database, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  Cpu, 
  Lock, 
  QrCode,
  ArrowRight,
  Server,
  Zap
} from 'lucide-react';

export interface AgentWorkflowGraphProps {
  currentStep: number; // 1, 2, 3, 4
  onSelectStep?: (step: number) => void;
  interactive?: boolean;
}

export const AgentWorkflowGraph: React.FC<AgentWorkflowGraphProps> = ({
  currentStep = 1,
  onSelectStep,
  interactive = false,
}) => {
  return (
    <div className="relative w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden font-sans text-left transition-all select-none">
      {/* Top Diagram Header Strip */}
      <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#152E22]">
            LIVE MULTI-AGENT EXECUTION GRAPH
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#5A6E63]">Phase {currentStep}/4:</span>
          <span className="text-[10px] font-bold text-[#152E22] bg-white px-2 py-0.5 rounded-full border border-[#E5E2D9]">
            {currentStep === 1
              ? 'Task Ingestion'
              : currentStep === 2
              ? 'Autonomous Planning'
              : currentStep === 3
              ? 'Tool Execution'
              : 'Human-in-the-Loop Gate'}
          </span>
        </div>
      </div>

      {/* SVG Connection Network Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 600 380"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#152E22" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>

        {/* Path 1: Task Entry -> Orchestrator */}
        <path
          d="M 120 55 L 300 100"
          stroke={currentStep >= 1 ? '#152E22' : '#E5E2D9'}
          strokeWidth="1.5"
          strokeDasharray={currentStep >= 1 ? '4 4' : 'none'}
          className={currentStep >= 1 ? 'animate-flow-dash' : ''}
          fill="none"
        />

        {/* Path 2: Orchestrator -> Research Specialist */}
        <path
          d="M 300 135 L 140 180"
          stroke={currentStep >= 2 ? '#2E7D32' : '#E5E2D9'}
          strokeWidth="1.5"
          strokeDasharray={currentStep >= 2 ? '4 4' : 'none'}
          className={currentStep >= 2 ? 'animate-flow-dash' : ''}
          fill="none"
        />

        {/* Path 3: Orchestrator -> Analyst Specialist */}
        <path
          d="M 300 135 L 460 180"
          stroke={currentStep >= 2 ? '#2E7D32' : '#E5E2D9'}
          strokeWidth="1.5"
          strokeDasharray={currentStep >= 2 ? '4 4' : 'none'}
          className={currentStep >= 2 ? 'animate-flow-dash' : ''}
          fill="none"
        />

        {/* Path 4: Research -> Vector Store */}
        <path
          d="M 140 225 L 100 300"
          stroke={currentStep >= 3 ? '#2E7D32' : '#E5E2D9'}
          strokeWidth="1.5"
          strokeDasharray={currentStep >= 3 ? '4 4' : 'none'}
          className={currentStep >= 3 ? 'animate-flow-dash' : ''}
          fill="none"
        />

        {/* Path 5: Analyst -> Database Lock */}
        <path
          d="M 460 225 L 340 300"
          stroke={currentStep >= 3 ? '#2E7D32' : '#E5E2D9'}
          strokeWidth="1.5"
          strokeDasharray={currentStep >= 3 ? '4 4' : 'none'}
          className={currentStep >= 3 ? 'animate-flow-dash' : ''}
          fill="none"
        />

        {/* Path 6: Orchestrator -> Reviewer / Access Gate */}
        <path
          d="M 300 135 L 500 300"
          stroke={currentStep >= 4 ? '#2E7D32' : '#E5E2D9'}
          strokeWidth="1.5"
          strokeDasharray={currentStep >= 4 ? '4 4' : 'none'}
          className={currentStep >= 4 ? 'animate-flow-dash' : ''}
          fill="none"
        />
      </svg>

      {/* Layered Node Layout */}
      <div className="relative z-10 space-y-5">
        {/* ROW 1: Objective Ingestion & Central Orchestrator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          {/* User Task Card */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              currentStep >= 1
                ? 'bg-white border-[#152E22] shadow-xs ring-1 ring-[#152E22]/10'
                : 'bg-white/60 border-[#EAE7DF]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#5A6E63] uppercase tracking-wider">
                Objective Trigger
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#152E22] shrink-0" />
              <span className="text-xs font-bold text-[#1B231F] truncate">
                "Reserve GPU Lab &amp; Verify Policy"
              </span>
            </div>
          </div>

          {/* Central Orchestrator Node */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep >= 1
                ? 'bg-[#152E22] text-white border-[#1E3A2B] shadow-md'
                : 'bg-white border-[#EAE7DF]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#E8F5E9]" />
                <span className="text-xs font-bold font-serif-title tracking-wide text-white">
                  Primary Orchestrator
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white">
                ReAct Planner
              </span>
            </div>
            <p className="text-[10px] text-[#A3B8AD] leading-tight">
              Decomposing task into verified sub-agents &amp; tool invocations.
            </p>
          </div>
        </div>

        {/* ROW 2: Specialist Agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Research Specialist */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              currentStep >= 2
                ? 'bg-white border-[#2E7D32] shadow-xs'
                : 'bg-white/50 border-[#EAE7DF] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#1B231F]">Research Agent</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  currentStep >= 2
                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                    : 'bg-[#FAF8F3] text-[#8C9C92]'
                }`}
              >
                {currentStep >= 2 ? 'GROUNDED' : 'QUEUED'}
              </span>
            </div>
            <p className="text-[10px] text-[#5A6E63] leading-relaxed">
              Queries vector policy index for prerequisites &amp; lab permit constraints.
            </p>
          </div>

          {/* Analyst / Resource Specialist */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              currentStep >= 2
                ? 'bg-white border-[#2E7D32] shadow-xs'
                : 'bg-white/50 border-[#EAE7DF] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#FAF8F3] text-[#152E22] border border-[#E5E2D9] flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#1B231F]">Analyst Agent</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  currentStep >= 2
                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                    : 'bg-[#FAF8F3] text-[#8C9C92]'
                }`}
              >
                {currentStep >= 2 ? 'ALLOCATING' : 'QUEUED'}
              </span>
            </div>
            <p className="text-[10px] text-[#5A6E63] leading-relaxed">
              Verifies slot capacity, locks Workstation Node #14, checks collision matrix.
            </p>
          </div>
        </div>

        {/* ROW 3: Connected Tools & Human Sign-off Gate */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Tool 1: 768-Dim Vector Knowledge Base */}
          <div
            className={`p-2.5 rounded-2xl border transition-all text-left ${
              currentStep >= 3
                ? 'bg-white border-[#2E7D32] shadow-2xs'
                : 'bg-white/40 border-[#EAE7DF] opacity-50'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Database className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span className="text-[11px] font-bold text-[#1B231F]">768-Dim Vector Store</span>
            </div>
            <span className="text-[9px] font-mono text-[#5A6E63] block">
              Cosine Sim: 0.941 (Passed)
            </span>
          </div>

          {/* Tool 2: PostgreSQL State & Audit Log */}
          <div
            className={`p-2.5 rounded-2xl border transition-all text-left ${
              currentStep >= 3
                ? 'bg-white border-[#2E7D32] shadow-2xs'
                : 'bg-white/40 border-[#EAE7DF] opacity-50'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Server className="w-3.5 h-3.5 text-[#152E22]" />
              <span className="text-[11px] font-bold text-[#1B231F]">Deterministic DB</span>
            </div>
            <span className="text-[9px] font-mono text-[#5A6E63] block">
              Node #14 Lock Committed
            </span>
          </div>

          {/* Tool 3: Human Approver & Digital Pass Gate */}
          <div
            className={`p-2.5 rounded-2xl border transition-all text-left ${
              currentStep >= 4
                ? 'bg-[#E8F5E9] border-[#C8E6C9] shadow-2xs'
                : 'bg-white/40 border-[#EAE7DF] opacity-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span className="text-[11px] font-bold text-[#2E7D32]">HITL Gate</span>
              </div>
              <span className="text-[8px] font-bold bg-white text-[#2E7D32] px-1 py-0.2 rounded border border-[#C8E6C9]">
                {currentStep >= 4 ? 'SIGNED' : 'GATED'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#2E7D32] block truncate">
              {currentStep >= 4 ? 'QR Pass Issued (PASS-AI)' : 'Prof. Samanta Sign-off'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Step Switcher Footer (if interactive) */}
      {interactive && onSelectStep && (
        <div className="mt-4 pt-3 border-t border-[#EAE7DF] flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-[#5A6E63] uppercase">
            Click Step to Simulate:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSelectStep(s)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  currentStep === s
                    ? 'bg-[#152E22] text-white shadow-xs'
                    : 'bg-white text-[#5A6E63] border border-[#E5E2D9] hover:border-[#152E22]'
                }`}
              >
                Step {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentWorkflowGraph;
