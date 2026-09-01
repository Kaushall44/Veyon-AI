import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { AgentWorkflowGraph } from './AgentWorkflowGraph';

interface StepData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  highlights: string[];
}

const STEPS: StepData[] = [
  {
    id: 1,
    title: 'Set the objective',
    subtitle: 'Task Ingestion & Intent Classification',
    description:
      'Natural language queries and multi-step requests enter the primary Orchestrator. Intent is classified deterministically with strict zero-hallucination guardrails.',
    tag: 'NLU INGESTION',
    highlights: ['Multi-turn natural dialogue', 'Intent routing across 4 core domains', 'Role authorization pre-check'],
  },
  {
    id: 2,
    title: 'Agents build a plan',
    subtitle: 'Autonomous Multi-Agent Task Decomposition',
    description:
      'Specialized Research and Analyst sub-agents form a declarative ReAct action plan, determining required policy checks, database mutations, and human approval prerequisites.',
    tag: 'REACT PLANNING',
    highlights: ['Specialist agent delegation', 'Dependency resolution', 'Deterministic schema generation'],
  },
  {
    id: 3,
    title: 'Tools do the work',
    subtitle: 'Vector Retrieval & Atomic Resource Allocation',
    description:
      'Sub-agents invoke external tool nodes: 768-dim vector embeddings match university circulars with cosine similarity, and atomic locks isolate workstation resources in PostgreSQL.',
    tag: 'TOOL MUTATION',
    highlights: ['768-dim vector similarity (>0.88)', 'PostgreSQL row-level locking', 'Real-time SSE event broadcast'],
  },
  {
    id: 4,
    title: 'Review the outcome',
    subtitle: 'Human-in-the-Loop Sign-off & Sealed Access Pass',
    description:
      'High-risk workflows pause at the Reviewer Gate for faculty or lab-in-charge sign-off. On approval, cryptographic QR digital access passes are generated and sealed into immutable audit logs.',
    tag: 'HITL OVERSIGHT',
    highlights: ['Real-time approval dashboard', 'HMAC-signed QR access passes', 'Immutable append-only audit trail'],
  },
];

export const WorkflowTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky container to progress steps on desktop
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const top = rect.top;
      const height = rect.height - window.innerHeight;
      
      if (height <= 0) return;

      const progress = Math.min(Math.max(-top / height, 0), 0.999);
      const stepIndex = Math.min(Math.floor(progress * 4) + 1, 4);
      setActiveStep(stepIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 bg-[#FAF9F5] border-y border-[#EAE7DF] text-left">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#152E22]/5 border border-[#152E22]/15 text-[#152E22] text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Deterministic Workflow Execution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#152E22] leading-tight">
            How agents work—with full human oversight.
          </h2>
          <p className="text-[#5A6E63] text-sm sm:text-base leading-relaxed">
            From initial user intent to policy-grounded tool execution and faculty sign-off, every step is observable, deterministic, and auditable.
          </p>
        </div>

        {/* 2-Column Sticky Container */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 4 Step Cards */}
          <div className="lg:col-span-5 space-y-4">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#152E22] shadow-sm ring-1 ring-[#152E22]/10 translate-x-1'
                      : 'bg-white/40 border-[#EAE7DF] hover:bg-white/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          isActive
                            ? 'bg-[#152E22] text-white'
                            : 'bg-[#FAF8F3] text-[#5A6E63] border border-[#E5E2D9]'
                        }`}
                      >
                        {step.id}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#5A6E63]">
                        {step.tag}
                      </span>
                    </div>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif-title font-bold text-[#152E22] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-[#2E7D32] mb-2">{step.subtitle}</p>
                  <p className="text-xs text-[#5A6E63] leading-relaxed mb-3">
                    {step.description}
                  </p>

                  {/* Highlights list */}
                  {isActive && (
                    <div className="space-y-1.5 pt-3 border-t border-[#F0EDE4] animate-fade-in">
                      {step.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-[#1B231F]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Live Agent Workflow Graph */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <AgentWorkflowGraph
              currentStep={activeStep}
              onSelectStep={setActiveStep}
              interactive={true}
            />

            {/* Contextual Sub-banner */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE7DF] flex items-center justify-between text-xs text-[#5A6E63]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-medium">
                  Guaranteed zero unauthorized side-effects without explicit gate approval.
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#152E22] bg-[#FAF8F3] px-2 py-1 rounded-md border border-[#E5E2D9]">
                ISO 27001 Provenance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowTimeline;
