import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ROLES_MAP } from '../../data/mockUsers';
import { Role } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemoUser } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  const [email, setEmail] = useState('student@soa.ac.in');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    const matched = DEMO_ROLES_MAP.find((r) => r.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(email);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please select one of the seeded demo accounts.');
    }
  };

  const handleQuickDemoLogin = (role: Role) => {
    loginAsDemoUser(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-wide">SOA NEXUS AI</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Human-in-the-Loop Agentic AI for Autonomous Institutional Service Delivery
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Prototype Authentication & RBAC
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a role to test role-isolated service dashboards</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Account Role</label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleSelect(e.target.value as Role)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Student">Student (Kaushal Raj Gupta)</option>
                <option value="Faculty">Faculty (Dr. Sunita Panigrahi)</option>
                <option value="Lab_In_Charge">Lab In-Charge (Prof. A. K. Samanta)</option>
                <option value="Maintenance_Staff">Maintenance Staff (Rajesh Kumar)</option>
                <option value="Admin">System Administrator (Officer Patnaik)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              Sign In to SOA Service Hub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Pills */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> One-Click Demo Role Switcher
            </span>

            <div className="space-y-2">
              {DEMO_ROLES_MAP.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo.role)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-left flex items-center justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{demo.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                        {demo.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{demo.description}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          SIH Prototype Environment — SOA IDEATHON 2026 (Problem Statement SOAIDEATHON-S1)
        </p>
      </div>
    </div>
  );
};
