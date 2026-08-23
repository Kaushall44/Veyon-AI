# SOA Nexus AI

> **Human-in-the-Loop Agentic AI for Autonomous Institutional Service Delivery**  
> *Built for SOA IDEATHON 2026 — Problem Statement SOAIDEATHON-S1*  
> **Institution**: Siksha 'O' Anusandhan (SOA) University — Institute of Technical Education & Research (ITER), Bhubaneswar, Odisha

---

## 🌟 Executive Summary

**SOA Nexus AI** is an enterprise-grade, human-governed agentic AI service delivery platform. Traditional university administration suffers from manual paperwork delays, fragmented departmental approvals, and lack of transparency. 

SOA Nexus solves this by deploying **Human-in-the-Loop (HITL) AI Agents** that automate institutional workflows—including lab slot reservations, bonafide PDF certificate issuance, estate repairs, and grievance redressal—backed by 100% cryptographic audit trails and zero-hallucination RAG guardrails.

---

## ⚡ Do I Need to Run the Backend?

**NO — Running the backend terminal is OPTIONAL for presentation and evaluation!**

SOA Nexus AI is engineered with a **Hybrid Dual Execution Architecture**:

1. **100% Offline Mock Fallback Mode (Default & Hackathon Ready)**:
   * The frontend operates 100% autonomously using pre-loaded evaluation datasets, mock databases, local RAG vector similarity engines, and seeded institutional accounts.
   * **All 5 Demo Evaluation Scenarios** run flawlessly without needing Python or FastAPI active.
2. **Live Backend Mode (Optional)**:
   * When FastAPI backend is running on `http://localhost:8000`, the frontend automatically connects to live OpenRouter LLM inference, Supabase database, and real-time REST endpoints.

---

## 🚀 Quick Start Guide

### 1. Launching the Frontend (Mandatory)

```bash
# Navigate to project root or frontend directory
cd frontend

# Install dependencies (if first time)
npm install

# Launch Development Server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 2. Launching the Backend (Optional)

From project root:
```bash
npm run backend
```
*Or directly via Python:*
```bash
cd backend
python main.py
```
Backend API docs available at `http://localhost:8000/docs`.

---

## 🌐 Production Deployment

For complete step-by-step production deployment instructions (Vercel, Render, Railway, Docker), see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

- **Frontend**: Pre-configured with [`vercel.json`](./vercel.json) for 1-click Vercel deployment with single-page routing.
- **Backend**: Containerized with [`backend/Dockerfile`](./backend/Dockerfile) and [`backend/Procfile`](./backend/Procfile) for Render, Railway, or Cloud Run.

---

## ⚖️ Pre-Seeded Hackathon Demo Scenarios

Mounting at the top of the application is a **Sticky Judge Evaluation Bar** equipped with 1-click execution for 5 evaluation scenarios:

| # | Scenario Title | Intent & Governance | Key Demonstration Feature |
| :-: | :--- | :--- | :--- |
| **1** | **Flagship AI Lab Reservation** | `LAB_BOOKING` (High Risk, Gated) | Checks prerequisite `CS301`, GPU capacity, routes to Faculty `Prof. A. K. Samanta`, and issues QR Digital Access Pass `PASS-LAB-AI-88192`. |
| **2** | **Bonafide Certificate PDF** | `CERTIFICATE` (Medium Risk) | Verifies 0.0 fee dues and renders watermarked SOA ITER PDF certificate with QR verification payload. |
| **3** | **Multilingual Odia Repair** | `MAINTENANCE` (Low Risk, Auto) | Translates Odia input (*"ଆମ ହଷ୍ଟେଲ ରୁମ୍ B-204 ରେ ଫ୍ୟାନ୍..."*) to Canonical English, dispatches Estates Team, and responds in native script. |
| **4** | **Policy Conflict Resolution** | `POLICY_SEARCH` | Resolves circular date conflict between 2024 and 2025 examination policies using Lex Posterior rule (2025 Regulations prevail). |
| **5** | **Zero-Hallucination Refusal** | `UNCERTAINTY_REFUSAL` | Query similarity score $0.26 < 0.70$ threshold triggers non-alarming Uncertainty Card with direct Helpdesk escalation. |

---

## 👤 Seeded Test User Personas

| Role | Name & Identity | Email / Credentials | Access Scope |
| :--- | :--- | :--- | :--- |
| **Student** | Kaushal Raj Gupta (`2023-CSE-042`) | `student@soa.ac.in` | Service Requests, Pass Gallery, AI Copilot |
| **Faculty** | Dr. Sunita Panigrahi | `faculty@soa.ac.in` | Approvals Desk, Student Compliance Briefs |
| **Lab In-Charge** | Prof. A. K. Samanta | `labadmin@soa.ac.in` | Advanced AI Lab Workstation Sign-off |
| **Maintenance** | Rajesh Kumar (HVAC Lead) | `estates@soa.ac.in` | Estates Ticket Dispatch & Resolution |
| **Admin** | Officer Patnaik (Registrar) | `admin@soa.ac.in` | Admin Analytics, Vector Knowledge Base, Audit Console |

---

## 📁 Repository Directory Structure

```
SOA Nexus/
│
├── frontend/              # React 18 + TypeScript + Vite 6 + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/    # Layout, Dashboard, Services, UI, Demo Launcher
│   │   ├── data/          # Pre-seeded Scenarios, Mock Users & Policy Documents
│   │   ├── pages/         # Landing Page, Dashboard, Assistant, Approvals, Audit
│   │   ├── routes/        # AppRoutes (Public Landing / Protected Shell)
│   │   └── styles/        # Globals CSS with custom micro-animations
│   └── public/            # Custom SVG Favicon & Static Assets
│
├── backend/               # Python 3.11 + FastAPI Agentic Server
│   ├── api/routers/       # Chat, Approvals, Labs, Certificates, Maintenance, Audit
│   ├── services/ai/       # NLU Classifier, ReAct Planner, RAG Engine, Safety Guardrails
│   ├── tools/             # Institutional Service Execution Tools
│   └── tests/             # 38 Unit Tests + 7 E2E System Integration Flow Tests
│
├── docs/                  # Architecture & Requirements Specs
│   ├── prd.md             # Product Requirement Document
│   ├── architecture.md    # Technical System Specifications
│   └── design.md          # UI/UX Specification & Palette
│
├── demo_script.md         # Final SIH Judge Presentation Script (< 5 Mins)
├── package.json           # Root workspace scripts
└── .gitignore             # Git exclusion rules
```

---

## 🧪 Testing & Verification

Run the full automated backend unit test & E2E integration suite:

```bash
cd backend
python -m unittest discover tests
```

**Results**: `38 Root Unit Tests + 7 E2E Integration Suite Tests PASSED` (**100% Passage Rate**).

---

## 📄 License & Attribution

Developed for **SIH 2026 / SOA IDEATHON 2026** by Student Kaushal Raj Gupta and team.  
Institute of Technical Education and Research (ITER), Siksha 'O' Anusandhan University, Bhubaneswar.
