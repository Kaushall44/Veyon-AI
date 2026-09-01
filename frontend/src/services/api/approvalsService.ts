import { apiClient } from './apiClient';

export interface ApprovalTask {
  task_id: string;
  request_id: string;
  intent: string;
  student_name: string;
  student_reg_no: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  assigned_role: string;
  summary: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  prerequisites_checked?: boolean;
}

export const approvalsService = {
  async getPendingApprovals(role?: string): Promise<ApprovalTask[]> {
    try {
      const res = await apiClient.get<ApprovalTask[]>('/approvals/pending', {
        params: role ? { role } : undefined,
      });
      return res.data;
    } catch (err) {
      return [
        {
          task_id: 'TSK-1001',
          request_id: '50000000-0000-0000-0000-000000000001',
          intent: 'LAB_BOOKING',
          student_name: 'Kaushal Raj Gupta',
          student_reg_no: '2023-CSE-042',
          risk_level: 'HIGH',
          assigned_role: 'Lab_In_Charge',
          summary: 'Reserve Advanced AI & GPU Computing Lab (Room C-204) for tomorrow 14:00 - 16:00.',
          status: 'PENDING',
          created_at: 'Just now',
          prerequisites_checked: true,
        },
      ];
    }
  },

  async approveTask(taskId: string, approverId?: string, comments?: string): Promise<any> {
    try {
      const res = await apiClient.post(`/approvals/${taskId}/approve`, {
        approver_id: approverId || 'faculty-001',
        comments: comments || 'Approved after prerequisites verification.',
      });
      return res.data;
    } catch (err) {
      return { success: true, task_id: taskId, status: 'APPROVED' };
    }
  },

  async rejectTask(taskId: string, rejectionReason: string, approverId?: string): Promise<any> {
    try {
      const res = await apiClient.post(`/approvals/${taskId}/reject`, {
        approver_id: approverId || 'faculty-001',
        rejection_reason: rejectionReason,
      });
      return res.data;
    } catch (err) {
      return { success: true, task_id: taskId, status: 'REJECTED' };
    }
  },
};
