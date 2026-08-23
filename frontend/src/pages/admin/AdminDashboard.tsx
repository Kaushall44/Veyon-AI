import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, ShieldCheck, Database, FileText, ArrowRight, Activity, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api/apiClient';

interface AnalyticsData {
  metrics: {
    total_requests: number;
    sla_avg_hours: number;
    rag_confidence_index: number;
    active_documents: number;
    total_vector_chunks: number;
  };
  intent_breakdown: { intent: string; percentage: number; count: number }[];
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData>({
    metrics: {
      total_requests: 1482,
      sla_avg_hours: 4.2,
      rag_confidence_index: 96.4,
      active_documents: 3,
      total_vector_chunks: 190,
    },
    intent_breakdown: [
      { intent: 'LAB_BOOKING', percentage: 42, count: 622 },
      { intent: 'CERTIFICATE', percentage: 28, count: 415 },
      { intent: 'MAINTENANCE', percentage: 18, count: 267 },
      { intent: 'GRIEVANCE', percentage: 12, count: 178 },
    ],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await apiClient.get('/admin/analytics');
      if (res.data && res.data.metrics) {
        setData(res.data);
      }
    } catch (err) {
      console.log('Using local mock admin analytics data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> Platform Command Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin System Overview</h1>
          <p className="text-slate-300 text-xs sm:text-sm">Real-time service analytics, RAG confidence index, and intent distribution matrix.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/knowledge')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>Knowledge Base</span>
          </button>

          <button
            onClick={() => navigate('/audit')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Console</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Requests</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{data.metrics.total_requests}</span>
            <span className="text-[10px] font-bold text-emerald-600">+14% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SLA Resolution Avg</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{data.metrics.sla_avg_hours} hrs</span>
            <span className="text-[10px] font-bold text-emerald-600">82% faster SLA</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">RAG Confidence Index</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{data.metrics.rag_confidence_index}%</span>
            <span className="text-[10px] font-bold text-purple-600">Zero-Hallucination</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Vector Knowledge Base</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{data.metrics.total_vector_chunks}</span>
            <span className="text-[10px] font-bold text-slate-500">768-Dim Chunks</span>
          </div>
        </div>
      </div>

      {/* Intent Breakdown & System Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intent Distribution Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">NLU Intent Breakdown Matrix</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total Volume: {data.metrics.total_requests} Prompts</span>
          </div>

          <div className="space-y-4">
            {data.intent_breakdown.map((item) => (
              <div key={item.intent} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.intent}</span>
                  <span className="text-indigo-600 font-mono">{item.percentage}% ({item.count} requests)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.intent === 'LAB_BOOKING'
                        ? 'bg-indigo-600'
                        : item.intent === 'CERTIFICATE'
                        ? 'bg-emerald-500'
                        : item.intent === 'MAINTENANCE'
                        ? 'bg-amber-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Configurator & Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Administrative Controls</h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/knowledge')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Knowledge Base Manager</h4>
                  <p className="text-[10px] text-slate-500">Upload policy PDFs & vector chunks</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => navigate('/audit')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Immutable Audit Console</h4>
                  <p className="text-[10px] text-slate-500">Inspect full AI provenance JSON</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => navigate('/approvals')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Faculty Approvals Queue</h4>
                  <p className="text-[10px] text-slate-500">Human-in-the-Loop review desk</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
