import React, { useState, useEffect } from 'react';
import { ShieldCheck, Filter, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ApprovalCard, ApprovalTaskData } from '../../components/approvals/ApprovalCard';
import { RejectionModal } from '../../components/approvals/RejectionModal';
import { apiClient } from '../../services/api/apiClient';
import { Toast, ToastMessage } from '../../components/ui/Toast';

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

  const [tasks, setTasks] = useState<ApprovalTaskData[]>([
    {
      id: '80000000-0000-0000-0000-000000000001',
      request_id: '50000000-0000-0000-0000-000000000001',
      student_name: 'Kaushal Raj Gupta',
      student_reg_no: '2023-CSE-042',
      department: 'Computer Science & Engineering',
      service_type: 'LAB_BOOKING',
      lab_name: 'Advanced AI Lab (Room C-204)',
      date_slot: 'Tomorrow (24 Aug 2026), 14:00 - 16:00',
      purpose: 'B.Tech Major Capstone Project Work (Deep Learning Model Training)',
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
  ]);

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
        setTasks(res.data);
      }
    } catch (err) {
      console.log('Using local mock approval tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTask = async (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    try {
      await apiClient.post(`/approvals/${taskId}/approve`, {
        approver_id: 'faculty-001',
        comments: 'Approved after AI pre-verification check.',
      });
    } catch (err) {
      console.log('Approved task locally.');
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'APPROVED', access_pass_code: 'PASS-LAB-AI-88192' }
          : t
      )
    );

    addToast(
      'SUCCESS',
      'Request Approved Successfully!',
      `Approved request for ${targetTask?.student_name || 'student'}. Real-time notification dispatched.`
    );
  };

  const handleOpenRejectModal = (taskId: string) => {
    setRejectingTaskId(taskId);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingTaskId) return;
    const targetTask = tasks.find((t) => t.id === rejectingTaskId);

    try {
      await apiClient.post(`/approvals/${rejectingTaskId}/reject`, {
        approver_id: 'faculty-001',
        rejection_reason: reason,
      });
    } catch (err) {
      console.log('Rejected task locally.');
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === rejectingTaskId
          ? { ...t, status: 'REJECTED', approver_comments: `REJECTED: ${reason}` }
          : t
      )
    );

    addToast(
      'WARNING',
      'Request Rejected',
      `Rejection decision for ${targetTask?.student_name || 'student'} recorded.`
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
    <div className="space-y-6">
      {/* Toast Alert Provider */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Human-in-the-Loop Approval Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Faculty & Approver Desk
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Review consequential service requests requiring human sign-off. Verified by AI compliance checks.
          </p>
        </div>

        {/* Quick Filter Pill Tabs */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 shrink-0">
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'PENDING'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('DECIDED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'DECIDED'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Decided
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Tasks
          </button>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">No Pending Approvals</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All high-risk service requests have been reviewed and decided.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <ApprovalCard
              key={task.id}
              task={task}
              onApprove={handleApproveTask}
              onReject={handleOpenRejectModal}
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
