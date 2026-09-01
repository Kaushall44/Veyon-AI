import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, UserPlus, LogIn, Lock, Mail, User as UserIcon, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ROLES_MAP } from '../../data/mockUsers';
import { Role } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loginAsDemoUser } = useAuth();
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  const [email, setEmail] = useState('student@soa.ac.in');
  const [password, setPassword] = useState('Pass@123');
  
  // Register state
  const [regNumber, setRegNumber] = useState('2023-CSE-105');
  const [fullName, setFullName] = useState('Ananya Mishra');
  const [registerEmail, setRegisterEmail] = useState('ananya.mishra@soa.ac.in');
  const [registerPassword, setRegisterPassword] = useState('Secret123!');
  const [registerRole, setRegisterRole] = useState('Student');
  const [registerDept, setRegisterDept] = useState('Computer Science & Engineering');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    const matched = DEMO_ROLES_MAP.find((r) => r.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (registerPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        reg_number: regNumber,
        email: registerEmail,
        password: registerPassword,
        full_name: fullName,
        role: registerRole,
        department: registerDept,
      });

      if (success) {
        setSuccessMsg('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Registration failed. Please check your details.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Email or Reg Number may already exist.');
    } finally {
      setIsLoading(false);
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
            Autonomous Institutional Service Delivery & Decision Support Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-card space-y-6">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 pb-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                tab === 'login'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 pb-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                tab === 'register'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Register Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              {successMsg}
            </div>
          )}

          {/* Login Tab Form */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleSelect(e.target.value as Role)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Student">Student (Kaushal Raj Gupta)</option>
                  <option value="Faculty">Faculty (Dr. Sunita Panigrahi)</option>
                  <option value="Lab_In_Charge">Lab In-Charge (Prof. A. K. Samanta)</option>
                  <option value="Estates_Staff">Estates Lead (Rajesh Kumar)</option>
                  <option value="Grievance_Officer">Grievance Officer (Prof. S. N. Panda)</option>
                  <option value="Admin">Admin Office (Dean Academics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Sign In with JWT'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Register Tab Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Mishra"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reg Number / Emp ID</label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="2023-CSE-105"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Lab_In_Charge">Lab In-Charge</option>
                    <option value="Estates_Staff">Estates Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="ananya.mishra@soa.ac.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={registerDept}
                    onChange={(e) => setRegisterDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password (Min 8 Characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2.5 text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Creating Account...' : 'Create Account & Sign In'} <UserPlus className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Login Pills */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> One-Click Role Switcher
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
          Enterprise Authentication System — Argon2id Hashing + JWT Sessions + Refresh Cookies
        </p>
      </div>
    </div>
  );
};
