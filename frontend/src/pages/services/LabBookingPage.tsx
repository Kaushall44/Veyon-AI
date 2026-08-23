import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Calendar, Clock, MapPin, Sparkles, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { DigitalAccessPass } from '../../components/services/DigitalAccessPass';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';

export const LabBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLab, setSelectedLab] = useState('LAB-AI-101');
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 16:00');
  const [purpose, setPurpose] = useState('B.Tech Major Capstone Project Work (Deep Learning Model Training)');
  const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'PLAN_GENERATED' | 'SUBMITTED_FOR_APPROVAL' | 'APPROVED'>('IDLE');

  const labCatalog = [
    {
      id: 'LAB-AI-101',
      name: 'Advanced AI & GPU Computing Lab',
      room: 'Room C-204',
      gpu: 'NVIDIA A100 / RTX 4090 Workstations',
      freeSeats: 25,
      totalSeats: 30,
      badge: 'Flagship Lab',
      prerequisites: 'CS301 Machine Learning',
    },
    {
      id: 'LAB-MICRO-202',
      name: 'Microelectronics & VLSI Design Lab',
      room: 'Room C-202',
      gpu: 'Cadence / Xilinx FPGA Workstations',
      freeSeats: 18,
      totalSeats: 25,
      badge: 'VLSI Design',
      prerequisites: 'EC202 VLSI Design',
    },
    {
      id: 'LAB-CAD-103',
      name: 'Mechanical CAD & 3D Modeling Kiosk',
      room: 'Room C-103',
      gpu: 'SolidWorks / ANSYS Workstations',
      freeSeats: 12,
      totalSeats: 20,
      badge: 'CAD Kiosk',
      prerequisites: 'ME101 Engineering Graphics',
    },
  ];

  const currentLabObj = labCatalog.find((l) => l.id === selectedLab) || labCatalog[0];

  const demoActionPlan: ActionPlanData = {
    intent: 'LAB_BOOKING',
    risk_level: 'HIGH',
    requires_approval: true,
    assigned_approver_role: 'Lab_In_Charge',
    summary: `4-Step Gated Execution Plan to reserve ${currentLabObj.name} (${currentLabObj.room}) for ${selectedDate} (${selectedTimeSlot}).`,
    steps: [
      {
        step_number: 1,
        title: 'Check Student Course Prerequisites',
        description: `Verified student passed prerequisite ${currentLabObj.prerequisites} with Grade B+ or higher.`,
        status: 'PASSED',
        assigned_actor: 'System Auto-Check',
      },
      {
        step_number: 2,
        title: 'Verify Lab Slot Availability',
        description: `Checked capacity for ${currentLabObj.name} (${currentLabObj.freeSeats}/${currentLabObj.totalSeats} workstations available).`,
        status: 'CHECKED',
        assigned_actor: 'Resource Manager',
      },
      {
        step_number: 3,
        title: 'Gated Human Approval from Lab In-Charge',
        description: 'Request routed to Prof. A. K. Samanta for mandatory sign-off.',
        status: 'PENDING_APPROVAL',
        assigned_actor: 'Prof. A. K. Samanta (Lab In-Charge)',
      },
      {
        step_number: 4,
        title: 'Issue Digital QR Access Pass',
        description: 'Generate single-use QR access code upon faculty approval.',
        status: 'PENDING',
        assigned_actor: 'Security Gate Service',
      },
    ],
  };

  const handleGeneratePlan = () => {
    setBookingStatus('PLAN_GENERATED');
  };

  const handleSubmitForApproval = () => {
    setBookingStatus('SUBMITTED_FOR_APPROVAL');
  };

  const handleSimulateFacultyApprove = () => {
    setBookingStatus('APPROVED');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" /> Flagship Workflow #1
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Laboratory Slot Reservation Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Book GPU computing nodes, VLSI design kiosks, and 3D modeling workstations with AI prerequisite check and Faculty sign-off.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.' } })}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch via AI Copilot</span>
        </button>
      </div>

      {/* Main Reservation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Room Selector & Slot Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lab Catalog Selector */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Laboratory Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {labCatalog.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLab(lab.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    selectedLab === lab.id
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">{lab.room}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {lab.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{lab.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{lab.gpu}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-emerald-600">{lab.freeSeats}/{lab.totalSeats} Free Workstations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Slot Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Slot Parameters & Purpose</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reservation Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot (2-Hour Window)</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="10:00 - 12:00">10:00 AM – 12:00 PM</option>
                  <option value="14:00 - 16:00">02:00 PM – 04:00 PM (Recommended)</option>
                  <option value="16:00 - 18:00">04:00 PM – 06:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Work Description / Purpose</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="State project work purpose..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Generate ReAct Execution Plan</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive ReAct Action Plan Card output */}
          {bookingStatus !== 'IDLE' && (
            <div className="space-y-4">
              <ActionPlanCard
                plan={demoActionPlan}
                onSubmitForApproval={handleSubmitForApproval}
              />

              {bookingStatus === 'SUBMITTED_FOR_APPROVAL' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" /> Request Pending Faculty Approval
                    </span>
                    <button
                      onClick={handleSimulateFacultyApprove}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Simulate Faculty Sign-Off
                    </button>
                  </div>
                  <p className="text-xs text-amber-700">
                    Request #LB-4019 is gated under Human-in-the-Loop governance. Click <strong>Simulate Faculty Sign-Off</strong> to issue the Digital Access Permit.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: AI Compliance & Generated Digital Access Pass */}
        <div className="space-y-6">
          {/* AI Compliance Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Automated Compliance Verification
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Prerequisite Course</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> PASSED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{currentLabObj.prerequisites} (Grade B+)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Slot Availability</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AVAILABLE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{currentLabObj.freeSeats} of {currentLabObj.totalSeats} workstations free</p>
              </div>
            </div>
          </div>

          {/* Digital Access Permit Card (Rendered upon approval) */}
          {bookingStatus === 'APPROVED' ? (
            <DigitalAccessPass
              accessPassCode="PASS-LAB-AI-88192"
              studentName="Kaushal Raj Gupta"
              studentRegNo="2023-CSE-042"
              labName={currentLabObj.name}
              roomNo={currentLabObj.room}
              dateSlot={`${selectedDate}, ${selectedTimeSlot}`}
              purpose={purpose}
              approverName="Prof. A. K. Samanta"
            />
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-xs">Digital Access Permit Gated</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Access permit with embedded QR code will render here automatically upon Faculty sign-off.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabBookingPage;
