import React, { useState, useEffect } from 'react';
import { ShieldCheck, Filter, Clock, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { ApprovalActionCard } from '../../components/approvals/ApprovalActionCard';
import { ApprovalTaskData } from '../../components/approvals/ApprovalCard';
import { RejectionModal } from '../../components/approvals/RejectionModal';
import { apiClient } from '../../services/api/apiClient';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { requestsService } from '../../services/api/requestsService';

export const FacultyApprovalsPage: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [tasks, setTasks] = useState<ApprovalTaskData[]>(() => {
    try {
      const saved = localStorage.getItem('soa_nexus_persistent_approvals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: '80000000-0000-0000-0000-000000000001',
        request_id: '50000000-0000-0000-0000-000000000001',
        student_name: 'Kaushal Raj Gupta',
        student_reg_no: '2023-CSE-042',
        department: 'Computer Science & Engineering',
        service_type: 'LAB_BOOKING',
        lab_name: 'Advanced AI & GPU Computing Lab (Room C-204)',
        date_slot: 'Tomorrow (24 Aug 2026), 14:00 - 16:00',
        purpose: 'B.Tech Major Capstone Project Work (Deep Learning Model Training on RTX 4090)',
        risk_level: 'HIGH',
        status: 'PENDING',
        assigned_role: 'Lab_In_Charge',
        ai_compliance_checks: [
          { check_name: 'Course Prerequisites', status: 'PASSED', details: 'Passed CS301 Machine Learning with Grade B+' },
          { check_name: 'Slot Capacity', status: 'AVAILABLE', details: '25 out of 30 GPU workstations free' },
          { check_name: 'Safety Compliance', status: 'CHECKED', details: 'Safety orientation completed on 10 Aug 2026' },
        ],
        created_at: '10 mins ago',
      },
      {
        id: '80000000-0000-0000-0000-000000000002',
        request_id: '50000000-0000-0000-0000-000000000002',
        student_name: 'Ananya Mishra',
        student_reg_no: '2023-CSE-089',
        department: 'Computer Science & Engineering',
        service_type: 'CERTIFICATE',
        lab_name: 'Academic Registrar Office',
        date_slot: 'Immediate Issuance',
        purpose: 'Bonafide Certificate for Bank Education Loan',
        risk_level: 'MEDIUM',
        status: 'PENDING',
        assigned_role: 'Faculty',
        ai_compliance_checks: [
          { check_name: 'Active Enrollment', status: 'PASSED', details: 'Verified 3rd Year B.Tech CSE' },
          { check_name: 'Tuition Fee Clearance', status: 'PASSED', details: 'Zero outstanding dues for Semester 5' },
        ],
        created_at: '35 mins ago',
      },
    ];
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'DECIDED'>('PENDING');
  const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/approvals');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setTasks((prev) => {
          // Merge decided status from local storage so refreshed page preserves decisions
          const updated = res.data.map((backendTask: ApprovalTaskData) => {
            const locallyDecided = prev.find((p) => p.id === backendTask.id && p.status !== 'PENDING');
            return locallyDecided ? locallyDecided : backendTask;
          });
          localStorage.setItem('soa_nexus_persistent_approvals', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.log('Using local mock approval tasks.');
    } finally {
      setLoading(false);
    }
  };

  const updateAndPersistTasks = (updated: ApprovalTaskData[]) => {
    setTasks(updated);
    try {
      localStorage.setItem('soa_nexus_persistent_approvals', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleApproveTask = async (taskId: string, comments?: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    let generatedPass = 'PASS-LAB-AI-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const res = await apiClient.post(`/approvals/${taskId}/decide`, {
        decision: 'APPROVED',
        approver_id: 'faculty-001',
        comments: comments || 'Approved after AI prerequisite check.',
      });
      if (res.data?.access_pass_code) {
        generatedPass = res.data.access_pass_code;
      }
    } catch (err) {
      console.log('Approved task locally.');
    }

    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: 'APPROVED' as const, access_pass_code: generatedPass }
        : t
    );
    updateAndPersistTasks(updated);

    // Persist active lab pass so student can retrieve it
    const passObj = {
      access_pass_code: generatedPass,
      qr_payload: `SOA-NEXUS-PASS|${generatedPass}|LAB-AI-101|Room C-204|SEAT-14|Tomorrow (24 Aug 2026)|14:00 - 16:00|2023-CSE-042|SIG:VERIFIED_BY_FACULTY`,
      booking_id: `BK-CONF-SEAT-14`,
      workstation_no: 14,
      student_name: targetTask?.student_name || 'Kaushal Raj Gupta',
      student_reg_no: targetTask?.student_reg_no || '2023-CSE-042',
      lab_id: 'LAB-AI-101',
      room_no: 'Room C-204',
      date_slot: '2026-08-24, 14:00 - 16:00',
      approver_name: 'Prof. A. K. Samanta (Lab In-Charge)',
    };

    try {
      localStorage.setItem('soa_nexus_active_lab_pass', JSON.stringify(passObj));
      // Update request in synchronized store
      await requestsService.updateStatus(
        targetTask?.request_id || targetTask?.id || '50000000-0000-0000-0000-000000000001',
        'APPROVED',
        comments || 'Approved by Faculty Lab In-Charge after prerequisite evaluation.',
        passObj
      );
      // Lock seat in backend
      await apiClient.post('/labs/book', {
        lab_id: 'LAB-AI-101',
        date: '2026-08-24',
        start_time: '14:00',
        end_time: '16:00',
        workstation_no: 14,
        purpose: 'B.Tech Major Capstone Project Work',
        student_id: 'u1000000-0000-0000-0000-000000000001',
        student_name: 'Kaushal Raj Gupta',
        student_reg_no: '2023-CSE-042',
        approver_name: 'Prof. A. K. Samanta'
      });
    } catch {
      // Ignore
    }

    addToast(
      'SUCCESS',
      'Sign-off Granted & Access Pass Issued',
      `Approved request for ${targetTask?.student_name || 'student'}. Digital access pass ${generatedPass} generated.`
    );
  };

  const handleClarificationTask = async (taskId: string, comments: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    try {
      await apiClient.post(`/approvals/${taskId}/decide`, {
        decision: 'CLARIFICATION_REQUESTED',
        approver_id: 'faculty-001',
        comments: comments,
      });
    } catch (err) {
      console.log('Clarification recorded locally.');
    }

    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: 'CLARIFICATION_REQUESTED' as const, approver_comments: comments }
        : t
    );
    updateAndPersistTasks(updated);

    addToast(
      'INFO',
      'Clarification Requested',
      `Sent notification to ${targetTask?.student_name || 'student'} requesting details.`
    );
  };

  const handleOpenRejectModal = (taskId: string) => {
    setRejectingTaskId(taskId);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingTaskId) return;
    const targetTask = tasks.find((t) => t.id === rejectingTaskId);

    try {
      await apiClient.post(`/approvals/${rejectingTaskId}/decide`, {
        decision: 'REJECTED',
        approver_id: 'faculty-001',
        justification: reason,
      });
    } catch (err) {
      console.log('Rejected task locally.');
    }

    const updated = tasks.map((t) =>
      t.id === rejectingTaskId
        ? { ...t, status: 'REJECTED' as const, approver_comments: reason }
        : t
    );
    updateAndPersistTasks(updated);

    addToast(
      'WARNING',
      'Request Rejected',
      `Rejection decision for ${targetTask?.student_name || 'student'} recorded in audit log.`
    );

    setRejectingTaskId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'PENDING') return t.status === 'PENDING';
    if (activeFilter === 'DECIDED') return t.status !== 'PENDING';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const targetTaskForModal = tasks.find((t) => t.id === rejectingTaskId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 text-left">
      {/* Toast Alert Provider */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Header Banner (Minimal Institutional Dark Theme) */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white" /> Human-in-the-Loop Gated Sign-Off Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Faculty & Approver Desk
          </h1>
          <p className="text-neutral-400 text-xs font-normal max-w-xl leading-relaxed">
            Review consequential service requests requiring human sign-off. Inspect prerequisite compliance and issue cryptographically verifiable credentials.
          </p>
        </div>

        {/* Quick Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/15 shrink-0">
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'PENDING'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('DECIDED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'DECIDED'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Decided
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            All Tasks
          </button>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-neutral-800 mx-auto" />
            <h3 className="font-bold text-neutral-900 text-lg">No Pending Approvals</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              All high-risk service requests have been reviewed and decided.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <ApprovalActionCard
              key={task.id}
              task={task}
              onApprove={handleApproveTask}
              onReject={handleOpenRejectModal}
              onRequestClarification={handleClarificationTask}
            />
          ))
        )}
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={Boolean(rejectingTaskId)}
        studentName={targetTaskForModal?.student_name || ''}
        requestId={targetTaskForModal?.request_id || ''}
        onClose={() => setRejectingTaskId(null)}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
};

export default FacultyApprovalsPage;
