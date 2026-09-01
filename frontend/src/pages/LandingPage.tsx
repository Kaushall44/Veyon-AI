import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Zap,
  Shield,
  ShieldCheck,
  UserCheck,
  FileText,
  Clock,
  Users,
  ArrowRight,
  Landmark,
  MessageSquare,
  Lock,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Search,
  Database,
  Cpu,
  Activity,
  Layers,
  QrCode,
  TrendingUp,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_ROLES_MAP } from '../data/mockUsers';
import { AgentWorkflowGraph } from '../components/landing/AgentWorkflowGraph';
import { WorkflowTimeline } from '../components/landing/WorkflowTimeline';
import { ProductShowcaseTabs } from '../components/landing/ProductShowcaseTabs';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemoUser, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mouse parallax state for desktop hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B231F] font-sans selection:bg-[#1E3A2B] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 1. Header Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 px-6 sm:px-12 py-4 flex items-center justify-between ${
          isScrolled
            ? 'bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE7DF] shadow-2xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src="/veyon_logo.png"
            alt="Veyon Logo"
            className="w-9 h-9 object-contain rounded-xl"
          />
          <div className="flex items-baseline gap-2">
            <span className="font-serif-title text-3xl font-bold tracking-tight text-[#152E22]">
              Veyon
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#5A6E63] uppercase border-l border-[#D9D5C7] pl-2 py-0.5 hidden sm:inline font-mono">
              AGENTIC PLATFORM
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#4A5D52]">
          <a href="#how-it-works" className="hover:text-[#152E22] transition-colors">
            Workflow Graph
          </a>
          <a href="#dashboard-showcase" className="hover:text-[#152E22] transition-colors">
            Product Views
          </a>
          <a href="#benefits" className="hover:text-[#152E22] transition-colors">
            Capabilities
          </a>
          <a href="#governance" className="hover:text-[#152E22] transition-colors">
            Governance &amp; Trust
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-[#D9D5C7] bg-white text-[#152E22] hover:bg-[#F3F0E6] transition-all cursor-pointer shadow-2xs"
          >
            Sign In
          </button>

          <button
            onClick={handleQuickLogin}
            className="px-6 py-2.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#152E22] hover:bg-[#EAE7DF] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] z-30 bg-[#FAF9F5] border-b border-[#EAE7DF] px-6 py-6 space-y-4 animate-fade-in shadow-lg">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#4A5D52]">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#152E22]"
            >
              Workflow Graph
            </a>
            <a
              href="#dashboard-showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#152E22]"
            >
              Product Views
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#152E22]"
            >
              Capabilities
            </a>
            <a
              href="#governance"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#152E22]"
            >
              Governance &amp; Trust
            </a>
          </nav>
          <div className="pt-4 border-t border-[#EAE7DF] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowRoleModal(true);
              }}
              className="w-full py-3 rounded-full text-xs font-bold border border-[#D9D5C7] bg-white text-[#152E22]"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleQuickLogin();
              }}
              className="w-full py-3 rounded-full bg-[#152E22] text-white font-bold text-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section with Depth & Layered Parallax */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-6 sm:px-12 max-w-7xl mx-auto w-full text-left"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#152E22]/5 border border-[#152E22]/15 text-[#152E22] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#152E22]" />
              <span>Agentic automation for modern teams</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-[#152E22] tracking-tight leading-[1.08]">
              Put complex work in motion.
            </h1>

            {/* Supporting Copy */}
            <p className="text-[#5A6E63] text-sm sm:text-base leading-relaxed max-w-xl">
              Create, run, and supervise AI agents that work across your tools—with the visibility and control your team needs.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleQuickLogin}
                className="px-7 py-3.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-full border border-[#D9D5C7] bg-white text-[#152E22] hover:bg-[#F3F0E6] text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>See how it works</span>
                <ChevronRight className="w-4 h-4 text-[#5A6E63]" />
              </a>
            </div>

            {/* Concise Trust Statement */}
            <div className="pt-4 border-t border-[#EAE7DF] flex flex-wrap items-center gap-6 text-xs text-[#5A6E63] font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Zero-Hallucination RAG Grounding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Deterministic HITL Approvals</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Layered 3D Composition */}
          <div className="lg:col-span-6 relative perspective-1000">
            {/* Background Layer: Workflow Graph Preview (Parallax 4-6px) */}
            <div
              style={{
                transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0px)`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative z-10"
            >
              <AgentWorkflowGraph currentStep={2} interactive={false} />
            </div>

            {/* Mid-ground Layer: Active Task Panel (Parallax 2-3px) */}
            <div
              style={{
                transform: `translate3d(${mousePos.x * 3}px, ${mousePos.y * 3}px, 15px)`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="mt-4 p-4 rounded-2xl bg-white border border-[#EAE7DF] shadow-sm flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#152E22] text-white flex items-center justify-center font-bold">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1B231F]">Active Pipeline: Workstation #14</h4>
                  <p className="text-[10px] text-[#5A6E63]">Policy: lab_regulations_2025.pdf (Sim: 0.94)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                LOCKED &amp; READY
              </span>
            </div>

            {/* Foreground Layer: Floating Verification Pill (Parallax 6-8px) */}
            <div
              style={{
                transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 30px)`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="hidden sm:flex absolute -bottom-5 -right-3 bg-[#152E22] text-white px-4 py-2.5 rounded-full shadow-lg border border-[#1E3A2B] items-center gap-2 text-xs font-bold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E8F5E9]" />
              <span>Immutable Audit Record Sealed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sticky "How Agents Work" Sequence */}
      <WorkflowTimeline />

      {/* 4. Dashboard Showcase Tabs */}
      <ProductShowcaseTabs />

      {/* 5. Benefits Section: Clean 3-Item Layout */}
      <section id="benefits" className="py-16 sm:py-24 bg-[#FAF9F5] text-left">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#152E22]/5 border border-[#152E22]/15 text-[#152E22] text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Core Strengths</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#152E22] leading-tight">
              Designed for institutional execution.
            </h2>
            <p className="text-[#5A6E63] text-sm sm:text-base leading-relaxed">
              Replace fragile point-to-point scripts with deterministic agent coordination built for enterprise scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4 hover:border-[#152E22] transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] text-[#152E22] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif-title font-bold text-[#152E22]">
                Build specialized agents
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6E63] leading-relaxed">
                Deploy domain-specific agent personas with strict role boundaries, from research and policy retrieval to resource scheduling and analysis.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4 hover:border-[#152E22] transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif-title font-bold text-[#152E22]">
                Connect the tools your team uses
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6E63] leading-relaxed">
                Seamlessly orchestrate 768-dim vector embeddings, PostgreSQL row locks, and cryptographic digital access pass generators in a unified graph.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4 hover:border-[#152E22] transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] text-[#152E22] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif-title font-bold text-[#152E22]">
                Review every execution
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6E63] leading-relaxed">
                Mandate human-in-the-loop approvals for sensitive actions and audit every single agent reasoning step through immutable append-only logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust / Governance Section */}
      <section id="governance" className="py-16 sm:py-24 bg-[#FAF8F3] border-t border-[#EAE7DF] text-left">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#152E22]/5 border border-[#152E22]/15 text-[#152E22] text-[11px] font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Security &amp; Governance Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#152E22] leading-tight">
                Autonomy with oversight.
              </h2>
              <p className="text-[#5A6E63] text-xs sm:text-sm leading-relaxed">
                Our platform enforces mathematical safeguards at every tier. Unapproved mutations cannot execute, audit logs cannot be altered, and hallucinations are blocked by confidence score gating.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#1B231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>Human-in-the-Loop approval desk with real-time SSE broadcasts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#1B231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>Database triggers preventing `UPDATE` and `DELETE` on audit trails</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#1B231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>Argon2id password hashing and role-based access control (RBAC)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Quiet Protected Approval Card */}
              <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#152E22]" />
                    <h4 className="text-xs font-bold text-[#1B231F]">Protected Execution Boundary</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                    GATED ACTION
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#EAE7DF] space-y-2 font-mono text-[11px] text-[#5A6E63]">
                  <div className="flex items-center justify-between">
                    <span>STATE_MUTATION:</span>
                    <span className="text-[#152E22] font-bold">WAITING_APPROVAL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SIGNER_REQUIRED:</span>
                    <span className="text-[#2E7D32]">Faculty / Lab In-Charge</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AUDIT_DIFF_STATUS:</span>
                    <span className="text-[#152E22]">RECORDED (SHA-256)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#152E22] text-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping" />
                    <span className="font-bold">Autonomous Execution Frozen</span>
                  </div>
                  <span className="text-[10px] text-[#A3B8AD]">Until faculty confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-16 sm:py-24 bg-[#152E22] text-white text-center">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-white tracking-tight">
            Start moving work forward.
          </h2>
          <p className="text-[#A3B8AD] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Build your first agent workflow in minutes—with institutional-grade governance, deterministic ReAct planning, and cryptographic access passes.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <button
              onClick={handleQuickLogin}
              className="px-8 py-4 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Select Demo Persona</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Reused Footer */}
      <footer className="border-t border-[#EAE7DF] py-10 px-6 sm:px-12 text-xs text-[#5A6E63] bg-[#FAF9F5] text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/veyon_logo.png"
              alt="Veyon Logo"
              className="w-6 h-6 object-contain rounded-md"
            />
            <span className="font-serif-title font-bold text-base text-[#152E22]">Veyon</span>
            <span className="text-[#8C9C92]">• Autonomous Institutional Agent Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hover:text-[#152E22]">Workflow</a>
            <a href="#dashboard-showcase" className="hover:text-[#152E22]">Product</a>
            <a href="#governance" className="hover:text-[#152E22]">Governance</a>
            <button onClick={() => setShowRoleModal(true)} className="hover:text-[#152E22] cursor-pointer">
              Persona Switcher
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} Veyon. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Demo Persona Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] max-w-lg w-full p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-4">
              <div>
                <h3 className="font-serif-title text-2xl font-bold text-[#152E22]">Select Demo Persona</h3>
                <p className="text-xs text-[#5A6E63]">Choose a role to experience Veyon's agentic workflows</p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-2 rounded-full hover:bg-[#FAF8F3] text-[#5A6E63] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {DEMO_ROLES_MAP.map((r) => (
                <button
                  key={r.email}
                  onClick={() => handleLaunchRole(r.email)}
                  className="w-full p-4 rounded-2xl bg-[#FAF8F3] hover:bg-[#F3F0E6] border border-[#E5E2D9] hover:border-[#152E22] transition-all flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E2D9] flex items-center justify-center text-[#152E22] font-bold">
                      {r.role === 'Student' ? (
                        <UserCheck className="w-5 h-5" />
                      ) : r.role === 'Faculty' || r.role === 'Lab_In_Charge' ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">
                        {r.label}
                      </h4>
                      <p className="text-[11px] text-[#5A6E63]">{r.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C9C92] group-hover:text-[#152E22] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-[#152E22] hover:underline cursor-pointer"
              >
                Or log in with username and password →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
