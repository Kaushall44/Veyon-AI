import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, CheckCircle2, ArrowRight, Download, Eye, ChevronRight } from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();

  const requestsData = [
    {
      id: '#LB-4019',
      serviceType: 'Lab Slot Reservation',
      details: 'Advanced AI & GPU Lab (Tomorrow 14:00-16:00)',
      status: 'Pending Approval',
      statusBg: 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]',
      createdDate: '2026-08-23 14:32',
      targetUrl: '/services/lab-booking',
      actionText: 'View Access Pass',
    },
    {
      id: '#CERT-881',
      serviceType: 'Bonafide Certificate PDF',
      details: 'Passport Verification Application',
      status: 'Completed',
      statusBg: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
      createdDate: '2026-08-22 10:15',
      targetUrl: '/services/certificate',
      actionText: 'Download PDF',
    },
    {
      id: '#MT-8842',
      serviceType: 'Campus Estate Maintenance',
      details: 'AC Repair — Hostel C Block Room 302',
      status: 'In Progress',
      statusBg: 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]',
      createdDate: '2026-08-20 09:40',
      targetUrl: '/services/maintenance',
      actionText: 'Track Technician',
    },
    {
      id: '#GRV-2041',
      serviceType: 'Confidential Grievance Redressal',
      details: 'Hostel Night Library Quiet Hours Enforcement',
      status: 'Under Review',
      statusBg: 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]',
      createdDate: '2026-08-18 16:20',
      targetUrl: '/services/grievance',
      actionText: 'View Resolution',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Title Banner */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E63] block mb-1">
            REAL-TIME TRACKING
          </span>
          <h1 className="text-3xl font-serif-title font-bold text-[#1B231F]">
            My Requests & Activity History
          </h1>
          <p className="text-xs text-[#5A6E63] font-medium mt-1">
            Track live approval status and download official documents across all service desks.
          </p>
        </div>

        <button
          onClick={() => navigate('/assistant')}
          className="px-5 py-2.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>New Service Request</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Requests Table Container */}
      <div className="bg-white border border-[#EAE7DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#FAF8F3] text-[#5A6E63] uppercase tracking-wider font-bold border-b border-[#EAE7DF]">
              <tr>
                <th className="p-4 sm:px-6">Request ID</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 sm:pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7DF] font-medium">
              {requestsData.map((req) => (
                <tr key={req.id} className="hover:bg-[#FAF8F3] transition-colors group">
                  <td className="p-4 sm:px-6 font-mono font-bold text-[#152E22]">{req.id}</td>
                  <td className="p-4 font-bold text-[#1B231F]">{req.serviceType}</td>
                  <td className="p-4 text-[#5A6E63]">{req.details}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full border text-[11px] font-bold ${req.statusBg}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[#8C9C92] text-[11px]">{req.createdDate}</td>
                  <td className="p-4 sm:pr-6 text-right">
                    <button
                      onClick={() => navigate(req.targetUrl)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E5E2D9] text-[#152E22] font-bold text-[11px] transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <span>{req.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#152E22] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
