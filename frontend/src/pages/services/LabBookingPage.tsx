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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#E8F5E9]" /> Flagship Workflow #1
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Laboratory Slot Reservation Portal
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Book GPU computing nodes, VLSI design kiosks, and 3D modeling workstations with AI prerequisite check and Faculty sign-off.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant', { state: { initialPrompt: 'I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.' } })}
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
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
            <h2 className="text-xs font-bold text-[#5A6E63] uppercase tracking-wider">Select Laboratory Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {labCatalog.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLab(lab.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    selectedLab === lab.id
                      ? 'bg-white border-[#152E22] shadow-xs ring-1 ring-[#152E22]'
                      : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#8C9C92]">{lab.room}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                      {lab.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1B231F] text-xs">{lab.name}</h3>
                    <p className="text-[11px] text-[#5A6E63] mt-1">{lab.gpu}</p>
                  </div>

                  <div className="pt-2 border-t border-[#EAE7DF] flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-[#2E7D32]">{lab.freeSeats}/{lab.totalSeats} Free Workstations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Slot Form */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">Slot Parameters & Purpose</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Reservation Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Time Slot (2-Hour Window)</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22] font-semibold"
                >
                  <option value="10:00 - 12:00">10:00 AM – 12:00 PM</option>
                  <option value="14:00 - 16:00">02:00 PM – 04:00 PM (Recommended)</option>
                  <option value="16:00 - 18:00">04:00 PM – 06:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Project Work Description / Purpose</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="State project work purpose..."
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
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
                <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[#E65100] flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#F57F17]" /> Request Pending Faculty Approval
                    </span>
                    <button
                      onClick={handleSimulateFacultyApprove}
                      className="px-4 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Simulate Faculty Sign-Off
                    </button>
                  </div>
                  <p className="text-xs text-[#E65100]">
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
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#152E22]" /> Automated Compliance Verification
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Prerequisite Course</span>
                  <span className="text-[#2E7D32] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> PASSED
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">{currentLabObj.prerequisites} (Grade B+)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Slot Availability</span>
                  <span className="text-[#2E7D32] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> AVAILABLE
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">{currentLabObj.freeSeats} of {currentLabObj.totalSeats} workstations free</p>
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
            <div className="bg-[#FAF8F3] rounded-3xl border border-dashed border-[#D9D5C7] p-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#8C9C92] mx-auto" />
              <h4 className="font-bold text-[#1B231F] text-xs">Digital Access Permit Gated</h4>
              <p className="text-[11px] text-[#5A6E63] max-w-xs mx-auto">
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
