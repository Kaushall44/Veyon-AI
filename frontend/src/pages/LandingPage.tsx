import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Shield,
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { DEMO_ROLES_MAP } from "../data/mockUsers";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemoUser, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [heroPrompt, setHeroPrompt] = useState("");

  const handleLaunchRole = (email: string) => {
    loginAsDemoUser(email);
    navigate("/dashboard");
  };

  const handleQuickLogin = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowRoleModal(true);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      navigate("/assistant", {
        state: { initialPrompt: heroPrompt || "I need my transcript" },
      });
    } else {
      setShowRoleModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B231F] font-sans selection:bg-[#1E3A2B] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 1. Header Navigation Bar (Pixel Perfect to Image 1) */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE7DF] px-6 sm:px-12 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-baseline gap-2">
            <span className="font-serif-title text-3xl font-bold tracking-tight text-[#152E22]">
              S1
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#5A6E63] uppercase border-l border-[#D9D5C7] pl-2 py-0.5">
              SERVICE DIRECTORY
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#4A5D52]">
          <a
            href="#home"
            className="text-[#152E22] font-bold border-b-2 border-[#152E22] pb-0.5"
          >
            Home
          </a>
          <a
            href="#services"
            className="hover:text-[#152E22] transition-colors"
          >
            Services
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#152E22] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#for-students"
            className="hover:text-[#152E22] transition-colors"
          >
            For Students
          </a>
          <a href="#about" className="hover:text-[#152E22] transition-colors">
            About S1
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-[#D9D5C7] bg-white text-[#152E22] hover:bg-[#F3F0E6] transition-all cursor-pointer"
          >
            Sign In
          </button>

          <button
            onClick={handleQuickLogin}
            className="px-6 py-2.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Get Started</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#152E22] hover:bg-[#F0EDE3] transition-all"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EAE7DF] p-6 space-y-4 shadow-xl z-30 animate-fade-in">
          <div className="space-y-3 text-sm font-semibold text-[#152E22] border-b border-[#EAE7DF] pb-4">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1"
            >
              Home
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1"
            >
              How It Works
            </a>
            <a
              href="#for-students"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1"
            >
              For Students
            </a>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowRoleModal(true);
              }}
              className="w-full py-2.5 rounded-full bg-[#F3F0E6] font-bold text-xs text-[#152E22] text-center block"
            >
              Sign In to Demo Role
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleQuickLogin();
              }}
              className="w-full py-2.5 rounded-full bg-[#152E22] text-white font-bold text-xs text-center block"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Hero Section (Pixel Perfect to Image 1) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Copy */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE3] border border-[#E2DFD5] text-[10px] font-bold uppercase tracking-widest text-[#4A5D52]">
            <Sparkles className="w-3.5 h-3.5 text-[#152E22]" />
            <span>AGENTIC AI FOR INSTITUTIONAL SERVICE DELIVERY</span>
          </div>

          {/* Hero Main Headline (Exact Editorial Serif Typography) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-title text-[#1B231F] leading-[1.05] tracking-tight">
            Your request.
            <br />
            <span className="text-[#152E22] italic font-normal">
              Our responsibility.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-[#4A5D52] text-base sm:text-lg leading-relaxed max-w-xl font-medium">
            S1 understands your request, finds the right desk, and gets it
            done—faster.
          </p>

          {/* Prompt Search Box (Exact Match to Image 1) */}
          <form onSubmit={handlePromptSubmit} className="space-y-3 max-w-xl">
            <div className="bg-white border border-[#D9D5C7] rounded-full p-2 pl-5 flex items-center justify-between shadow-xs hover:border-[#152E22] focus-within:border-[#152E22] transition-all">
              <div className="flex items-center gap-3 flex-1">
                <Sparkles className="w-4 h-4 text-[#8C9C92]" />
                <input
                  type="text"
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  placeholder='Describe your request – e.g. "I need my transcript"'
                  className="w-full bg-transparent text-xs font-medium text-[#1B231F] placeholder-[#8C9C92] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Tag Pills */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#4A5D52]">
              <button
                type="button"
                onClick={() => setHeroPrompt("Check my application status")}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2D9] hover:border-[#152E22] flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3 h-3 text-[#152E22]" /> Check
                application status
              </button>
              <button
                type="button"
                onClick={() => setHeroPrompt("File a confidential grievance")}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2D9] hover:border-[#152E22] flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3 h-3 text-[#152E22]" /> File a grievance
              </button>
              <button
                type="button"
                onClick={() => setHeroPrompt("I need a Bonafide Certificate")}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2D9] hover:border-[#152E22] flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3 h-3 text-[#152E22]" /> Request a
                document
              </button>
            </div>
          </form>
        </div>

        {/* Right Graphic Orbit Illustration (Exact Match to Image 1) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center">
            {/* Dashed Orbit Ring */}
            <div className="absolute inset-0 border border-dashed border-[#D9D5C7] rounded-full animate-spin-slow"></div>

            {/* Central University Building Graphic */}
            <div className="relative z-10 w-44 h-44 rounded-3xl bg-gradient-to-b from-[#FAF8F3] to-[#EFECE3] border border-[#E0DDD2] shadow-card flex flex-col items-center justify-center p-6 text-center">
              <Landmark className="w-16 h-16 text-[#152E22] stroke-[1.25]" />
              <span className="text-[10px] font-bold tracking-widest text-[#5A6E63] uppercase mt-2">
                SOA ITER DESK
              </span>
            </div>

            {/* Orbiting Icon Nodes */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-[#E2DFD5] shadow-xs flex items-center justify-center text-[#152E22]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E2DFD5] shadow-xs flex items-center justify-center text-[#152E22]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-[#E2DFD5] shadow-xs flex items-center justify-center text-[#152E22]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E2DFD5] shadow-xs flex items-center justify-center text-[#152E22]">
              <Shield className="w-5 h-5" />
            </div>

            {/* Bottom Floating Status Pill */}
            <div className="absolute -bottom-6 bg-white border border-[#E5E2D9] rounded-2xl px-4 py-2.5 shadow-md flex items-center gap-2.5 text-xs font-semibold z-20">
              <div className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#8C9C92] font-semibold block">
                  Routed to
                </span>
                <span className="text-[#152E22] font-bold block">
                  Records Office
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Pillar Feature Cards (Exact Match to Image 1) */}
      <section id="services" className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
        <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-sm text-[#1B231F]">
                  Smart & Accurate
                </h3>
                <p className="text-xs text-[#5A6E63] leading-relaxed">
                  AI understands your request and identifies the right service.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-sm text-[#1B231F]">
                  Fast & Efficient
                </h3>
                <p className="text-xs text-[#5A6E63] leading-relaxed">
                  Automated routing reduces waiting and speeds up resolution.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EAF6] text-[#283593] flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-sm text-[#1B231F]">
                  Transparent & Secure
                </h3>
                <p className="text-xs text-[#5A6E63] leading-relaxed">
                  Track every step with full visibility and data privacy.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E5F5] text-[#6A1B9A] flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-sm text-[#1B231F]">
                  Human-in-the-Loop
                </h3>
                <p className="text-xs text-[#5A6E63] leading-relaxed">
                  Experts review and ensure quality resolution.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Metrics Stat Strip (Exact Match to Image 1) */}
          <div className="bg-[#FAF8F3] rounded-2xl border border-[#EAE7DF] p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-serif-title font-bold text-[#1B231F] block">
                  2.4K+
                </span>
                <span className="text-xs text-[#5A6E63] font-medium block">
                  Requests Processed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-serif-title font-bold text-[#1B231F] block">
                  98.6%
                </span>
                <span className="text-xs text-[#5A6E63] font-medium block">
                  Resolution Rate
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8EAF6] text-[#283593] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-serif-title font-bold text-[#1B231F] block">
                  15+
                </span>
                <span className="text-xs text-[#5A6E63] font-medium block">
                  Service Desks
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] text-[#6A1B9A] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-serif-title font-bold text-[#1B231F] block">
                  24/7
                </span>
                <span className="text-xs text-[#5A6E63] font-medium block">
                  AI Assistant Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section Title */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-6 sm:px-12 py-12 text-center space-y-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E63]">
          HOW IT WORKS
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif-title text-[#1B231F]">
          Simple steps. Seamless resolution.
        </h2>
      </section>

      {/* Demo Role Selector Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 p-2 text-[#8C9C92] hover:text-[#1B231F] rounded-full hover:bg-[#F3F0E6] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center">
              <h3 className="text-xl font-serif-title font-bold text-[#1B231F]">
                Select Evaluation Persona
              </h3>
              <p className="text-xs text-[#5A6E63]">
                Experience S1 Service Directory under any pre-configured demo
                account.
              </p>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {DEMO_ROLES_MAP.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleLaunchRole(demo.email)}
                  className="w-full p-3.5 rounded-2xl border border-[#E5E2D9] bg-[#FAF8F3] hover:bg-[#E8F5E9]/50 hover:border-[#152E22] transition-all text-left flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-[#1B231F] group-hover:text-[#152E22]">
                      {demo.label}
                    </span>
                    <p className="text-[11px] text-[#5A6E63]">
                      {demo.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C9C92] group-hover:text-[#152E22] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#152E22] text-white py-10 px-6 sm:px-12 border-t border-[#1E3A2B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#8C9C92]">
          <div className="flex items-center gap-3">
            <span className="font-serif-title text-xl font-bold text-white">
              S1
            </span>
            <span>
              © 2026 SOA Nexus AI. Institute of Technical Education & Research
              (ITER).
            </span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#services" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              Governance Rules
            </a>
            <a
              href="#for-students"
              className="hover:text-white transition-colors"
            >
              Student Helpdesk
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;