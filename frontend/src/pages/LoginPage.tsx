import React, { useState } from 'react';
import { 
  Bot, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  GraduationCap, 
  Wrench, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Database,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService, RegisterPayload } from '../services/api/authService';

type TabType = 'signin' | 'register' | 'demo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('signin');
  
  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('student@soa.ac.in');
  const [signInPassword, setSignInPassword] = useState('Pass@123');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register Form State
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    full_name: '',
    reg_number: '',
    email: '',
    password: '',
    role: 'Student',
    department: 'Computer Science & Engineering'
  });
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Demo direct login handler
  const handleRoleLogin = async (role: string, email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      localStorage.setItem('soa_nexus_role', role);
      localStorage.setItem('soa_nexus_auth_token', `demo_jwt_${role.toLowerCase()}_${Date.now()}`);
      
      const authRes = await authService.loginAsDemoUser(email);
      if (authRes?.access_token) {
        localStorage.setItem('soa_nexus_auth_token', authRes.access_token);
        if (authRes.user?.role) {
          localStorage.setItem('soa_nexus_role', authRes.user.role);
        }
      }
      navigate('/dashboard');
    } catch (err: any) {
      // Fallback
      localStorage.setItem('soa_nexus_role', role);
      localStorage.setItem('soa_nexus_auth_token', `demo_token_${role}`);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In Form Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both institutional email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.login(signInEmail, signInPassword);
      if (res?.access_token) {
        localStorage.setItem('soa_nexus_auth_token', res.access_token);
        localStorage.setItem('soa_nexus_role', res.user?.role || 'Student');
        setSuccessMessage('Supabase authentication successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Invalid institutional credentials.';
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  // Register Form Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.full_name || !registerData.email || !registerData.password || !registerData.reg_number) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.register(registerData);
      if (res?.access_token) {
        localStorage.setItem('soa_nexus_auth_token', res.access_token);
        localStorage.setItem('soa_nexus_role', res.user?.role || registerData.role);
        setSuccessMessage('Account registered in Supabase successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Registration failed. Please verify your details.';
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  // Password Strength Calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passScore = getPasswordStrength(registerData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows & Micro Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      
      <div className="max-w-xl w-full relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>SOA Deemed to be University • Institutional AI Ecosystem</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <img
              src="/veyon_logo.png"
              alt="Veyon Logo"
              className="w-12 h-12 object-contain rounded-2xl shadow-lg shadow-indigo-500/25"
            />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200 font-serif-title">
              Veyon
            </h1>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Autonomous Institutional AI Service Platform with Deterministic Human-in-the-Loop Governance
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 space-y-6 transition-all duration-300">
          
          {/* Segmented Tab Navigation */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <button
              onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
              className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
              className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Register
            </button>
            <button
              onClick={() => { setActiveTab('demo'); setErrorMessage(null); }}
              className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Demo Roles
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ===================== TAB 1: SIGN IN ===================== */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> Institutional Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g., student@soa.ac.in"
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
                  </label>
                  <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter institutional password"
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Preset Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Quick Credentials Fill:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Student', email: 'student@soa.ac.in' },
                    { label: 'Faculty', email: 'faculty@soa.ac.in' },
                    { label: 'Lab In-Charge', email: 'labincharge@soa.ac.in' },
                    { label: 'Admin', email: 'admin@soa.ac.in' }
                  ].map((preset) => (
                    <button
                      key={preset.email}
                      type="button"
                      onClick={() => {
                        setSignInEmail(preset.email);
                        setSignInPassword('Pass@123');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700/60 hover:border-indigo-500/50 text-[10px] text-slate-300 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate via Supabase</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================== TAB 2: REGISTER ===================== */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.full_name}
                    onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                    placeholder="e.g., Ananya Mishra"
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-indigo-400" /> University Reg. No
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.reg_number}
                    onChange={(e) => setRegisterData({ ...registerData, reg_number: e.target.value })}
                    placeholder="e.g., 2023-CSE-099"
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-400" /> Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="e.g., ananya.m@soa.ac.in"
                  className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-400" /> Department
                  </label>
                  <select
                    value={registerData.department}
                    onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Eng.</option>
                    <option value="Electronics & Communication">Electronics & Comm.</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Campus Estates & Facilities">Campus Estates & Facilities</option>
                    <option value="Academic Administration">Academic Administration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" /> Institutional Role
                  </label>
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty Member</option>
                    <option value="Lab_In_Charge">Lab In-Charge</option>
                    <option value="Maintenance_Staff">Maintenance Staff</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-400" /> Create Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Minimum 8 characters with letters and numbers"
                  className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {/* Strength Meter */}
                {registerData.password && (
                  <div className="flex gap-1 pt-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passScore >= step
                            ? passScore <= 2
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Supabase Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================== TAB 3: DEMO QUICK ROLES ===================== */}
          {activeTab === 'demo' && (
            <div className="space-y-2.5 animate-fadeIn">
              <span className="text-[11px] font-semibold text-slate-400 block text-center">
                Select Pre-Configured Role Persona for Evaluation:
              </span>

              {/* Persona 1: Student */}
              <button
                onClick={() => handleRoleLogin('Student', 'student@soa.ac.in')}
                disabled={isLoading}
                className="w-full p-3 rounded-2xl bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 flex items-center justify-between text-xs text-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      Rahul Sharma (Student)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      CSE 4th Sem • Reg: 2023-CSE-042 • Lab & Grievance Access
                    </div>
                  </div>
                </div>
                <span className="text-xs text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                  Login →
                </span>
              </button>

              {/* Persona 2: Faculty / Lab In-Charge */}
              <button
                onClick={() => handleRoleLogin('Faculty', 'faculty@soa.ac.in')}
                disabled={isLoading}
                className="w-full p-3 rounded-2xl bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between text-xs text-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      Prof. A. K. Samanta (Faculty / Lab In-Charge)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      In-Charge: Room C-204 AI Lab • Workstation Approvals
                    </div>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                  Login →
                </span>
              </button>

              {/* Persona 3: Maintenance Staff */}
              <button
                onClick={() => handleRoleLogin('Maintenance_Staff', 'maintenance@soa.ac.in')}
                disabled={isLoading}
                className="w-full p-3 rounded-2xl bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/60 flex items-center justify-between text-xs text-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                      Rajesh Kumar (Estates & HVAC Lead)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Campus Facilities • Priority Work Orders & Proof Notes
                    </div>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                  Login →
                </span>
              </button>

              {/* Persona 4: University Admin */}
              <button
                onClick={() => handleRoleLogin('Admin', 'admin@soa.ac.in')}
                disabled={isLoading}
                className="w-full p-3 rounded-2xl bg-slate-950/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/60 flex items-center justify-between text-xs text-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                      System Administrator / Dean Office
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Audit Logs • Full Institutional Governance & Orchestration
                    </div>
                  </div>
                </div>
                <span className="text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                  Login →
                </span>
              </button>
            </div>
          )}

          {/* Footer Security Badges */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Database className="w-3 h-3" />
              <span>Supabase Auth & Cloud PostgreSQL (ap-southeast-2)</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>Argon2id & JWT HS256</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
