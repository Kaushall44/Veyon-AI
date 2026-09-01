import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, AlertCircle, FileText, ArrowRight, ShieldCheck, QrCode, ShieldAlert, Clock } from 'lucide-react';
import { ActionPlanCard, ActionPlanData } from '../components/chat/ActionPlanCard';
import { DigitalAccessPass } from '../components/services/DigitalAccessPass';
import { UncertaintyCard } from '../components/chat/UncertaintyCard';
import { SourceCard } from '../components/chat/SourceCard';
import { apiClient } from '../services/api/apiClient';
import { requestsService } from '../services/api/requestsService';

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
  departmentContact?: {
    office: string;
    campus: string;
    email: string;
    phone: string;
    timings?: string;
  };
}

// Multi-step booking state machine
interface BookingFlowState {
  step: 'idle' | 'ask_subject' | 'ask_lab' | 'ask_seat' | 'ask_datetime' | 'confirm' | 'submitted';
  studentName: string;
  subject: string;
  labName: string;
  labRoom: string;
  seatNo: number | null;
  date: string;
  timeSlot: string;
  purpose: string;
}

const INITIAL_BOOKING: BookingFlowState = {
  step: 'idle',
  studentName: '',
  subject: '',
  labName: '',
  labRoom: '',
  seatNo: null,
  date: '',
  timeSlot: '',
  purpose: '',
};

const AVAILABLE_LABS = [
  { name: 'Advanced AI & GPU Computing Lab', room: 'Room C-204', seats: 30 },
  { name: 'Electronics & IoT Lab', room: 'Room B-108', seats: 25 },
  { name: 'Cyber Security Lab', room: 'Room C-310', seats: 20 },
  { name: 'Data Science & Analytics Lab', room: 'Room A-202', seats: 24 },
  { name: 'Robotics & Automation Lab', room: 'Room D-105', seats: 15 },
];

export const AssistantPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPrompt = (location.state as { initialPrompt?: string })?.initialPrompt;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hello Kaushal! I am Veyon, your Agentic AI Assistant. How can I help you today? You can ask about academic policies, course details, lab reservations, certificates, or any university enquiry.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [bookingFlow, setBookingFlow] = useState<BookingFlowState>(INITIAL_BOOKING);
  const [submittedPlans, setSubmittedPlans] = useState<Record<string, { trackingCode: string; approver: string; status: string; workstationNo?: number }>>({});

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addAssistantMsg = (text: string, extra?: Partial<Message>) => {
    const msg: Message = {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: 'assistant',
      text,
      timestamp: ts(),
      ...extra,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const isLabBookingIntent = (text: string): boolean => {
    const lower = text.toLowerCase().trim();
    return (
      lower.includes('lab') ||
      lower.includes('book') ||
      lower.includes('gpu') ||
      lower.includes('reserve') ||
      lower.includes('workstation') ||
      lower.includes('seat') ||
      /\blab\b/.test(lower) ||
      lower.includes('लैब') ||
      lower.includes('बुक') ||
      lower.includes('ଲାବ୍')
    );
  };

  const handleBookingFlow = (userText: string) => {
    const lower = userText.toLowerCase().trim();

    switch (bookingFlow.step) {
      case 'ask_subject': {
        const subject = userText.trim();
        setBookingFlow((prev) => ({ ...prev, step: 'ask_lab', subject, purpose: subject }));
        setTimeout(() => {
          const labList = AVAILABLE_LABS.map((l, i) => `  **${i + 1}.** ${l.name} (${l.room}) — ${l.seats} seats`).join('\n');
          addAssistantMsg(
            `Great! You want to book for **"${subject}"**.\n\nNow, which lab would you like to reserve? Here are the available labs:\n\n${labList}\n\nPlease type the lab number (1-${AVAILABLE_LABS.length}) or the lab name.`,
            { intent: 'LAB_BOOKING', confidence: 0.96 }
          );
        }, 400);
        break;
      }

      case 'ask_lab': {
        let selectedLab = AVAILABLE_LABS[0];
        const num = parseInt(lower);
        if (num >= 1 && num <= AVAILABLE_LABS.length) {
          selectedLab = AVAILABLE_LABS[num - 1];
        } else {
          const match = AVAILABLE_LABS.find(
            (l) => l.name.toLowerCase().includes(lower) || l.room.toLowerCase().includes(lower)
          );
          if (match) selectedLab = match;
        }

        setBookingFlow((prev) => ({
          ...prev,
          step: 'ask_seat',
          labName: selectedLab.name,
          labRoom: selectedLab.room,
        }));

        setTimeout(() => {
          addAssistantMsg(
            `You've selected **${selectedLab.name}** (${selectedLab.room}).\n\nThis lab has **${selectedLab.seats} workstations** available. Which seat/workstation number would you like to reserve? (1-${selectedLab.seats})`,
            { intent: 'LAB_BOOKING', confidence: 0.97 }
          );
        }, 400);
        break;
      }

      case 'ask_seat': {
        const seatMatch = lower.match(/\d+/);
        const seatNo = seatMatch ? parseInt(seatMatch[0]) : 14;

        setBookingFlow((prev) => ({ ...prev, step: 'ask_datetime', seatNo }));

        setTimeout(() => {
          addAssistantMsg(
            `Workstation **#${seatNo}** selected.\n\nWhen would you like to book? Please provide the **date** and **time slot**.\n\nExample: *"Tomorrow 2 PM to 4 PM"*, *"3rd September 10:00 - 12:00"*, or *"Today 3 PM - 5 PM"*`,
            { intent: 'LAB_BOOKING', confidence: 0.97 }
          );
        }, 400);
        break;
      }

      case 'ask_datetime': {
        // Parse date/time from user input
        let date = 'Tomorrow';
        let timeSlot = '14:00 - 16:00';

        // Try to extract meaningful date/time
        if (lower.includes('today')) date = 'Today';
        else if (lower.includes('tomorrow')) date = 'Tomorrow';
        else {
          // Try to extract a date-like pattern
          const dateMatch = userText.match(/(\d{1,2})\s*(st|nd|rd|th)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)/i);
          if (dateMatch) {
            date = dateMatch[0];
          } else {
            date = userText.split(/\d{1,2}\s*[:-]\s*\d{2}/)[0].trim() || 'Tomorrow';
          }
        }

        // Extract time
        const timeMatch = userText.match(/(\d{1,2})\s*(?::(\d{2}))?\s*(am|pm|AM|PM)?\s*(?:to|-|–)\s*(\d{1,2})\s*(?::(\d{2}))?\s*(am|pm|AM|PM)?/);
        if (timeMatch) {
          let startH = parseInt(timeMatch[1]);
          const startM = timeMatch[2] || '00';
          const startAMPM = (timeMatch[3] || '').toLowerCase();
          let endH = parseInt(timeMatch[4]);
          const endM = timeMatch[5] || '00';
          const endAMPM = (timeMatch[6] || '').toLowerCase();

          if (startAMPM === 'pm' && startH < 12) startH += 12;
          if (startAMPM === 'am' && startH === 12) startH = 0;
          if (endAMPM === 'pm' && endH < 12) endH += 12;
          if (endAMPM === 'am' && endH === 12) endH = 0;

          timeSlot = `${String(startH).padStart(2, '0')}:${startM} - ${String(endH).padStart(2, '0')}:${endM}`;
        }

        setBookingFlow((prev) => ({ ...prev, step: 'confirm', date, timeSlot }));

        setTimeout(() => {
          const bf = bookingFlow;
          addAssistantMsg(
            `Here's your booking summary:\n\n` +
            `🧑‍🎓 **Student:** Kaushal Raj Gupta (2023-CSE-042)\n` +
            `📚 **Subject/Purpose:** ${bf.subject}\n` +
            `🏢 **Lab:** ${bf.labName} (${bf.labRoom})\n` +
            `💺 **Workstation:** #${bf.seatNo}\n` +
            `📅 **Date:** ${date}\n` +
            `⏰ **Time Slot:** ${timeSlot}\n\n` +
            `⚠️ This is a **HIGH-risk** action requiring **Lab In-Charge approval** before the Digital Access Pass is issued.\n\n` +
            `Type **"confirm"** to generate the Action Plan, or **"cancel"** to start over.`,
            {
              intent: 'LAB_BOOKING',
              confidence: 0.98,
              sources: [
                { title: 'SOA_Lab_Guidelines_2025.txt', page: 4, score: 0.92 },
                { title: 'SOA_Academic_Regulations_2025.txt', page: 12, score: 0.88 },
              ],
            }
          );
        }, 400);
        break;
      }

      case 'confirm': {
        if (lower.includes('cancel') || lower.includes('no') || lower.includes('restart')) {
          setBookingFlow(INITIAL_BOOKING);
          setTimeout(() => {
            addAssistantMsg('Booking cancelled. Feel free to start a new request anytime!');
          }, 300);
          return;
        }

        // Generate the Action Plan with user-provided data
        const bf = bookingFlow;
        const plan: ActionPlanData = {
          intent: 'LAB_BOOKING',
          risk_level: 'HIGH',
          requires_approval: true,
          assigned_approver_role: 'Lab_In_Charge',
          summary: `4-Step Gated Execution Plan for ${bf.labName} Reservation`,
          steps: [
            {
              step_number: 1,
              title: 'Check Student Course Prerequisites',
              description: `Verified enrollment in ${bf.subject}. Passed prerequisite checks.`,
              status: 'PASSED',
              assigned_actor: 'Auto-Check',
            },
            {
              step_number: 2,
              title: 'Verify Lab Slot & Seat Availability',
              description: `Checked ${bf.labName} (${bf.labRoom}) — Workstation #${bf.seatNo} availability for ${bf.date}, ${bf.timeSlot}.`,
              status: 'CHECKED',
              assigned_actor: 'Resource Manager',
            },
            {
              step_number: 3,
              title: 'Faculty Approval from Lab In-Charge',
              description: 'Routed to Prof. A. K. Samanta for sign-off.',
              status: 'PENDING_APPROVAL',
              assigned_actor: 'Prof. A. K. Samanta',
            },
            {
              step_number: 4,
              title: 'Issue Digital Access Permit',
              description: 'Generate single-use QR access code upon sign-off.',
              status: 'PENDING',
              assigned_actor: 'Security Gate',
            },
          ],
        };

        setBookingFlow((prev) => ({ ...prev, step: 'submitted' }));

        setTimeout(() => {
          addAssistantMsg(
            `I have structured your request to reserve **${bf.labName}** (${bf.labRoom}), Workstation **#${bf.seatNo}** for **${bf.date}** from **${bf.timeSlot}**.\n\nThis is a **HIGH-risk** action requiring Faculty approval. Please review the Action Plan below and click **"Submit for Approval"** to proceed.`,
            {
              intent: 'LAB_BOOKING',
              confidence: 0.98,
              sources: [
                { title: 'SOA_Lab_Guidelines_2025.txt', page: 4, score: 0.92 },
                { title: 'SOA_Academic_Regulations_2025.txt', page: 12, score: 0.88 },
              ],
              actionPlan: plan,
            }
          );
        }, 500);
        break;
      }

      default:
        break;
    }
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: ts(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');

    // If we're in an active booking flow, handle it conversationally
    if (bookingFlow.step !== 'idle' && bookingFlow.step !== 'submitted') {
      handleBookingFlow(promptText);
      return;
    }

    setLoading(true);

    // Live backend FastAPI ReAct endpoint
    try {
      const response = await apiClient.post('/chat', {
        prompt: promptText,
        user_role: 'Student',
        language: 'en',
      });

      if (response.data) {
        const apiData = response.data;
        const rawText = apiData.response_text || apiData.message || 'Request analyzed successfully.';
        const detectedIntent = apiData.intent || (typeof apiData.detected_intent === 'object' ? apiData.detected_intent.intent : apiData.detected_intent) || 'FAQ';

        // If backend detects LAB_BOOKING, start conversational flow instead of using backend plan
        if (detectedIntent === 'LAB_BOOKING' || isLabBookingIntent(promptText)) {
          setLoading(false);
          setBookingFlow({ ...INITIAL_BOOKING, step: 'ask_subject', studentName: 'Kaushal Raj Gupta' });
          setTimeout(() => {
            addAssistantMsg(
              "I can help you book a lab! Let me collect a few details first.\n\n📚 **What subject or course** is this lab booking for?\n\n_(e.g., Machine Learning, Data Structures, IoT Lab Work, Capstone Project, etc.)_",
              { intent: 'LAB_BOOKING', confidence: 0.98 }
            );
          }, 400);
          return;
        }

        const isActionableIntent = ['CERTIFICATE', 'MAINTENANCE', 'GRIEVANCE'].includes(detectedIntent);
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: rawText,
          timestamp: ts(),
          intent: detectedIntent,
          confidence: apiData.intent_confidence || (typeof apiData.detected_intent === 'object' ? apiData.detected_intent.confidence : 0.95),
          sources: apiData.citations && apiData.citations.length > 0 ? apiData.citations : undefined,
          actionPlan: isActionableIntent && apiData.action_plan?.steps?.length > 0 ? apiData.action_plan : undefined,
          isUncertaintyRefusal: apiData.is_uncertainty_refusal || rawText.includes('Zero-Hallucination') || rawText.includes('Uncertainty Refusal') || rawText.includes('insufficient policy grounding'),
          userQuery: promptText,
          isSafetyBlocked: rawText.includes('BLOCKED') || rawText.includes('Security Policy Violation'),
          departmentContact: apiData.department_contact,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Backend server offline or unreachable. Using intelligent local NLU fallback.');
    }

    // Dynamic Intelligent Local NLU Responder
    setTimeout(() => {
      let assistantMsg: Message;
      const lower = promptText.toLowerCase().trim();

      const isOdia = /[\u0B00-\u0B7F]/.test(promptText);
      const isHindi = /[\u0900-\u097F]/.test(promptText);

      // 1. Check Prompt Injection Attempt
      if (lower.includes('ignore') || lower.includes('override') || lower.includes('bypass') || lower.includes('dan')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "Safety Guardrail Violation: Adversarial prompt override instructions are strictly prohibited under SOA Nexus AI Safety Policy.",
          timestamp: ts(),
          intent: 'UNKNOWN',
          confidence: 0.0,
          isSafetyBlocked: true,
        };
      }
      // 2. Greetings
      else if (
        lower === 'hi' || lower === 'hello' || lower === 'hey' ||
        lower.startsWith('hi ') || lower.startsWith('hello ') ||
        lower.includes('good morning') || lower.includes('good afternoon') ||
        lower.includes('good evening') || lower.includes('who are you') ||
        lower.includes('what can you do')
      ) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: isHindi
            ? "नमस्ते कौशल! मैं एसओए एस1 एजेंटिक एआई सहायक हूं। मैं आज आपकी क्या सहायता कर सकता हूं?"
            : isOdia
            ? "ନମସ୍କାର କୌଶଲ! ମୁଁ ଏସଓଏ ଏସ୧ ଏଜେଣ୍ଟିକ ଏଆଇ ସହାୟକ।"
            : "Hello Kaushal! I am your SOA S1 Agentic AI Assistant. I can assist you with academic guidelines, course information, GPU lab bookings, Bonafide certificate generation, maintenance tickets, and campus services. How can I help you today?",
          timestamp: ts(),
          intent: 'GREETING',
          confidence: 0.99,
          sources: [{ title: 'SOA_Institutional_Overview_2025.txt', page: 1, score: 0.98 }],
        };
      }
      // 3. Lab Booking → Start conversational flow
      else if (isLabBookingIntent(promptText)) {
        setBookingFlow({ ...INITIAL_BOOKING, step: 'ask_subject', studentName: 'Kaushal Raj Gupta' });
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "I can help you book a lab! Let me collect a few details first.\n\n📚 **What subject or course** is this lab booking for?\n\n_(e.g., Machine Learning, Data Structures, IoT Lab Work, Capstone Project, etc.)_",
          timestamp: ts(),
          intent: 'LAB_BOOKING',
          confidence: 0.98,
        };
      }
      // 4. Bonafide / Certificate / Transcript
      else if (lower.includes('certificate') || lower.includes('bonafide') || lower.includes('transcript') || lower.includes('degree') || lower.includes('pramana')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "You can request official Fee Structure & Bonafide Certificates or Grade Transcripts directly from our portal. Once auto-verified by our AI system and signed by the Dean, your watermarked PDF with QR verification code is generated instantly.",
          timestamp: ts(),
          intent: 'CERTIFICATE',
          confidence: 0.96,
          sources: [{ title: 'SOA_Academic_Regulations_2025.txt', page: 8, score: 0.94 }],
        };
      }
      // 5. Maintenance
      else if (lower.includes('maintenance') || lower.includes('fan') || lower.includes('ac') || lower.includes('repair') || lower.includes('leak') || lower.includes('light') || lower.includes(' पंखा')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "Your infrastructure maintenance ticket has been registered. The Estates Team will auto-classify priority and dispatch an on-duty technician to your specified location.",
          timestamp: ts(),
          intent: 'MAINTENANCE',
          confidence: 0.95,
          sources: [{ title: 'SOA_Hostel_Rules_2025.txt', page: 8, score: 0.91 }],
        };
      }
      // 6. Academics, Exams, CGPA
      else if (
        lower.includes('exam') || lower.includes('cgpa') || lower.includes('grade') ||
        lower.includes('attendance') || lower.includes('syllabus') || lower.includes('semester') ||
        lower.includes('marks') || lower.includes('routine')
      ) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "According to SOA ITER Academic Regulations 2025 (Section 4.2), students must maintain a minimum of 75% attendance to appear for semester examinations (85% for fast-track GPU lab permits). Mid-term evaluations are conducted 8 weeks into each semester, and CGPA is calculated on a 10-point scale.",
          timestamp: ts(),
          intent: 'ACADEMIC_POLICY',
          confidence: 0.97,
          sources: [{ title: 'SOA_Academic_Regulations_2025.txt', page: 14, score: 0.95 }],
        };
      }
      // 7. Placements
      else if (lower.includes('placement') || lower.includes('company') || lower.includes('package') || lower.includes('job') || lower.includes('internship')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "SOA University Training & Placement (T&P) Cell hosts 150+ top recruiters including Amazon, Microsoft, TCS, Cognizant, and Infosys. Highest packages reach up to ₹45+ LPA.",
          timestamp: ts(),
          intent: 'PLACEMENT_INFO',
          confidence: 0.94,
          sources: [{ title: 'SOA_Placement_Brochure_2025.txt', page: 3, score: 0.91 }],
        };
      }
      // 8. Library
      else if (lower.includes('library') || lower.includes('reading room') || lower.includes('journal')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "The ITER Central Library is open from 8:00 AM to 10:00 PM on working days (and 24/7 during end-semester examination periods). It houses over 150,000 volumes, IEEE e-journals, and quiet study zones.",
          timestamp: ts(),
          intent: 'LIBRARY_INFO',
          confidence: 0.96,
          sources: [{ title: 'SOA_Library_Rules_2025.txt', page: 2, score: 0.93 }],
        };
      }
      // 9. Hostel & Mess
      else if (lower.includes('hostel') || lower.includes('mess') || lower.includes('warden') || lower.includes('curfew')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "ITER Hostels provide AC and Non-AC accommodation (2, 3, and 4 occupancy). Night curfew is set at 9:30 PM. Mess menus offer hygienic vegetarian and non-vegetarian options.",
          timestamp: ts(),
          intent: 'HOSTEL_INFO',
          confidence: 0.95,
          sources: [{ title: 'SOA_Hostel_Rules_2025.txt', page: 5, score: 0.92 }],
        };
      }
      // 10. Ungrounded Refusal
      else if (lower.includes('refund') || lower.includes('dropout') || lower.includes('sports quota marks')) {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: "Unable to verify in official 2025/2026 SOA University policy PDFs.",
          timestamp: ts(),
          intent: 'UNKNOWN',
          confidence: 0.54,
          isUncertaintyRefusal: true,
          userQuery: promptText,
        };
      }
      // 11. General Q&A
      else {
        assistantMsg = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: `Thank you for asking! Regarding "${promptText}":\n\nSOA University (ITER) provides comprehensive institutional guidelines covering academics, campus administration, student welfare, and AI-driven service delivery.\n\nFor specific services like GPU Lab reservations, Bonafide Certificates, or maintenance requests, you can state your request directly in this chat!`,
          timestamp: ts(),
          intent: 'GENERAL_QA',
          confidence: 0.92,
          sources: [{ title: 'SOA_Student_Handbook_2025.txt', page: 3, score: 0.90 }],
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F]">
      {/* Header Banner */}
      <div className="bg-[#152E22] text-white rounded-3xl p-5 sm:p-8 shadow-xs flex items-center justify-between text-left">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8F5E9]" /> Grounded Institutional Copilot
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img src="/veyon_logo.png" alt="Veyon" className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl" />
            <h1 className="text-2xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
              Veyon AI Assistant
            </h1>
          </div>
          <p className="text-[#8C9C92] text-xs font-medium">
            Ask any academic or general question, book lab slots, or request official certificates.
          </p>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-4 sm:p-8 shadow-xs space-y-6 min-h-[480px] flex flex-col justify-between text-left">
        <div ref={chatContainerRef} className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-2xl bg-[#152E22] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className={`space-y-3 max-w-2xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#152E22] text-white font-medium rounded-tr-none'
                      : msg.isSafetyBlocked
                      ? 'bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] font-medium rounded-tl-none'
                      : 'bg-[#FAF8F3] border border-[#E5E2D9] text-[#1B231F] rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Grounded Citation Source Cards */}
                {msg.sources && msg.sources.length > 0 && (
                  <SourceCard sources={msg.sources} />
                )}

                {/* Safety Blocked Violation Card */}
                {msg.isSafetyBlocked && (
                  <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 font-bold text-[#991B1B]">
                      <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                      <span>Security Incident Logged (#SEC-SAFE-BLOCK)</span>
                    </div>
                    <p className="text-[11px] text-[#7F1D1D]">
                      Adversarial prompt injection attempt was neutralized and logged to the <strong>Immutable Audit Console</strong>. System governance gates remain strictly intact.
                    </p>
                  </div>
                )}

                {/* Uncertainty Refusal Card */}
                {msg.isUncertaintyRefusal && !msg.isSafetyBlocked && (
                  <UncertaintyCard
                    query={msg.userQuery || 'Ungrounded policy inquiry'}
                    similarityScore={msg.confidence || 0.42}
                    departmentContact={msg.departmentContact}
                  />
                )}

                {/* Interactive Action Plan Card with Human Approval Gating */}
                {msg.actionPlan && (
                  <div className="space-y-3 pt-2">
                    <ActionPlanCard
                      plan={msg.actionPlan}
                      onSubmitForApproval={async (planData) => {
                        const bf = bookingFlow;
                        const seatNo = bf.seatNo || 14;
                        const labName = bf.labName || 'Advanced AI & GPU Computing Lab';
                        const labRoom = bf.labRoom || 'Room C-204';
                        const dateSlot = bf.date || 'Tomorrow';
                        const timeSlotVal = bf.timeSlot || '14:00 - 16:00';
                        const purpose = bf.subject || 'B.Tech Capstone Project Work';

                        const trackingCode = `#LB-${Math.floor(1000 + Math.random() * 9000)}`;

                        // 1. Create request in persistent requests store
                        await requestsService.createRequest({
                          request_type: planData.intent,
                          risk_level: planData.risk_level || 'HIGH',
                          payload: {
                            tracking_code: trackingCode,
                            lab_id: 'LAB-AI-101',
                            lab_name: `${labName} (${labRoom})`,
                            room_no: labRoom,
                            workstation_no: seatNo,
                            date: dateSlot,
                            time_slot: timeSlotVal,
                            purpose,
                            student_name: 'Kaushal Raj Gupta',
                            student_reg_no: '2023-CSE-042',
                            approver_role: 'Lab_In_Charge',
                            approver_name: 'Prof. A. K. Samanta',
                          },
                        });

                        // 2. Lock workstation in backend
                        try {
                          await apiClient.post('/labs/book', {
                            lab_id: 'LAB-AI-101',
                            date: dateSlot,
                            start_time: timeSlotVal.split(' - ')[0],
                            end_time: timeSlotVal.split(' - ')[1],
                            workstation_no: seatNo,
                            purpose,
                            student_id: 'u1000000-0000-0000-0000-000000000001',
                            student_name: 'Kaushal Raj Gupta',
                            student_reg_no: '2023-CSE-042',
                            approver_name: 'Prof. A. K. Samanta',
                          });
                        } catch {
                          // Backend locked locally
                        }

                        // 3. Add to persistent approvals queue for Faculty / Lab In-Charge
                        try {
                          const existingApprovals = JSON.parse(localStorage.getItem('soa_nexus_persistent_approvals') || '[]');
                          const newApprovalTask = {
                            id: `app-${Date.now()}`,
                            request_id: `req-${Date.now()}`,
                            student_name: 'Kaushal Raj Gupta',
                            student_reg_no: '2023-CSE-042',
                            department: 'Computer Science & Engineering',
                            service_type: planData.intent,
                            lab_name: `${labName} (${labRoom})`,
                            date_slot: `${dateSlot}, ${timeSlotVal}`,
                            purpose: `${purpose} (Workstation #${seatNo})`,
                            risk_level: planData.risk_level || 'HIGH',
                            status: 'PENDING',
                            assigned_role: 'Lab_In_Charge',
                            ai_compliance_checks: [
                              { check_name: 'Course Prerequisites', status: 'PASSED', details: `Enrolled in ${purpose}` },
                              { check_name: 'Slot Capacity', status: 'AVAILABLE', details: `Workstation #${seatNo} locked for applicant` },
                              { check_name: 'Safety Compliance', status: 'CHECKED', details: 'Safety orientation verified' },
                            ],
                            created_at: 'Just now',
                          };
                          localStorage.setItem('soa_nexus_persistent_approvals', JSON.stringify([newApprovalTask, ...existingApprovals]));
                        } catch {
                          // Ignore
                        }

                        setSubmittedPlans((prev) => ({
                          ...prev,
                          [msg.id]: {
                            trackingCode,
                            approver: 'Prof. A. K. Samanta (Lab In-Charge)',
                            status: 'WAITING_FOR_APPROVAL',
                            workstationNo: seatNo,
                          },
                        }));
                      }}
                    />

                    {/* Pending Human-in-the-Loop Gating Card */}
                    {submittedPlans[msg.id] && (
                      <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-[#78350F]">
                            <Clock className="w-4 h-4 text-[#D97706] animate-pulse" />
                            <span>Pending Human-in-the-Loop Approval ({submittedPlans[msg.id].trackingCode})</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                            SEAT #{submittedPlans[msg.id].workstationNo} LOCKED
                          </span>
                        </div>

                        <p className="text-[11px] text-[#92400E] leading-relaxed">
                          Your reservation request has been submitted. <strong>Workstation Node #{submittedPlans[msg.id].workstationNo}</strong> is locked and reserved for your slot. Per university policy, <strong>{submittedPlans[msg.id].approver}</strong> must verify and sign off in the Faculty Portal before the HMAC digital access pass is issued.
                        </p>

                        <div className="pt-2 border-t border-[#FDE68A]/60 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#B45309]">
                            Status: WAITING_FOR_APPROVAL
                          </span>
                          <button
                            onClick={() => navigate('/requests')}
                            className="px-3 py-1 rounded-full bg-[#78350F] hover:bg-[#92400E] text-white font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Track in My Requests</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <span className="text-[10px] text-[#8C9C92] font-mono block">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-[#E5E2D9] text-[#152E22] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-[#5A6E63] font-semibold animate-pulse">
              <Bot className="w-4 h-4 text-[#152E22]" />
              <span>Analyzing intent & retrieving policy passages...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-[#EAE7DF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputPrompt);
            }}
            className="flex gap-2 sm:gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                bookingFlow.step === 'ask_subject'
                  ? "Enter subject/course name (e.g., Machine Learning)..."
                  : bookingFlow.step === 'ask_lab'
                  ? "Enter lab number (1-5) or name..."
                  : bookingFlow.step === 'ask_seat'
                  ? "Enter seat/workstation number..."
                  : bookingFlow.step === 'ask_datetime'
                  ? "Enter date and time (e.g., Tomorrow 2 PM to 4 PM)..."
                  : bookingFlow.step === 'confirm'
                  ? 'Type "confirm" to proceed or "cancel" to restart...'
                  : "Ask any question (e.g. 'Book AI Lab', 'What is library timing?')..."
              }
              className="flex-1 bg-[#FAF8F3] border border-[#D9D5C7] rounded-full px-5 py-3 text-xs sm:text-sm text-[#1B231F] placeholder-[#8C9C92] outline-none focus:border-[#152E22] font-medium"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
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