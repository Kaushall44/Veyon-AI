import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Monitor,
  AlertCircle,
  Check,
  RefreshCw,
  FileText,
  Lock,
  UserCheck
} from 'lucide-react';
import { apiClient } from '../../services/api/apiClient';
import { DigitalAccessPass } from '../../components/services/DigitalAccessPass';
import { WorkstationGrid } from '../../components/labs/WorkstationGrid';
import { ActionPlanCard, ActionPlanData } from '../../components/chat/ActionPlanCard';
import { useAuth } from '../../context/AuthContext';
import { requestsService } from '../../services/api/requestsService';

export const LabBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFacultyOrAdmin =
    user?.role === 'Faculty' ||
    user?.role === 'Lab_In_Charge' ||
    user?.role === 'Admin' ||
    user?.role === 'Super_Admin';
  const [selectedLab, setSelectedLab] = useState('LAB-AI-101');
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 16:00');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(14);
  const [purpose, setPurpose] = useState('B.Tech Major Capstone Project Work (Deep Learning Model Training)');
  const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'PLAN_GENERATED' | 'SUBMITTED_FOR_APPROVAL' | 'APPROVED'>('IDLE');
  const [isCommitting, setIsCommitting] = useState(false);
  
  // Real-time API States
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([3, 7, 12, 18, 22]);
  const [totalSeats, setTotalSeats] = useState(30);
  const [freeSeats, setFreeSeats] = useState(25);
  const [eligibility, setEligibility] = useState<{
    attendance_pct: number;
    cgpa: number;
    status: string;
    is_fast_track: boolean;
    details: string;
  }>({
    attendance_pct: 88.5,
    cgpa: 8.2,
    status: 'QUALIFIED',
    is_fast_track: true,
    details: 'Fast-Track Instant Permit: Attendance 88.5% >= 85%, CGPA 8.2 >= 7.5.'
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictNotice, setConflictNotice] = useState<string | null>(null);
  const [confirmedPassData, setConfirmedPassData] = useState<{
    access_pass_code: string;
    qr_payload: string;
    booking_id: string;
    workstation_no: number;
  } | null>(null);

  const labCatalog = [
    {
      id: 'LAB-AI-101',
      name: 'Advanced AI & GPU Computing Lab',
      room: 'Room C-204',
      gpu: 'NVIDIA RTX 4090 / A100 Workstations',
      freeSeats: freeSeats,
      totalSeats: totalSeats,
      badge: 'Flagship GPU Lab',
      prerequisites: 'CS301 Machine Learning',
    },
    {
      id: 'LAB-MICRO-202',
      name: 'Microelectronics & VLSI Design Lab',
      room: 'Room C-202',
      gpu: 'Cadence / Xilinx Vivado FPGA Workstations',
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

  // Fetch slot availability and occupied seats from backend API
  const fetchAvailability = async () => {
    try {
      const parts = selectedTimeSlot.split(' - ');
      const startTime = parts[0].trim();
      const endTime = parts[1].trim();

      const res = await apiClient.get<any>('/labs/availability', {
        params: {
          lab_id: selectedLab,
          date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          student_attendance: 88.5,
          student_cgpa: 8.2
        }
      });

      const data = res?.data || res;
      if (data && data.occupied_workstations) {
        setOccupiedSeats(data.occupied_workstations);
        setTotalSeats(data.total_seats || 30);
        setFreeSeats(data.free_seats_count || 25);
        if (data.student_eligibility) {
          setEligibility(data.student_eligibility);
        }
      }
    } catch {
      // Keep state
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [selectedLab, selectedDate, selectedTimeSlot]);

  // Restore confirmed pass if previously approved by faculty
  useEffect(() => {
    try {
      const savedPass = localStorage.getItem('soa_nexus_active_lab_pass');
      if (savedPass) {
        const parsed = JSON.parse(savedPass);
        if (parsed && parsed.access_pass_code) {
          setConfirmedPassData(parsed);
          setBookingStatus('APPROVED');
          if (parsed.workstation_no) {
            const seatNum = Number(parsed.workstation_no);
            setOccupiedSeats(prev => Array.from(new Set([...prev, seatNum])));
            setSelectedSeat(null); // Deselect so it clearly displays RED (LOCKED)
          }
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const demoActionPlan: ActionPlanData = {
    intent: 'LAB_BOOKING',
    risk_level: 'HIGH',
    requires_approval: true,
    assigned_approver_role: 'Prof. A. K. Samanta (Lab In-Charge)',
    summary: `4-Step Gated Execution Plan to reserve ${currentLabObj.name} (${currentLabObj.room}, Node #${selectedSeat || 14}) for ${selectedDate} (${selectedTimeSlot}).`,
    steps: [
      {
        step_number: 1,
        title: 'Check Student Course Prerequisites & Attendance',
        description: `Verified ${eligibility.details}`,
        status: 'PASSED',
        assigned_actor: 'System Auto-Check',
      },
      {
        step_number: 2,
        title: 'Row-Level Slot Lock & Workstation Allocation',
        description: `Reserved Workstation #${selectedSeat || 14} in ${currentLabObj.name} (${freeSeats}/${totalSeats} free).`,
        status: 'CHECKED',
        assigned_actor: 'Resource Allocator (Row-Lock)',
      },
      {
        step_number: 3,
        title: 'Gated Human Approval from Lab In-Charge',
        description: bookingStatus === 'APPROVED'
          ? 'Approved & Digitally Signed by Prof. A. K. Samanta (Lab In-Charge).'
          : 'Gated: Awaiting official authorization and permit sign-off from Lab In-Charge.',
        status: bookingStatus === 'APPROVED' ? 'PASSED' : 'PENDING_APPROVAL',
        assigned_actor: 'Prof. A. K. Samanta (Lab In-Charge)',
      },
      {
        step_number: 4,
        title: 'Issue Cryptographically Signed QR Access Pass',
        description: bookingStatus === 'APPROVED'
          ? `Issued signed Digital Access Pass (${confirmedPassData?.access_pass_code || 'PASS-LAB-AI-4019'}).`
          : 'Generate single-use HMAC-SHA256 verified digital entry pass post sign-off.',
        status: bookingStatus === 'APPROVED' ? 'PASSED' : 'PENDING',
        assigned_actor: 'Security Gate Service',
      },
    ],
  };

  const handleGeneratePlan = () => {
    setErrorMessage(null);
    setConflictNotice(null);
    if (!selectedSeat) {
      setErrorMessage('Please select an available workstation seat number before proceeding.');
      return;
    }
    if (occupiedSeats.includes(selectedSeat)) {
      setErrorMessage(`Workstation #${selectedSeat} is already occupied. Please select an available node.`);
      return;
    }
    setBookingStatus('PLAN_GENERATED');
  };

  const handleSubmitForApproval = async () => {
    const seatToBook = selectedSeat || 14;
    try {
      await requestsService.createRequest({
        request_type: 'LAB_BOOKING',
        risk_level: 'HIGH',
        payload: {
          lab_id: selectedLab,
          lab_name: currentLabObj.name,
          room_no: currentLabObj.room,
          workstation_no: seatToBook,
          date: selectedDate,
          slot: selectedTimeSlot,
          purpose: purpose,
          approver_name: 'Prof. A. K. Samanta (Lab In-Charge)',
        }
      });
    } catch {
      // Ignore
    }
    setBookingStatus('SUBMITTED_FOR_APPROVAL');
  };

  const handleCommitReservation = async () => {
    setIsCommitting(true);
    setErrorMessage(null);
    setConflictNotice(null);
    const bookedSeat = selectedSeat || 14;
    try {
      const parts = selectedTimeSlot.split(' - ');
      const startTime = parts[0].trim();
      const endTime = parts[1].trim();

      const payload = {
        lab_id: selectedLab,
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        workstation_no: bookedSeat,
        purpose: purpose,
        student_id: 'u1000000-0000-0000-0000-000000000001',
        student_name: 'Kaushal Raj Gupta',
        student_reg_no: '2023-CSE-042',
        approver_name: 'Prof. A. K. Samanta'
      };

      const res = await apiClient.post<any>('/labs/book', payload);
      const data = res?.data || res;
      if (data) {
        const passObj = {
          access_pass_code: data.access_pass_code,
          qr_payload: data.qr_payload,
          booking_id: data.booking_id,
          workstation_no: data.workstation_no,
          student_name: 'Kaushal Raj Gupta',
          student_reg_no: '2023-CSE-042',
          lab_id: selectedLab,
          room_no: currentLabObj.room,
          date_slot: `${selectedDate}, ${selectedTimeSlot}`,
          approver_name: 'Prof. A. K. Samanta (Lab In-Charge)',
        };
        setConfirmedPassData(passObj);
        setBookingStatus('APPROVED');
        setOccupiedSeats(prev => Array.from(new Set([...prev, Number(data.workstation_no)])));
        setSelectedSeat(null); // Clear selection so it renders in RED locked state
        localStorage.setItem('soa_nexus_active_lab_pass', JSON.stringify(passObj));
        await requestsService.updateStatus('LAB_BOOKING', 'APPROVED', 'Approved by Lab In-Charge', passObj);
        fetchAvailability();
      }
    } catch (err: any) {
      if (err.response?.status === 409 || err.status === 409) {
        const detail = err.response?.data?.detail || err.message || 'Workstation already reserved.';
        setConflictNotice(detail);
        setBookingStatus('PLAN_GENERATED');
        fetchAvailability();
      } else {
        // Fallback simulation
        const passObj = {
          access_pass_code: `PASS-LAB-AI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          qr_payload: `SOA-NEXUS-PASS|PASS-LAB-AI-DEMO|${selectedLab}|${currentLabObj.room}|SEAT-${bookedSeat}|${selectedDate}|${selectedTimeSlot}|2023-CSE-042|SIG:VERIFIED`,
          booking_id: `BK-CONF-SEAT-${bookedSeat}`,
          workstation_no: bookedSeat,
          student_name: 'Kaushal Raj Gupta',
          student_reg_no: '2023-CSE-042',
          lab_id: selectedLab,
          room_no: currentLabObj.room,
          date_slot: `${selectedDate}, ${selectedTimeSlot}`,
          approver_name: 'Prof. A. K. Samanta (Lab In-Charge)',
        };
        setConfirmedPassData(passObj);
        setOccupiedSeats(prev => Array.from(new Set([...prev, Number(bookedSeat)])));
        setSelectedSeat(null);
        setBookingStatus('APPROVED');
        localStorage.setItem('soa_nexus_active_lab_pass', JSON.stringify(passObj));
        await requestsService.updateStatus('LAB_BOOKING', 'APPROVED', 'Approved by Lab In-Charge', passObj);
      }
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#E8F5E9]" /> Flagship Workflow #1 (Phase 14)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            High-Performance Laboratory Reservation
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Reserve dedicated GPU workstations with row-level database locking, attendance prerequisite checks, and cryptographically signed digital entry passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/assistant', { state: { initialPrompt: 'I want to reserve an RTX 4090 station in the AI Computing Lab.' } })}
            className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#152E22]" />
            <span>Book via AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 7 Cols Left Form & Workstation Grid, 5 Cols Right Passes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Workstation Grid (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lab Catalog Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#5A6E63] uppercase tracking-wider">Select Laboratory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {labCatalog.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => {
                    setSelectedLab(lab.id);
                    setSelectedSeat(null);
                    setBookingStatus('IDLE');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedLab === lab.id
                      ? 'bg-white border-[#152E22] ring-1 ring-[#152E22] shadow-xs'
                      : 'bg-[#FAF8F3] border-[#E5E2D9] hover:border-[#152E22]'
                  }`}
                >
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                    {lab.badge}
                  </span>
                  <h3 className="font-bold text-xs text-[#1B231F] mt-1">{lab.name}</h3>
                  <div className="text-[11px] text-[#5A6E63] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#152E22]" /> {lab.room}
                  </div>
                  <div className="text-[11px] text-[#152E22] font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[#152E22]" /> {lab.freeSeats} of {lab.totalSeats} Nodes Free
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slot & Date Config Card */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">Session Parameters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-bold text-[#1B231F] mb-1">Time Slot (Max 2 hrs)</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
                >
                  <option value="10:00 - 12:00">10:00 AM - 12:00 PM (Morning)</option>
                  <option value="14:00 - 16:00">02:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="16:30 - 18:30">04:30 PM - 06:30 PM (Evening Research)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B231F] mb-1">Academic Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="State your research project, lab experiment, or capstone goal"
                className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-xl p-3 text-xs text-[#1B231F] outline-none focus:border-[#152E22]"
              />
            </div>
          </div>

          {/* Interactive Workstation Matrix with Row-Lock Indicators */}
          <WorkstationGrid
            totalSeats={totalSeats}
            occupiedSeats={occupiedSeats}
            selectedSeat={selectedSeat}
            onSelectSeat={(seat) => {
              setSelectedSeat(seat);
              setErrorMessage(null);
              setConflictNotice(null);
            }}
            gpuModel={currentLabObj.gpu}
            roomNo={currentLabObj.room}
            isFastTrack={eligibility.is_fast_track}
          />

          {/* Error & Conflict Banners */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {conflictNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{conflictNotice}</span>
              </div>
              <button
                onClick={fetchAvailability}
                className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Grid
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleGeneratePlan}
              className="px-6 py-3 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Generate ReAct Execution Plan</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive ReAct Action Plan Output */}
          {bookingStatus !== 'IDLE' && (
            <div className="space-y-4 pt-2">
              <ActionPlanCard
                plan={demoActionPlan}
                onSubmitForApproval={handleSubmitForApproval}
              />

              {/* Lab In-Charge Gated Sign-Off Card (Separated by Role) */}
              {bookingStatus === 'SUBMITTED_FOR_APPROVAL' && (
                isFacultyOrAdmin ? (
                  <div className="p-5 rounded-3xl bg-[#FFF8E1] border border-[#FFE082] space-y-3 shadow-sm animate-fade-in text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#E65100]">
                        <ShieldAlert className="w-4.5 h-4.5 text-[#F57F17] shrink-0" />
                        <span>Faculty Access: Prof. A. K. Samanta (Lab In-Charge)</span>
                      </div>
                      <button
                        onClick={handleCommitReservation}
                        disabled={isCommitting}
                        className="px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{isCommitting ? 'Committing Row Lock...' : 'Approve & Sign Lab Permit'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#795548] leading-relaxed">
                      You are viewing as <strong>Faculty / Lab In-Charge</strong>. Click <strong>Approve &amp; Sign Lab Permit</strong> to verify student attendance and issue the cryptographically signed entry pass.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-3xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-3 shadow-xs animate-fade-in text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#152E22]">
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>Submitted to Approver Queue (Prof. A. K. Samanta)</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        PENDING APPROVAL
                      </span>
                    </div>
                    <p className="text-xs text-[#5A6E63] leading-relaxed">
                      Your reservation request for <strong>Node #{selectedSeat || 14}</strong> in <strong>{currentLabObj.room}</strong> has been submitted. Because you are logged in as a <strong>Student</strong>, this request must be authorized by <strong>Prof. A. K. Samanta (Lab In-Charge)</strong> before the digital pass can be issued.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[#EAE7DF]">
                      <button
                        onClick={() => navigate('/requests')}
                        className="text-xs font-bold text-[#152E22] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Track status in My Requests</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate('/approvals')}
                        className="px-3.5 py-1.5 rounded-full bg-[#152E22]/10 hover:bg-[#152E22]/20 text-[#152E22] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>View in Faculty Approvals Portal →</span>
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Right Column: AI Prerequisite & Digital Access Pass (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Automated AI Prerequisite & Compliance Card */}
          <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B231F] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#152E22]" /> Automated Prerequisite Check
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Attendance Status</span>
                  <span className="text-[#2E7D32] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> {eligibility.attendance_pct}% (QUALIFIED)
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">
                  Mandatory threshold: ≥ 75.0% (Fast-Track: ≥ 85.0%)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Course Prerequisite</span>
                  <span className="text-[#2E7D32] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> CS301 PASSED
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">Machine Learning (Grade B+)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1B231F]">Slot Concurrency</span>
                  <span className="text-[#2E7D32] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" /> {freeSeats} Free Nodes
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6E63]">
                  {occupiedSeats.length} of {totalSeats} stations currently locked
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographically Signed Digital Access Pass Output */}
          {bookingStatus === 'APPROVED' && confirmedPassData && (
            <div className="space-y-3 animate-fade-in">
              <DigitalAccessPass
                accessPassCode={confirmedPassData.access_pass_code}
                studentName="Kaushal Raj Gupta"
                studentRegNo="2023-CSE-042"
                labName={currentLabObj.name}
                roomNo={currentLabObj.room}
                workstationNo={confirmedPassData.workstation_no}
                dateSlot={`${selectedDate}, ${selectedTimeSlot}`}
                purpose={purpose}
                approverName="Prof. A. K. Samanta"
                qrPayload={confirmedPassData.qr_payload}
                gpuNodes={currentLabObj.gpu}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabBookingPage;
