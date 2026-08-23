import React, { useState } from 'react';
import { Bot, CheckCircle2, ShieldAlert, Clock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export interface ActionStepData {
  step_number: number;
  title: string;
  description: string;
  status: string; // PASSED, CHECKED, PENDING_APPROVAL, IN_PROGRESS, COMPLETED, PENDING
  assigned_actor: string;
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
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ plan, onSubmitForApproval, onCancel }) => {
  const [submitted, setSubmitted] = useState(false);

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStepStatusPill = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PASSED':
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASSED
          </span>
        );
      case 'CHECKED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> CHECKED
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" /> PENDING APPROVAL
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            IN PROGRESS
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-4 max-w-2xl my-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-slate-900 tracking-wide uppercase">
            AI Proposed ReAct Action Execution Plan
          </span>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeStyle(plan.risk_level)}`}>
          Risk Level: {plan.risk_level}
        </span>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-600 font-medium">
        {plan.summary}
      </p>

      {/* Human Approval Gating Banner */}
      {plan.requires_approval && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Human-in-the-Loop Gating: Requires sign-off from <strong>{plan.assigned_approver_role || 'Faculty / Admin'}</strong>.</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-200 text-amber-900 uppercase">
            GATED
          </span>
        </div>
      )}

      {/* Ordered Steps List */}
      <div className="space-y-2.5 pt-1">
        {plan.steps.map((step) => (
          <div
            key={step.step_number}
            className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-500">Step {step.step_number}:</span>
                <span className="font-bold text-slate-900">{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-500">{step.description}</p>
              <span className="text-[10px] text-slate-400 block pt-0.5">Actor: {step.assigned_actor}</span>
            </div>

            <div className="shrink-0">
              {getStepStatusPill(step.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        {submitted ? (
          <div className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Request Submitted Successfully! Track status under `#LB-4019` in My Requests.</span>
          </div>
        ) : (
          <>
            <div className="text-[11px] text-slate-400 font-medium">
              Review plan before submitting to approval queue.
            </div>

            <div className="flex gap-2">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  setSubmitted(true);
                  if (onSubmitForApproval) onSubmitForApproval(plan);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
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
