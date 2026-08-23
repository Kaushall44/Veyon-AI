import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../../data/demoScenarios';
import { useAuth } from '../../context/AuthContext';

interface DemoLauncherBarProps {
  onShowToast?: (title: string, message: string) => void;
}

export const DemoLauncherBar: React.FC<DemoLauncherBarProps> = ({ onShowToast }) => {
  const navigate = useNavigate();
  const { loginAsDemoUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const handleLaunchScenario = (scenario: DemoScenario) => {
    setActiveScenarioId(scenario.id);

    // Switch role if required
    if (scenario.role === 'Student') {
      loginAsDemoUser('Student');
    }

    // Trigger toast notification
    if (onShowToast) {
      onShowToast(
        `Executing Scenario ${scenario.scenarioNumber}`,
        `Running '${scenario.title}' flow...`
      );
    }

    // Navigate to target path with initial prompt state
    setTimeout(() => {
      navigate(scenario.targetPath, {
        state: { initialPrompt: scenario.initialPrompt, scenarioId: scenario.id },
      });
    }, 150);
  };

  const handleResetDatabase = () => {
    setActiveScenarioId(null);
    loginAsDemoUser('Student');
    if (onShowToast) {
      onShowToast(
        'Database State Reset',
        'All mock requests, approval queues, and RAG caches have been restored to initial state.'
      );
    }
  };

  return (
    <div className="bg-slate-950 text-white border-b border-indigo-900/60 shadow-xl sticky top-0 z-50 transition-all font-sans">
      {/* Upper Control Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs">
        {/* Brand & Badge Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <Scale className="w-3.5 h-3.5" />
          </div>
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-lime-300 bg-clip-text text-transparent font-extrabold tracking-wider text-[11px] truncate">
              <span className="sm:hidden">Judge Bar</span>
              <span className="hidden sm:inline">SOA Nexus Hackathon Judge Bar</span>
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/80 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Offline Fallbacks Ready
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Reset State Trigger */}
          <button
            onClick={handleResetDatabase}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] border border-slate-700 transition-all flex items-center gap-1 shadow-xs"
            title="Reset Mock State"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="hidden xs:inline">Reset</span>
            <span className="xs:hidden">Reset</span>
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-all flex items-center gap-1 shadow-sm"
          >
            {isExpanded ? (
              <>
                <span className="text-[10px]">Hide</span>
                <ChevronUp className="w-3.5 h-3.5 shrink-0" />
              </>
            ) : (
              <>
                <span className="text-[10px]">5 Scenarios</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded 1-Click Scenario Buttons Strip */}
      {isExpanded && (
        <div className="border-t border-slate-800/80 bg-slate-900/90 px-3 sm:px-4 py-2.5 max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {DEMO_SCENARIOS.map((sc) => {
              const isActive = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleLaunchScenario(sc)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                    isActive
                      ? 'bg-indigo-900/60 border-indigo-500 shadow-indigo-500/20 shadow-md ring-1 ring-indigo-400'
                      : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-600/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        Scenario {sc.scenarioNumber}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {sc.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white leading-snug group-hover:text-indigo-300 transition-colors">
                      {sc.title}
                    </h4>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 mt-1.5">
                    <span className="truncate max-w-[120px]">{sc.subtitle}</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                      Run <Play className="w-2.5 h-2.5 fill-current" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
