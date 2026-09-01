import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Eye, 
  ChevronRight, 
  X, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Award,
  QrCode
} from 'lucide-react';
import { requestsService, ServiceRequestItem } from '../services/api/requestsService';
import { notificationsService } from '../services/api/notificationsService';
import { DigitalAccessPass } from '../components/services/DigitalAccessPass';

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestItem | null>(null);
  const [activePassModal, setActivePassModal] = useState<any | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await requestsService.getRequests(typeFilter, statusFilter);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Real-time synchronization when any approval or notification arrives
    const unsubscribe = notificationsService.subscribeToSSE(() => {
      fetchRequests();
    });

    return () => {
      unsubscribe();
    };
  }, [typeFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('COMPLETED') || s.includes('APPROVED')) {
      return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
    }
    if (s.includes('WAITING') || s.includes('PENDING')) {
      return 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]';
    }
    if (s.includes('IN_PROGRESS') || s.includes('PROGRESS') || s.includes('REVIEW')) {
      return 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]';
    }
    if (s.includes('REJECTED') || s.includes('CANCELLED')) {
      return 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]';
    }
    return 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]';
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case 'LAB_BOOKING':
        return 'Lab Slot Reservation';
      case 'CERTIFICATE':
        return 'Bonafide Certificate PDF';
      case 'MAINTENANCE':
        return 'Campus Estate Maintenance';
      case 'GRIEVANCE':
        return 'Confidential Grievance';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const getTargetUrl = (type: string) => {
    switch (type.toUpperCase()) {
      case 'LAB_BOOKING':
        return '/services/lab-booking';
      case 'CERTIFICATE':
        return '/services/certificate';
      case 'MAINTENANCE':
        return '/services/maintenance';
      case 'GRIEVANCE':
        return '/services/grievance';
      default:
        return '/services';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Title Banner */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E63] block mb-1">
            DETERMINISTIC LIFECYCLE ENGINE
          </span>
          <h1 className="text-3xl font-serif-title font-bold text-[#1B231F]">
            My Requests &amp; Activity History
          </h1>
          <p className="text-xs text-[#5A6E63] mt-1 font-medium">
            Track real-time status transitions, audit trails, and retrieve your approved digital access passes.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="px-4 py-2 rounded-full border border-[#D9D5C7] hover:bg-[#FAF8F3] text-[#1B231F] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Service Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'LAB_BOOKING', 'CERTIFICATE', 'MAINTENANCE', 'GRIEVANCE'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-[#152E22] text-white shadow-2xs'
                  : 'bg-[#FAF8F3] text-[#5A6E63] border border-[#E5E2D9] hover:border-[#152E22]'
              }`}
            >
              {t === 'ALL' ? 'All Services' : getServiceTypeLabel(t)}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#5A6E63] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F3] border border-[#D9D5C7] text-xs rounded-xl px-3 py-1.5 text-[#1B231F] font-medium outline-none focus:border-[#152E22] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="WAITING_FOR_APPROVAL">Waiting Approval</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Table View */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE7DF] bg-[#FAF8F3] text-[#5A6E63] font-bold text-[10px] uppercase tracking-wider">
                <th className="p-4 sm:pl-6">Tracking Code</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Lifecycle Status</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4 sm:pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7DF]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5A6E63]">
                    <div className="flex items-center justify-center gap-2 font-medium">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#152E22]" />
                      <span>Loading request records...</span>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8C9C92]">
                    No request records found matching the active filters.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isApprovedLab = req.request_type === 'LAB_BOOKING' && (req.status === 'APPROVED' || req.status === 'COMPLETED');
                  return (
                    <tr key={req.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                      <td className="p-4 sm:pl-6 font-mono font-bold text-[#1B231F]">
                        {req.tracking_code}
                      </td>
                      <td className="p-4 font-semibold text-[#1B231F]">
                        {getServiceTypeLabel(req.request_type)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.risk_level === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : req.risk_level === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {req.risk_level}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full border text-[11px] font-bold ${getStatusBadge(req.status)}`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[#8C9C92] text-[11px]">
                        {req.created_at?.replace('T', ' ').slice(0, 16)}
                      </td>
                      <td className="p-4 sm:pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isApprovedLab && (
                            <button
                              onClick={() => {
                                const passObj = {
                                  accessPassCode: req.payload?.access_pass_code || 'PASS-LAB-AI-4019',
                                  studentName: 'Kaushal Raj Gupta',
                                  studentRegNo: '2023-CSE-042',
                                  labName: 'Advanced AI & GPU Computing Lab',
                                  roomNo: 'Room C-204',
                                  workstationNo: req.payload?.workstation_no || 14,
                                  dateSlot: '2026-08-24, 14:00 - 16:00',
                                  purpose: req.payload?.purpose || 'Capstone Research',
                                  approverName: 'Prof. A. K. Samanta',
                                  qrPayload: req.payload?.qr_payload,
                                };
                                setActivePassModal(passObj);
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] border border-[#C8E6C9] font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View Pass</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 rounded-lg hover:bg-[#EFECE3] text-[#5A6E63] hover:text-[#152E22] transition-colors"
                            title="View Request Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(getTargetUrl(req.request_type))}
                            className="px-3 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E5E2D9] text-[#152E22] font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#5A6E63] uppercase tracking-wider block">
                    REQUEST LIFECYCLE DETAILS
                  </span>
                  <h2 className="text-xl font-bold font-serif-title text-[#1B231F] flex items-center gap-2">
                    <span>{selectedRequest.tracking_code}</span>
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-xl text-[#5A6E63] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#EAE7DF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A6E63] font-semibold">Current State:</span>
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusBadge(selectedRequest.status)}`}>
                    {selectedRequest.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6E63]">Service Category:</span>
                  <span className="font-bold text-[#1B231F]">{getServiceTypeLabel(selectedRequest.request_type)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6E63]">Risk Level:</span>
                  <span className="font-bold font-mono text-[#1B231F]">{selectedRequest.risk_level}</span>
                </div>
              </div>

              {/* Payload Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6E63]">
                  Request Payload Data
                </h3>
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EAE7DF] space-y-2 text-xs">
                  {Object.entries(selectedRequest.payload || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#EAE7DF]/50 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-[#5A6E63] capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span className="font-bold text-[#1B231F] text-right">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* If Approved Lab Booking, show Pass Button */}
              {selectedRequest.request_type === 'LAB_BOOKING' && (selectedRequest.status === 'APPROVED' || selectedRequest.status === 'COMPLETED') && (
                <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                    <Award className="w-4 h-4 text-[#2E7D32]" />
                    <span>Digital Entry Pass Issued</span>
                  </div>
                  <button
                    onClick={() => {
                      const passObj = {
                        accessPassCode: selectedRequest.payload?.access_pass_code || 'PASS-LAB-AI-4019',
                        studentName: 'Kaushal Raj Gupta',
                        studentRegNo: '2023-CSE-042',
                        labName: 'Advanced AI & GPU Computing Lab',
                        roomNo: 'Room C-204',
                        workstationNo: selectedRequest.payload?.workstation_no || 14,
                        dateSlot: '2026-08-24, 14:00 - 16:00',
                        purpose: selectedRequest.payload?.purpose || 'Capstone Research',
                        approverName: 'Prof. A. K. Samanta',
                        qrPayload: selectedRequest.payload?.qr_payload,
                      };
                      setActivePassModal(passObj);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View &amp; Print Signed Digital Access Pass</span>
                  </button>
                </div>
              )}

              {/* If Approved Certificate, show Certificate Button */}
              {selectedRequest.request_type === 'CERTIFICATE' && (selectedRequest.status === 'APPROVED' || selectedRequest.status === 'COMPLETED') && (
                <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                    <FileText className="w-4 h-4 text-[#2E7D32]" />
                    <span>Official Bonafide Certificate Ready</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      navigate('/services/certificate');
                    }}
                    className="w-full py-2.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>View &amp; Download Signed Certificate PDF</span>
                  </button>
                </div>
              )}

              {/* State Machine Security Guarantee */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>State Machine Security Guarantee</span>
                </div>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Status transitions are deterministic and cryptographically auditable. Terminal states (`COMPLETED`, `REJECTED`) are immutable.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-[#EAE7DF] flex items-center gap-3">
              <button
                onClick={() => {
                  const url = getTargetUrl(selectedRequest.request_type);
                  setSelectedRequest(null);
                  navigate(url);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#152E22] hover:bg-[#1E3A2B] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Navigate to Service Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Pass Modal */}
      {activePassModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE7DF] space-y-4 relative">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <span className="text-xs font-bold text-[#1B231F] uppercase tracking-wider">
                Official Digital Access Pass
              </span>
              <button
                onClick={() => setActivePassModal(null)}
                className="p-1.5 rounded-full text-[#8C9C92] hover:text-[#1B231F] hover:bg-[#FAF8F3] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DigitalAccessPass
              accessPassCode={activePassModal.accessPassCode}
              studentName={activePassModal.studentName}
              studentRegNo={activePassModal.studentRegNo}
              labName={activePassModal.labName}
              roomNo={activePassModal.roomNo}
              workstationNo={activePassModal.workstationNo}
              dateSlot={activePassModal.dateSlot}
              purpose={activePassModal.purpose}
              approverName={activePassModal.approverName}
              qrPayload={activePassModal.qrPayload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
