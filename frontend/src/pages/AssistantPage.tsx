import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Bot, User, Sparkles, AlertCircle, FileText, ArrowRight, ShieldCheck, QrCode, ShieldAlert } from 'lucide-react';
import { ActionPlanCard, ActionPlanData } from '../components/chat/ActionPlanCard';
import { DigitalAccessPass } from '../components/services/DigitalAccessPass';
import { UncertaintyCard } from '../components/chat/UncertaintyCard';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: string;
  confidence?: number;
  sources?: { title: string; page: number; score: number }[];
  actionPlan?: ActionPlanData;
  isUncertaintyRefusal?: boolean;
  userQuery?: string;
  isSafetyBlocked?: boolean;
}

export const AssistantPage: React.FC = () => {
  const location = useLocation();
  const initialPrompt = (location.state as { initialPrompt?: string })?.initialPrompt;

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hello Kaushal! I am the SOA Nexus AI Service Assistant. How can I help you today? You can ask about academic policies, book lab slots, or request official certificates.",
      timestamp: '14:00',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showAccessPass, setShowAccessPass] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    setTimeout(() => {
      let assistantMsg: Message;
      const lower = promptText.toLowerCase();

      // Detect Script & Keywords
      const isOdia = /[\u0B00-\u0B7F]/.test(promptText);
      const isHindi = /[\u0900-\u097F]/.test(promptText);

      // Check Prompt Injection Attempt
      if (lower.includes('ignore') || lower.includes('override') || lower.includes('bypass') || lower.includes('dan')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "Safety Guardrail Violation: Adversarial prompt override instructions are strictly prohibited under SOA Nexus AI Safety Policy.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'UNKNOWN',
          confidence: 0.0,
          isSafetyBlocked: true,
        };
      }
      // Check Lab Booking (English, Hindi 'लैब'/'बुक', Odia 'ଲାବ୍'/'ବୁକ୍')
      else if (lower.includes('lab') || lower.includes('book') || lower.includes('लैब') || lower.includes('बुक') || lower.includes('ଲାବ୍')) {
        const text = isHindi
          ? "आपका एआई लैब बुकिंग अनुरोध प्राप्त हो गया है। संकाय अनुमोदन के बाद एक्सेस पास जारी किया जाएगा।"
          : isOdia
          ? "ଆପଣଙ୍କ ଏଆଇ ଲାବ୍ ବୁକିଂ ଅନୁରୋଧ ଗ୍ରହଣ କରାଯାଇଛି। ଶିକ୍ଷକ ଅନୁମୋଦନ ପରେ ଆକ୍ସେସ୍ ପାସ୍ ପ୍ରଦାନ କରାଯିବ।"
          : "I have structured your request to reserve the Advanced AI & GPU Computing Lab (Room C-204) for tomorrow from 14:00 to 16:00. This is a HIGH-risk action requiring Faculty approval.";

        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'LAB_BOOKING',
          confidence: 0.98,
          sources: [
            { title: 'SOA_Lab_Guidelines_2025.txt', page: 4, score: 0.92 },
            { title: 'SOA_Academic_Regulations_2025.txt', page: 12, score: 0.88 },
          ],
          actionPlan: {
            intent: 'LAB_BOOKING',
            risk_level: 'HIGH',
            requires_approval: true,
            assigned_approver_role: 'Lab_In_Charge',
            summary: isHindi
              ? 'एआई लैब बुकिंग के लिए 4-स्तरीय ReAct निष्पादन योजना'
              : isOdia
              ? 'ଏଆଇ ଲାବ୍ ବୁକିଂ ପାଇଁ ୪-ସ୍ତରୀୟ ReAct କାର୍ଯ୍ୟକାରୀ ଯୋଜନା'
              : '4-Step Gated Execution Plan for Lab Slot Reservation',
            steps: [
              { step_number: 1, title: 'Check Student Course Prerequisites', description: 'Passed CS301 Machine Learning with Grade B+.', status: 'PASSED', assigned_actor: 'Auto-Check' },
              { step_number: 2, title: 'Verify Lab Slot Availability', description: 'Checked capacity (25/30 workstations free).', status: 'CHECKED', assigned_actor: 'Resource Manager' },
              { step_number: 3, title: 'Faculty Approval from Lab In-Charge', description: 'Routed to Prof. A. K. Samanta for sign-off.', status: 'PENDING_APPROVAL', assigned_actor: 'Prof. A. K. Samanta' },
              { step_number: 4, title: 'Issue Digital Access Permit', description: 'Generate single-use QR access code upon sign-off.', status: 'PENDING', assigned_actor: 'Security Gate' },
            ],
          },
        };
      }
      // Check Maintenance (English, Hindi 'पंखा'/'रखरखाव', Odia 'ଫ୍ୟାନ୍'/'ରକ୍ଷଣାବେକ୍ଷଣ')
      else if (lower.includes('maintenance') || lower.includes('fan') || lower.includes('ac') || lower.includes('पंखा') || lower.includes('ଫ୍ୟାନ୍')) {
        const text = isHindi
          ? "आपकी रखरखाव शिकायत (#MT-8842) दर्ज कर ली गई है। एस्टेट टीम जल्द जांच करेगी।"
          : isOdia
          ? "ଆପଣଙ୍କ ରକ୍ଷଣାବେକ୍ଷଣ ଅଭିଯୋଗ (#MT-8842) ରଜିଷ୍ଟର ହୋଇଛି। ଏଷ୍ଟେଟ୍ସ ଟିମ୍ ତୁରନ୍ତ ଯାଞ୍ଚ କରିବେ।"
          : "Your campus maintenance request (#MT-8842) has been registered. Estates team assigned.";

        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'MAINTENANCE',
          confidence: 0.95,
          sources: [{ title: 'SOA_Hostel_Rules_2025.txt', page: 8, score: 0.91 }],
        };
      }
      // Check Ungrounded Inquiry
      else if (lower.includes('refund') || lower.includes('dropout') || lower.includes('sports quota marks')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: isHindi
            ? "आधिकारिक 2025/2026 एसओए विश्वविद्यालय नीति दस्तावेजों में सत्यापित करने में असमर्थ।"
            : isOdia
            ? "ଅଫିସିଆଲ୍ ୨୦୨୫/୨୦୨୬ ଏସଓଏ ନୀତି ଦଲିଲରେ ଯାଞ୍ଚ କରିବାକୁ ଅସମର୍ଥ।"
            : "Unable to verify in official 2025/2026 SOA University policy PDFs.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'UNKNOWN',
          confidence: 0.54,
          isUncertaintyRefusal: true,
          userQuery: promptText,
        };
      }
      // General FAQ
      else {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: isHindi
            ? "एसओए शैक्षणिक विनियम 2025 (धारा 4.2) के अनुसार, 85% से अधिक उपस्थिति वाले छात्र फास्ट-ट्रैक लैब परमिट के लिए पात्र हैं।"
            : isOdia
            ? "ଏସଓଏ ଏକାଡେମିକ୍ ନିୟମାବଳୀ ୨୦୨୫ ଅନୁଯାୟୀ ୮୫% ରୁ ଅଧିକ ଉପସ୍ଥିତି ଥିବା ଛାତ୍ରଛାତ୍ରୀ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ଲାବ୍ ପରମିଟ୍ ପାଇଁ ଯୋଗ୍ୟ।"
            : "Based on SOA Academic Regulations 2025 (Section 4.2), students maintaining above 85% attendance are eligible for fast-track lab permits.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'FAQ',
          confidence: 0.94,
          sources: [{ title: 'SOA_Academic_Regulations_2025.txt', page: 14, score: 0.94 }],
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-card flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" /> Grounded RAG Copilot
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">SOA AI Service Assistant</h1>
          <p className="text-slate-300 text-xs">Policy Q&A, lab slot reservations, and automated ReAct action planning.</p>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6 min-h-[450px] flex flex-col justify-between">
        <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className={`space-y-3 max-w-2xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-subtle ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : msg.isSafetyBlocked
                      ? 'bg-red-50 border border-red-200 text-red-900 font-medium rounded-tl-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Grounded Citation Badges */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-indigo-500" />
                        <span>Source: {src.title} (p. {src.page})</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Safety Blocked Violation Card */}
                {msg.isSafetyBlocked && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 font-bold text-red-700">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Security Incident Logged (#SEC-SAFE-BLOCK)</span>
                    </div>
                    <p className="text-[11px] text-red-800">
                      Adversarial prompt injection attempt was neutralized and logged to the <strong>Immutable Audit Console</strong>. System governance gates remain strictly intact.
                    </p>
                  </div>
                )}

                {/* Uncertainty Refusal Card */}
                {msg.isUncertaintyRefusal && !msg.isSafetyBlocked && (
                  <UncertaintyCard
                    query={msg.userQuery || 'Ungrounded policy inquiry'}
                    similarityScore={msg.confidence || 0.54}
                  />
                )}

                {/* Interactive Action Plan Card */}
                {msg.actionPlan && (
                  <div className="space-y-3 pt-2">
                    <ActionPlanCard
                      plan={msg.actionPlan}
                      onSubmitForApproval={() => setShowAccessPass(true)}
                    />

                    {showAccessPass && (
                      <DigitalAccessPass
                        accessPassCode="PASS-LAB-AI-88192"
                        studentName="Kaushal Raj Gupta"
                        studentRegNo="2023-CSE-042"
                        labName="Advanced AI & GPU Computing Lab"
                        roomNo="Room C-204"
                        dateSlot="Tomorrow, 14:00 - 16:00"
                        purpose="B.Tech Capstone Project Work"
                        approverName="Prof. A. K. Samanta"
                      />
                    )}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 font-mono block">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold animate-pulse">
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Analyzing intent & retrieving policy passages...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputPrompt);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask a question or request a service (e.g. 'Book AI Lab tomorrow from 2-4 PM')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
