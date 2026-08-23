import React from 'react';
import { Bot, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoLogin = (role: string) => {
    localStorage.setItem('soa_nexus_role', role);
    localStorage.setItem('soa_nexus_auth_token', `demo_token_${role}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SOA Nexus AI</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Human-in-the-Loop Agentic AI for Autonomous Institutional Service Delivery
          </p>
        </div>

        {/* Demo Quick Login Roles */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block text-center">
            Select Demo Account Role:
          </span>

          <button
            onClick={() => handleDemoLogin('Student')}
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between text-xs font-semibold text-slate-900 transition-all group"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" /> Student (Rahul Sharma)
            </span>
            <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform">Login →</span>
          </button>

          <button
            onClick={() => handleDemoLogin('Faculty')}
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between text-xs font-semibold text-slate-900 transition-all group"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Faculty / Lab In-Charge (Prof. Samanta)
            </span>
            <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform">Login →</span>
          </button>

          <button
            onClick={() => handleDemoLogin('Admin')}
            className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between text-xs font-semibold text-slate-900 transition-all group"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" /> System Administrator
            </span>
            <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform">Login →</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          SIH Prototype Demo Environment — Pre-seeded institutional accounts
        </p>
      </div>
    </div>
  );
};
