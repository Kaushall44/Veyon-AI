import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, ShieldAlert, Clock, ArrowRight, ShieldCheck, Sparkles, Loader2, Award, Zap } from 'lucide-react';

export interface ActionStepData {
  step_number: number;
  title: string;
  description: string;
  status: string; // PASSED, CHECKED, PENDING_APPROVAL, IN_PROGRESS, COMPLETED, PENDING
  assigned_actor: string;
  latency?: string;
}

export interface ActionPlanData {
  intent: string;
  risk_level: string; // LOW, MEDIUM, HIGH
  requires_approval: boolean;
  assigned_approver_role?: string;
  summary: string;
  steps: ActionStepData[];
}

interface ActionPlanCardProps {
  plan: ActionPlanData;
  onSubmitForApproval?: (plan: ActionPlanData) => void;
  onCancel?: () => void;
  autoAnimate?: boolean;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({
  plan,
  onSubmitForApproval,
  onCancel,
  autoAnimate = false,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [animatedSteps, setAnimatedSteps] = useState<ActionStepData[]>(plan.steps);

  useEffect(() => {
    setSubmitted(false);
    setActiveStepIndex(0);
    setAnimatedSteps(plan.steps);
  }, [plan]);

  useEffect(() => {
    if (!autoAnimate || !submitted) return;

    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < animatedSteps.length) {
          setAnimatedSteps((currentSteps) =>
            currentSteps.map((s, idx) =>
              idx <= prev ? { ...s, status: 'PASSED' } : s
            )
          );
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [autoAnimate, submitted, animatedSteps.length]);

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
    }
  };

  const getStepStatusPill = (status: string, latency?: string) => {
    switch (status.toUpperCase()) {
      case 'PASSED':
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>VERIFIED {latency ? `(${latency})` : ''}</span>
          </span>
        );
      case 'CHECKED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> CHECKED
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> PENDING APPROVAL
          </span>
        );
      case 'IN_PROGRESS':
      case 'RUNNING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF8F3] text-[#152E22] border border-[#D9D5C7] flex items-center gap-1.5 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#152E22]" /> RUNNING
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FAF8F3] text-[#8C9C92] border border-[#E5E2D9]">
            QUEUED
          </span>
        );
    }
  };

  const completedCount = animatedSteps.filter(
    (s) => s.status.toUpperCase() === 'PASSED' || s.status.toUpperCase() === 'COMPLETED' || s.status.toUpperCase() === 'CHECKED'
  ).length;

  const progressPercent = Math.round((completedCount / (animatedSteps.length || 1)) * 100);

  return (
    <div className="bg-white border border-[#EAE7DF] rounded-3xl p-5 sm:p-7 shadow-md space-y-5 max-w-3xl my-3 text-left transition-all relative overflow-hidden">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EDE4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#2E7D32]" /> Autonomous ReAct Execution Plan
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeStyle(plan.risk_level)}`}>
              Risk: {plan.risk_level}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif-title text-[#1B231F]">
            {plan.intent.replace(/_/g, ' ')} Action Pipeline
          </h3>
          <p className="text-xs text-[#5A6E63] font-medium leading-relaxed">
            {plan.summary}
          </p>
        </div>

        {/* Live Progress Pill */}
        <div className="shrink-0 flex items-center gap-3 bg-[#FAF8F3] border border-[#E5E2D9] px-4 py-2 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] font-bold text-[#5A6E63] uppercase tracking-wider">Plan Completion</div>
            <div className="text-sm font-mono font-black text-[#152E22]">{progressPercent}%</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center border border-[#C8E6C9]">
            {progressPercent === 100 ? (
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] animate-bounce" />
            ) : (
              <Zap className="w-4 h-4 text-[#2E7D32]" />
            )}
          </div>
        </div>
      </div>

      {/* Animated Gradient Progress Track */}
      <div className="w-full bg-[#F0EDE4] h-2 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-linear-to-r from-[#152E22] via-[#2E7D32] to-[#4CAF50] transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Human-in-the-Loop Gating Banner */}
      {plan.requires_approval && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Human-in-the-Loop Gating: Requires sign-off from <strong>{plan.assigned_approver_role || 'Faculty / Admin'}</strong>.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-200 text-amber-900 uppercase tracking-wider shrink-0">
            GATED
          </span>
        </div>
      )}

      {/* Ordered Steps List with Micro-Animations */}
      <div className="space-y-2.5">
        {animatedSteps.map((step, idx) => {
          const isPassed =
            step.status.toUpperCase() === 'PASSED' ||
            step.status.toUpperCase() === 'COMPLETED' ||
            step.status.toUpperCase() === 'CHECKED';
          const isPendingApproval = step.status.toUpperCase() === 'PENDING_APPROVAL';

          return (
            <div
              key={step.step_number}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPassed
                  ? 'bg-[#E8F5E9]/30 border-[#C8E6C9] shadow-2xs'
                  : isPendingApproval
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-[#FAF8F3] border-[#E5E2D9]'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="shrink-0 pt-0.5 sm:pt-0">
                  {isPassed ? (
                    <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E5E2D9] text-[#5A6E63] font-mono text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-[#1B231F]">{step.title}</span>
                    <span className="text-[10px] text-[#5A6E63] bg-white px-2 py-0.5 rounded-md border border-[#E5E2D9]">
                      {step.assigned_actor}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A6E63] leading-relaxed">{step.description}</p>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-center pl-9 sm:pl-0">
                {getStepStatusPill(step.status, step.latency)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#F0EDE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {submitted ? (
          <div className="w-full p-3 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Autonomous Plan Executed &amp; Dispatched to Approver Queue!</span>
          </div>
        ) : (
          <>
            <div className="text-[11px] text-[#5A6E63] font-medium">
              Review multi-agent plan before submitting to approval queue.
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-full border border-[#D9D5C7] hover:bg-[#FAF8F3] text-[#1B231F] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(true);
                  if (onSubmitForApproval) onSubmitForApproval(plan);
                }}
                className="px-5 py-2.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit Request for Approval</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionPlanCard;
