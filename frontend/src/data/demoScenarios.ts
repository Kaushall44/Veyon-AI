export interface DemoScenario {
  id: string;
  scenarioNumber: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: 'indigo' | 'emerald' | 'amber' | 'purple' | 'red';
  targetPath: string;
  initialPrompt: string;
  role: 'Student' | 'Faculty' | 'Admin';
  expectedOutcome: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'DEMO-1',
    scenarioNumber: 1,
    title: 'Flagship AI Lab Booking',
    subtitle: 'Human-in-the-Loop Approval',
    description: 'Reserves Advanced AI & GPU Computing Lab (Room C-204) for tomorrow 14:00-16:00 for Kaushal Raj Gupta. Demonstrates automated prerequisite verification and faculty approval routing.',
    badge: 'Flagship Flow',
    color: 'indigo',
    targetPath: '/assistant',
    initialPrompt: 'I want to book the AI Lab tomorrow from 2 PM to 4 PM for my machine learning project.',
    role: 'Student',
    expectedOutcome: 'Generates 4-step execution plan, checks CS301 prerequisite, and routes to Prof. A. K. Samanta for sign-off.',
  },
  {
    id: 'DEMO-2',
    scenarioNumber: 2,
    title: 'Bonafide Certificate PDF Issuance',
    subtitle: 'Official University Template',
    description: 'Generates an official SOA ITER Fee Structure & Bonafide Certificate PDF for scholarship/passport with QR code verification.',
    badge: 'PDF Generator',
    color: 'emerald',
    targetPath: '/services/certificate',
    initialPrompt: 'I need an official Fee Structure & Bonafide Certificate for my e-Kalyan scholarship application.',
    role: 'Student',
    expectedOutcome: 'Validates student active enrollment (23CSE042) and renders official watermarked SOA ITER PDF document.',
  },
  {
    id: 'DEMO-3',
    scenarioNumber: 3,
    title: 'Multilingual Odia Maintenance Ticket',
    subtitle: 'Native Script NLU',
    description: 'Processes native Odia maintenance request ("ଆମ ହଷ୍ଟେଲ ରୁମ୍ B-204 ରେ ଫ୍ୟାନ୍ କାମ କରୁନାହିଁ") and dispatches Estates Maintenance Team.',
    badge: 'Odia Script',
    color: 'amber',
    targetPath: '/assistant',
    initialPrompt: 'ଆମ ହଷ୍ଟେଲ ରୁମ୍ B-204 ରେ ଫ୍ୟାନ୍ କାମ କରୁନାହିଁ।',
    role: 'Student',
    expectedOutcome: 'Translates query to Canonical English, classifies MAINTENANCE intent, dispatches technician, and responds in Odia.',
  },
  {
    id: 'DEMO-4',
    scenarioNumber: 4,
    title: 'Policy Conflict & Resolution',
    subtitle: 'Lex Posterior Precedence',
    description: 'Evaluates conflicting 2024 vs 2025 examination guidelines and resolves conflict using Lex Posterior (newer policy prevails).',
    badge: 'Conflict Engine',
    color: 'purple',
    targetPath: '/assistant',
    initialPrompt: 'What is the attendance requirement and grading scale for end-sem exams?',
    role: 'Student',
    expectedOutcome: 'Detects circular date conflict between 2024 and 2025 policy, applies Lex Posterior rule, and cites 2025 Regulations.',
  },
  {
    id: 'DEMO-5',
    scenarioNumber: 5,
    title: 'Uncertainty & Zero-Hallucination Refusal',
    subtitle: 'RAG Similarity < 0.70',
    description: 'Triggers zero-hallucination refusal card for ungrounded prompt ("What is the exact fine for losing a cafeteria spoon?").',
    badge: 'Zero-Hallucination',
    color: 'red',
    targetPath: '/assistant',
    initialPrompt: 'What is the exact fine for losing a cafeteria spoon in the hostel mess?',
    role: 'Student',
    expectedOutcome: 'RAG similarity score drops to 0.26 (<0.70), rendering non-alarming Uncertainty Card with Helpdesk escalation.',
  },
];
