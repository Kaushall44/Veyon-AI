import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  FileText,
  Wrench,
  Globe,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Zap,
  Users,
  Eye,
  FileCheck,
  Layers,
  Sliders,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Shield,
  Bot,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_ROLES_MAP } from '../data/mockUsers';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemoUser, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleLaunchRole = (email: string) => {
    loginAsDemoUser(email);
    navigate('/dashboard');
  };

  const handleQuickLogin = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowRoleModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs transition-all">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 tracking-tight block leading-tight">
              SOA <span className="text-indigo-600">Nexus</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Institutional AI Platform
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#why-soa" className="hover:text-indigo-600 transition-colors">Why SOA Nexus</a>
          <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
          <a href="#architecture" className="hover:text-indigo-600 transition-colors">Agent Architecture</a>
          <a href="#governance" className="hover:text-indigo-600 transition-colors">HITL Governance</a>
          <a href="#docs" className="hover:text-indigo-600 transition-colors">RAG Specs</a>
        </nav>

        {/* Desktop CTA Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            Login
          </button>

          <button
            onClick={handleQuickLogin}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 hover:shadow-slate-900/20 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Try SOA Nexus</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-indigo-400" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-all"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-4 shadow-xl animate-fade-in z-30">
          <div className="space-y-3 text-sm font-semibold text-slate-700 border-b border-slate-100 pb-4">
            <a href="#why-soa" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-indigo-600">Why SOA Nexus</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-indigo-600">Solutions</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-indigo-600">Agent Architecture</a>
            <a href="#governance" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-indigo-600">HITL Governance</a>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setShowRoleModal(true); }}
              className="w-full py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-800 text-center block"
            >
              Login as Demo Role
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); handleQuickLogin(); }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs text-center block shadow-sm"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Hero Section (Databricks Style Design) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Hero Left Column: Copy & Actions */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-bold tracking-wide uppercase text-slate-700">
              INSTITUTIONAL DATA INTELLIGENCE PLATFORM
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>

          {/* Main Giant Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
            AI agents that adapt using your{' '}
            <span className="italic font-serif font-normal bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
              institutional data
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            SOA Nexus empowers universities to create, verify, and deploy Human-in-the-Loop AI agents that automate lab bookings, certificate generation, estate maintenance, and grievance redressal with 100% auditability.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-7 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-xl shadow-slate-950/15 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore the platform</span>
              <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/assistant', { state: { initialPrompt: 'I want to book the AI Lab tomorrow from 2 PM to 4 PM.' } })}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all text-center"
            >
              Watch live demo
            </button>
          </div>
        </div>

        {/* Hero Right Column: Connected Agent Workflow Node Diagram (Databricks Style) */}
        <div className="lg:col-span-6 relative">
          <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card hover:shadow-modal transition-all space-y-6">
            {/* Connected Node 1: Build Agent */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-900">Build Agent & Intent Classifier</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Agent Bricks v2.5
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  KG
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Kaushal Raj Gupta (23CSE042)</span>
                  <span className="text-[10px] text-slate-500">"I want to book the AI Lab tomorrow 2-4 PM"</span>
                </div>
              </div>
            </div>

            {/* Dotted Flow Connector Line */}
            <div className="flex justify-center my-[-8px]">
              <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 via-rose-500 to-emerald-500"></div>
            </div>

            {/* Connected Node 2: Optimize & Policy Check */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900">Optimize & ReAct Action Plan</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Risk: HIGH (Gated)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>CS301 Prerequisite: PASSED</span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Capacity: 25/30 Free</span>
                </div>
              </div>
            </div>

            {/* Dotted Flow Connector Line */}
            <div className="flex justify-center my-[-8px]">
              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500 to-emerald-500"></div>
            </div>

            {/* Connected Node 3: Evaluate & Human Sign-off */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2 shadow-sm flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">HITL Governance Node</span>
                <h4 className="text-xs font-bold text-white">Prof. A. K. Samanta Approval</h4>
                <p className="text-[10px] text-slate-300">Access Pass Code Issued: PASS-LAB-AI-88192</p>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                ✓ Approved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted By Accreditation Logos */}
      <section className="bg-white border-y border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            TRUSTED BY INSTITUTIONAL DEPARTMENTS & ACCREDITING BODIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-700 font-extrabold text-sm sm:text-base tracking-tight opacity-80">
            <span className="hover:text-indigo-600 transition-colors">ITER Engineering</span>
            <span className="hover:text-indigo-600 transition-colors">Siksha 'O' Anusandhan</span>
            <span className="hover:text-indigo-600 transition-colors">NAAC A++ Grade</span>
            <span className="hover:text-indigo-600 transition-colors">UGC Category-1</span>
            <span className="hover:text-indigo-600 transition-colors">AICTE Approved</span>
            <span className="hover:text-indigo-600 transition-colors">NBA Accredited</span>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid Section (Responsive Across PC, Laptop, Tablet, Mobile) */}
      <section id="solutions" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200">
            SOLUTIONS ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Autonomous Institutional Operations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Replace manual paperwork with verified AI agent workflows backed by cryptographic audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-modal transition-all space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Flagship Lab Reservations</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Auto-checks prerequisites (CS301), GPU capacity, and routes to Lab In-Charge for sign-off.
              </p>
            </div>
            <button onClick={() => navigate('/services/lab-booking')} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline pt-2">
              <span>View Lab Service</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-modal transition-all space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Bonafide Certificate PDF</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verifies fee clearance (Rs.0 dues) and renders official watermarked SOA ITER PDF with QR payload.
              </p>
            </div>
            <button onClick={() => navigate('/services/certificate')} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline pt-2">
              <span>View Certificate PDF</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-modal transition-all space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Multilingual Odia NLU</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Processes Odia/Hindi queries to Canonical English and responds in native script.
              </p>
            </div>
            <button onClick={() => navigate('/services/maintenance')} className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline pt-2">
              <span>View Multilingual Engine</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-modal transition-all space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Admin Audit Console</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect 100% full JSON audit provenance trees capturing prompts, RAG scores, and tool payloads.
              </p>
            </div>
            <button onClick={() => navigate('/audit')} className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline pt-2">
              <span>Inspect Audit Trail</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Role Launcher Modal for Quick Judge Evaluation */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-modal relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Select Demo User Role</h3>
              <p className="text-xs text-slate-500">
                Launch the SOA Nexus AI platform instantly under any pre-configured demo persona.
              </p>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {DEMO_ROLES_MAP.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleLaunchRole(demo.email)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/80 hover:border-indigo-300 transition-all text-left flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-900">{demo.label}</span>
                    <p className="text-[11px] text-slate-500">{demo.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              SOA
            </div>
            <span>© 2026 SOA Nexus AI. Institute of Technical Education & Research (ITER).</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#why-soa" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#solutions" className="hover:text-white transition-colors">Governance Rules</a>
            <a href="#docs" className="hover:text-white transition-colors">Audit Console</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
